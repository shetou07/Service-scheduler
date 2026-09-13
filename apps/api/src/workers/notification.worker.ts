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
import { DeleteObjectCommand, GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Client, Message, RemoteAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import * as QRCode from 'qrcode';
import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';
import * as path from 'path';
import {
  setWhatsAppQr,
  setWhatsAppQrDisconnected,
  setWhatsAppQrDisabled,
  setWhatsAppQrError,
  setWhatsAppQrInitializing,
  setWhatsAppQrReady,
} from '../modules/notifications/whatsapp-qr';

const queueName = 'coach-rickie-notifications';
const retryAttempts = 5;
const pollIntervalMs = Number(process.env.NOTIFICATION_POLL_MS || 30_000);
const prisma = new PrismaClient();

type NotificationJob = { notificationId: string };
type NotificationRecord = Prisma.NotificationGetPayload<{
  include: { booking: { include: { client: true; service: true; slot: true } } };
}>;
type SessionReference = { session: string };
type SessionExtractReference = SessionReference & { path: string };

class R2SessionStore {
  constructor(
    private readonly bucket: string,
    private readonly client: S3Client,
    private readonly localDataPath: string,
    private readonly prefix = 'whatsapp-sessions',
  ) {}

  private key(session: string) {
    return path.posix.join(this.prefix, `${session}.zip`);
  }

  private async request<T>(operation: string, run: () => Promise<T>) {
    try {
      return await run();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Cloudflare R2 ${operation} failed: ${message}`);
    }
  }

  async sessionExists({ session }: SessionReference) {
    const key = this.key(session);
    console.log(`Checking Cloudflare R2 session backup: ${key}`);
    try {
      await this.client.send(
        new HeadObjectCommand({ Bucket: this.bucket, Key: key }),
        { abortSignal: AbortSignal.timeout(15_000) },
      );
      console.log('Cloudflare R2 session backup found');
      return true;
    } catch (error) {
      const details = error as { name?: string; $metadata?: { httpStatusCode?: number } };
      if (
        details.name === 'NotFound' ||
        details.name === 'NoSuchKey' ||
        details.$metadata?.httpStatusCode === 404
      ) {
        console.log('No Cloudflare R2 session backup found; QR login is required');
        return false;
      }
      const message = error instanceof Error ? error.message : String(error);
      throw new Error(`Cloudflare R2 session check failed: ${message}`);
    }
  }

  async save({ session }: SessionReference) {
    const file = `${session}.zip`;
    await this.request('session backup upload', () =>
      this.client.send(
        new PutObjectCommand({
          Bucket: this.bucket,
          Key: this.key(session),
          Body: createReadStream(path.join(this.localDataPath, file)),
        }),
        { abortSignal: AbortSignal.timeout(30_000) },
      ),
    );
  }

  async extract({ session, path: destination }: SessionExtractReference) {
    const response = await this.request('session backup download', () =>
      this.client.send(
        new GetObjectCommand({ Bucket: this.bucket, Key: this.key(session) }),
        { abortSignal: AbortSignal.timeout(30_000) },
      ),
    );
    if (!response.Body) throw new Error('Cloudflare R2 session backup was empty');
    await pipeline(response.Body as Readable, createWriteStream(destination));
  }

  async delete({ session }: SessionReference) {
    await this.request('session backup deletion', () =>
      this.client.send(
        new DeleteObjectCommand({ Bucket: this.bucket, Key: this.key(session) }),
        { abortSignal: AbortSignal.timeout(15_000) },
      ),
    );
  }
}

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

function r2Config() {
  const accountId = process.env.WHATSAPP_R2_ACCOUNT_ID;
  const accessKeyId = process.env.WHATSAPP_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.WHATSAPP_R2_SECRET_ACCESS_KEY;
  const bucket = process.env.WHATSAPP_R2_BUCKET;
  const endpoint = process.env.WHATSAPP_R2_ENDPOINT;
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !endpoint) {
    throw new Error(
      'WHATSAPP_R2_ACCOUNT_ID, WHATSAPP_R2_ACCESS_KEY_ID, WHATSAPP_R2_SECRET_ACCESS_KEY, WHATSAPP_R2_BUCKET, and WHATSAPP_R2_ENDPOINT are required when WhatsApp is enabled',
    );
  }
  return { accountId, accessKeyId, secretAccessKey, bucket, endpoint };
}

function createWhatsAppClient() {
  if (!whatsappEnabled()) {
    console.log('WhatsApp notifications are disabled');
    setWhatsAppQrDisabled();
    return null;
  }

  const senderNumber = process.env.WHATSAPP_SENDER_NUMBER;
  if (!senderNumber) throw new Error('WHATSAPP_SENDER_NUMBER is required when WhatsApp is enabled');
  const r2 = r2Config();
  console.log(`Starting WhatsApp session with Cloudflare R2 bucket ${r2.bucket}`);
  setWhatsAppQrInitializing();
  const s3 = new S3Client({
    region: 'auto',
    endpoint: r2.endpoint,
    forcePathStyle: true,
    credentials: { accessKeyId: r2.accessKeyId, secretAccessKey: r2.secretAccessKey },
  });
  const authDataPath = process.env.WHATSAPP_AUTH_PATH || '/tmp/whatsapp-auth';
  const store = new R2SessionStore(r2.bucket, s3, authDataPath);

  const client = new Client({
    authStrategy: new RemoteAuth({
      clientId: 'coach-rickie-notifications',
      dataPath: authDataPath,
      store: store as NonNullable<ConstructorParameters<typeof RemoteAuth>[0]>['store'],
      backupSyncIntervalMs: 60_000,
    }),
    puppeteer: {
      headless: true,
      executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    },
  });

  client.on('qr', (qr) => {
    console.log(`Scan this QR code in WhatsApp Linked devices for ${senderNumber}:`);
    qrcode.generate(qr, { small: true });
    void QRCode.toDataURL(qr, { errorCorrectionLevel: 'M', margin: 2, width: 360 })
      .then(setWhatsAppQr)
      .catch((error: unknown) => {
        const message = error instanceof Error ? error.message : String(error);
        setWhatsAppQrError(`Could not generate the WhatsApp QR image: ${message}`);
      });
  });
  client.on('disconnected', (reason) => {
    console.error('WhatsApp session disconnected', reason);
    setWhatsAppQrDisconnected(String(reason));
  });
  client.on('ready', () => {
    console.log(`WhatsApp sender ${senderNumber} is ready`);
    setWhatsAppQrReady();
  });
  client.on('remote_session_saved', () => {
    console.log('WhatsApp session backup saved to Cloudflare R2');
  });
  client.on('auth_failure', (message) => {
    console.error('WhatsApp authentication failed', message);
    setWhatsAppQrError(`WhatsApp authentication failed: ${message}`);
  });
  void client.initialize().catch((error: unknown) => {
    console.error('WhatsApp failed to initialize', error);
    const message = error instanceof Error ? error.message : String(error);
    setWhatsAppQrError(`WhatsApp failed to initialize: ${message}`);
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

export async function startNotificationProcessor() {
  const redisUrl = process.env.REDIS_URL;
  const resendKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM;
  if (!redisUrl) throw new Error('REDIS_URL is required for the notification worker');
  if (!resendKey || !emailFrom)
    throw new Error('RESEND_API_KEY and EMAIL_FROM are required for the notification worker');

  console.log('Starting notification processor');
  const connection = new IORedis(redisUrl, { maxRetriesPerRequest: null });
  const queue = new Queue<NotificationJob>(queueName, { connection });
  const resend = new Resend(resendKey);
  const whatsapp = createWhatsAppClient();
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
  console.log('Notification processor is running');
  return async () => {
    clearInterval(recoveryTimer);
    await worker.close();
    await queue.close();
    await connection.quit();
    await whatsapp?.destroy();
    await prisma.$disconnect();
  };
}

async function main() {
  const shutdown = await startNotificationProcessor();
  const exit = async () => {
    await shutdown();
    process.exit(0);
  };
  process.once('SIGINT', () => void exit());
  process.once('SIGTERM', () => void exit());
}

if (require.main === module) {
  void main().catch(async (error: unknown) => {
    console.error('Notification processor failed to start', error);
    await prisma.$disconnect();
    process.exit(1);
  });
}
