import { Job, Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import { NotificationStatus, NotificationType, Prisma, PrismaClient } from '@prisma/client';
import { Resend } from 'resend';

const queueName = 'coach-rickie-notifications';
const retryAttempts = 5;
const pollIntervalMs = Number(process.env.NOTIFICATION_POLL_MS || 30_000);
const prisma = new PrismaClient();

type NotificationJob = { notificationId: string };
type NotificationRecord = Prisma.NotificationGetPayload<{
  include: { booking: { include: { client: true; service: true; slot: true } } };
}>;

function manageToken(payload: Prisma.JsonValue | null) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return undefined;
  const token = (payload as Record<string, unknown>).manageToken;
  return typeof token === 'string' ? token : undefined;
}

function appointmentTime(value: Date) {
  return value.toLocaleString('en-UG', {
    timeZone: 'Africa/Kampala',
    dateStyle: 'full',
    timeStyle: 'short',
  });
}

function emailFor(notification: NotificationRecord) {
  const { booking } = notification;
  const when = appointmentTime(booking.slot.startAt);
  const manage = manageToken(notification.payload);
  const appUrl = process.env.APP_URL?.replace(/\/$/, '');
  const manageLink =
    manage && appUrl
      ? `<p><a href="${appUrl}/manage-booking/${manage}">Manage this booking</a></p>`
      : '';

  if (notification.type === NotificationType.BOOKING_CANCELLED)
    return {
      subject: `Booking cancelled — ${booking.bookingReference}`,
      html: `<p>Hello ${booking.client.fullName},</p><p>Your ${booking.service.name} booking on ${when} has been cancelled.</p><p>Reference: <strong>${booking.bookingReference}</strong></p>`,
    };
  if (notification.type === NotificationType.BOOKING_RESCHEDULED)
    return {
      subject: `Booking rescheduled — ${booking.bookingReference}`,
      html: `<p>Hello ${booking.client.fullName},</p><p>Your ${booking.service.name} booking has been rescheduled to ${when}.</p><p>Reference: <strong>${booking.bookingReference}</strong></p>${manageLink}`,
    };
  if (notification.type === NotificationType.BOOKING_REMINDER)
    return {
      subject: `Reminder — ${booking.service.name}`,
      html: `<p>Hello ${booking.client.fullName},</p><p>This is a reminder for your ${booking.service.name} booking on ${when}.</p><p>Reference: <strong>${booking.bookingReference}</strong></p>${manageLink}`,
    };
  return {
    subject: `Booking confirmed — ${booking.bookingReference}`,
    html: `<p>Hello ${booking.client.fullName},</p><p>Your ${booking.service.name} booking is confirmed for ${when}.</p><p>Reference: <strong>${booking.bookingReference}</strong></p>${manageLink}`,
  };
}

async function main() {
  const redisUrl = process.env.REDIS_URL;
  const resendKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM;
  if (!redisUrl) throw new Error('REDIS_URL is required for the notification worker');
  if (!resendKey || !emailFrom)
    throw new Error('RESEND_API_KEY and EMAIL_FROM are required for the notification worker');

  const connection = new IORedis(redisUrl, { maxRetriesPerRequest: null });
  const queue = new Queue<NotificationJob>(queueName, { connection });
  const resend = new Resend(resendKey);
  const enqueue = (notificationId: string) =>
    queue.add(
      'deliver',
      { notificationId },
      {
        jobId: notificationId,
        attempts: retryAttempts,
        backoff: { type: 'exponential', delay: 5_000 },
        removeOnComplete: 1_000,
        removeOnFail: 1_000,
      },
    );
  const recoverPending = async () => {
    const pending = await prisma.notification.findMany({
      where: { status: NotificationStatus.PENDING },
      select: { id: true },
      orderBy: { createdAt: 'asc' },
      take: 100,
    });
    await Promise.all(pending.map((notification) => enqueue(notification.id)));
  };

  const worker = new Worker<NotificationJob>(
    queueName,
    async (job) => {
      const notification = await prisma.notification.findUnique({
        where: { id: job.data.notificationId },
        include: { booking: { include: { client: true, service: true, slot: true } } },
      });
      if (!notification || notification.status === NotificationStatus.SENT) return;
      const email = emailFor(notification);
      const result = await resend.emails.send({
        from: emailFrom,
        to: notification.recipient,
        subject: email.subject,
        html: email.html,
      });
      if (result.error) throw new Error(result.error.message);
      await prisma.notification.update({
        where: { id: notification.id },
        data: {
          status: NotificationStatus.SENT,
          sentAt: new Date(),
          errorMessage: null,
          payload: Prisma.DbNull,
        },
      });
    },
    { connection, concurrency: 5 },
  );

  worker.on('failed', (job: Job<NotificationJob> | undefined, error) => {
    if (!job) return;
    const finalAttempt = job.attemptsMade >= (job.opts.attempts || 1);
    void prisma.notification.updateMany({
      where: { id: job.data.notificationId, status: NotificationStatus.PENDING },
      data: {
        status: finalAttempt ? NotificationStatus.FAILED : NotificationStatus.PENDING,
        retryCount: job.attemptsMade,
        errorMessage: error.message.slice(0, 2_000),
      },
    });
  });

  await recoverPending();
  const recoveryTimer = setInterval(() => {
    void recoverPending().catch((error: unknown) =>
      console.error('Notification recovery failed', error),
    );
  }, pollIntervalMs);
  const shutdown = async () => {
    clearInterval(recoveryTimer);
    await worker.close();
    await queue.close();
    await connection.quit();
    await prisma.$disconnect();
  };
  process.once('SIGINT', () => {
    void shutdown().then(() => process.exit(0));
  });
  process.once('SIGTERM', () => {
    void shutdown().then(() => process.exit(0));
  });
  console.log('Notification worker is running');
}

void main().catch(async (error: unknown) => {
  console.error('Notification worker failed to start', error);
  await prisma.$disconnect();
  process.exit(1);
});
