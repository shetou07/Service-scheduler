import { Job, Queue, Worker } from 'bullmq';
import IORedis from 'ioredis';
import {
  NotificationChannel,
  NotificationStatus,
  NotificationType,
  Prisma,
  PrismaClient,
} from '@prisma/client';
import { Resend } from 'resend';
import { Client, LocalAuth, Message } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

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

function publicAppUrl() {
  return (process.env.PUBLIC_APP_URL || process.env.APP_URL?.split(',')[0])?.replace(/\/$/, '');
}

function emailFor(notification: NotificationRecord) {
  const { booking } = notification;
  const when = appointmentTime(booking.slot.startAt);
  const manage = manageToken(notification.payload);
  const appUrl = publicAppUrl();
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

function whatsappEnabled() {
  return process.env.WHATSAPP_ENABLED === 'true';
}

function whatsappRecipient(value: string) {
  const recipient = value.replace(/\D/g, '');
  if (!recipient) throw new Error('ADMIN_WHATSAPP_RECIPIENT must contain a phone number');
  return `${recipient}@c.us`;
}

function whatsappMessage(notification: NotificationRecord) {
  if (notification.type !== NotificationType.BOOKING_CONFIRMED) {
    throw new Error(`Unsupported WhatsApp notification type: ${notification.type}`);
  }
  const booking = notification.booking;
  const appUrl = publicAppUrl();
  return [
    'New booking confirmed',
    `Client: ${booking.client.fullName}`,
    `Service: ${booking.service.name}`,
    `Time: ${appointmentTime(booking.slot.startAt)}`,
    `Reference: ${booking.bookingReference}`,
    `Manage bookings: ${appUrl ? `${appUrl}/admin/bookings` : 'Admin bookings'}`,
  ].join('\n');
}

async function createWhatsAppClient() {
  if (!whatsappEnabled()) return null;

  const senderNumber = process.env.WHATSAPP_SENDER_NUMBER;
  if (!senderNumber) throw new Error('WHATSAPP_SENDER_NUMBER is required when WhatsApp is enabled');

  const client = new Client({
    authStrategy: new LocalAuth({
      clientId: 'coach-rickie-notifications',
      dataPath: process.env.WHATSAPP_AUTH_PATH || '.whatsapp-auth',
    }),
    puppeteer: {
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    },
  });

  let ready = false;
  client.on('qr', (qr) => {
    console.log(`Scan this QR code in WhatsApp Linked devices for ${senderNumber}:`);
    qrcode.generate(qr, { small: true });
  });
  client.on('disconnected', (reason) => {
    console.error('WhatsApp session disconnected', reason);
    if (ready) process.exit(1);
  });
  await new Promise<void>((resolve, reject) => {
    client.once('ready', () => {
      ready = true;
      console.log(`WhatsApp sender ${senderNumber} is ready`);
      resolve();
    });
    client.once('auth_failure', (message) => reject(new Error(`WhatsApp authentication failed: ${message}`)));
    void client.initialize().catch(reject);
  });
  return client;
}

async function sendWhatsApp(client: Client | null, notification: NotificationRecord) {
  if (!client) throw new Error('WhatsApp notifications are disabled');
  const sent = await client.sendMessage(
    whatsappRecipient(notification.recipient),
    whatsappMessage(notification),
  );
  return sent.id._serialized;
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
  const whatsapp = await createWhatsAppClient();
  whatsapp?.on('message_ack', (message: Message, ack: number) => {
    const providerStatus = ['pending', 'sent', 'delivered', 'read', 'played'][ack] || 'sent';
    void prisma.notification.updateMany({
      where: { providerMessageId: message.id._serialized },
      data: { status: NotificationStatus.SENT, providerStatus, errorMessage: null },
    });
  });
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
      const isWhatsApp = notification.channel === NotificationChannel.WHATSAPP;
      let providerMessageId: string | undefined;
      if (isWhatsApp) {
        providerMessageId = await sendWhatsApp(whatsapp, notification);
      } else {
        const email = emailFor(notification);
        const result = await resend.emails.send({
          from: emailFrom,
          to: notification.recipient,
          subject: email.subject,
          html: email.html,
        });
        if (result.error) throw new Error(result.error.message);
      }
      await prisma.notification.update({
        where: { id: notification.id },
        data: {
          status: NotificationStatus.SENT,
          sentAt: new Date(),
          errorMessage: null,
          providerMessageId,
          providerStatus: isWhatsApp ? 'sent' : null,
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
    await whatsapp?.destroy();
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
