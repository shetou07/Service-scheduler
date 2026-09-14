import {
  NotificationChannel,
  NotificationStatus,
  NotificationType,
  Prisma,
  PrismaClient,
} from '@prisma/client';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';
import type { WASocket } from '@whiskeysockets/baileys';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import * as QRCode from 'qrcode';
import { createWriteStream } from 'fs';
import { mkdir, readFile, readdir, rm } from 'fs/promises';
import * as path from 'path';
import { pipeline } from 'stream/promises';
import { Readable } from 'stream';
import {
  setWhatsAppQr,
  setWhatsAppQrDisconnected,
  setWhatsAppQrDisabled,
  setWhatsAppQrError,
  setWhatsAppQrInitializing,
  setWhatsAppQrReady,
} from '../modules/notifications/whatsapp-qr';

const prisma = new PrismaClient();
type NotificationRecord = Prisma.NotificationGetPayload<{
  include: { booking: { include: { client: true; service: true; slot: true } } };
}>;
type R2Config = { accessKeyId: string; secretAccessKey: string; bucket: string; endpoint: string };
type BaileysManifest = { files: string[] };
type BaileysModule = typeof import('@whiskeysockets/baileys');

let whatsappSocket: WASocket | null = null;
let reconnectTimer: NodeJS.Timeout | undefined;
let backupTimer: NodeJS.Timeout | undefined;

function loadBaileys(): Promise<BaileysModule> {
  // Keep the ESM-only Baileys package out of Nest's CommonJS startup path.
  return new Function('modulePath', 'return import(modulePath)')(
    '@whiskeysockets/baileys',
  ) as Promise<BaileysModule>;
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

async function sendEmail(notification: NotificationRecord) {
  const email = emailFor(notification);
  const gmailUser = process.env.GMAIL_SMTP_USER;
  const gmailAppPassword = process.env.GMAIL_SMTP_APP_PASSWORD;
  if (gmailUser || gmailAppPassword) {
    if (!gmailUser || !gmailAppPassword)
      throw new Error('GMAIL_SMTP_USER and GMAIL_SMTP_APP_PASSWORD must both be set');
    const result = await nodemailer
      .createTransport({ service: 'gmail', auth: { user: gmailUser, pass: gmailAppPassword } })
      .sendMail({
        from: `Coach Rickie <${gmailUser}>`,
        to: notification.recipient,
        subject: email.subject,
        html: email.html,
      });
    return result.messageId;
  }

  const resendKey = process.env.RESEND_API_KEY;
  const emailFrom = process.env.EMAIL_FROM;
  if (!resendKey || !emailFrom)
    throw new Error(
      'Configure Gmail SMTP or set RESEND_API_KEY and EMAIL_FROM to send email notifications',
    );
  const result = await new Resend(resendKey).emails.send({
    from: emailFrom,
    to: notification.recipient,
    subject: email.subject,
    html: email.html,
  });
  if (result.error) throw new Error(result.error.message);
  return result.data?.id;
}
function whatsappEnabled() {
  return process.env.WHATSAPP_ENABLED === 'true';
}
function whatsappRecipient(value: string) {
  const recipient = value.replace(/\D/g, '');
  if (!recipient) throw new Error('ADMIN_WHATSAPP_RECIPIENT must contain a phone number');
  return `${recipient}@s.whatsapp.net`;
}
function whatsappMessage(notification: NotificationRecord) {
  if (notification.type !== NotificationType.BOOKING_CONFIRMED)
    throw new Error(`Unsupported WhatsApp notification type: ${notification.type}`);
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
function r2Config(): R2Config {
  const accessKeyId = process.env.WHATSAPP_R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.WHATSAPP_R2_SECRET_ACCESS_KEY;
  const bucket = process.env.WHATSAPP_R2_BUCKET;
  const endpoint = process.env.WHATSAPP_R2_ENDPOINT;
  if (!accessKeyId || !secretAccessKey || !bucket || !endpoint)
    throw new Error(
      'WHATSAPP_R2_ACCESS_KEY_ID, WHATSAPP_R2_SECRET_ACCESS_KEY, WHATSAPP_R2_BUCKET, and WHATSAPP_R2_ENDPOINT are required when WhatsApp is enabled',
    );
  return { accessKeyId, secretAccessKey, bucket, endpoint };
}

class R2BaileysStore {
  private readonly prefix = 'whatsapp-sessions/baileys';
  constructor(
    private readonly bucket: string,
    private readonly client: S3Client,
  ) {}
  private key(file: string) {
    return `${this.prefix}/${file}`;
  }
  private safeFilePath(folder: string, file: string) {
    const target = path.resolve(folder, file);
    if (target !== folder && !target.startsWith(`${folder}${path.sep}`))
      throw new Error('Invalid R2 WhatsApp session file path');
    return target;
  }
  async restore(folder: string) {
    await mkdir(folder, { recursive: true });
    console.log('Checking Cloudflare R2 Baileys session backup');
    let manifest: BaileysManifest;
    try {
      const result = await this.client.send(
        new GetObjectCommand({ Bucket: this.bucket, Key: this.key('manifest.json') }),
        { abortSignal: AbortSignal.timeout(15_000) },
      );
      if (!result.Body) throw new Error('R2 session manifest was empty');
      const chunks: Buffer[] = [];
      for await (const chunk of result.Body as Readable) chunks.push(Buffer.from(chunk));
      manifest = JSON.parse(Buffer.concat(chunks).toString('utf8')) as BaileysManifest;
      if (
        !Array.isArray(manifest.files) ||
        !manifest.files.every((file) => typeof file === 'string')
      )
        throw new Error('R2 session manifest is invalid');
    } catch (error) {
      const details = error as { name?: string; $metadata?: { httpStatusCode?: number } };
      if (
        details.name === 'NoSuchKey' ||
        details.name === 'NotFound' ||
        details.$metadata?.httpStatusCode === 404
      ) {
        console.log('No Cloudflare R2 Baileys session backup found; QR login is required');
        return false;
      }
      throw error;
    }
    await Promise.all(
      manifest.files.map(async (file) => {
        const result = await this.client.send(
          new GetObjectCommand({ Bucket: this.bucket, Key: this.key(file) }),
          { abortSignal: AbortSignal.timeout(30_000) },
        );
        if (!result.Body) throw new Error(`R2 session file ${file} was empty`);
        const target = this.safeFilePath(folder, file);
        await mkdir(path.dirname(target), { recursive: true });
        await pipeline(result.Body as Readable, createWriteStream(target));
      }),
    );
    console.log('Cloudflare R2 Baileys session backup restored');
    return true;
  }
  async backup(folder: string) {
    const files = await this.files(folder);
    await Promise.all(
      files.map(async (file) =>
        this.client.send(
          new PutObjectCommand({
            Bucket: this.bucket,
            Key: this.key(file),
            Body: await readFile(this.safeFilePath(folder, file)),
          }),
          { abortSignal: AbortSignal.timeout(30_000) },
        ),
      ),
    );
    await this.client.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: this.key('manifest.json'),
        Body: JSON.stringify({ files } satisfies BaileysManifest),
        ContentType: 'application/json',
      }),
      { abortSignal: AbortSignal.timeout(15_000) },
    );
    console.log('Baileys session backup saved to Cloudflare R2');
  }
  private async files(folder: string, relative = ''): Promise<string[]> {
    const entries = await readdir(path.join(folder, relative), { withFileTypes: true });
    const nested = await Promise.all(
      entries.map(async (entry) => {
        const next = path.join(relative, entry.name);
        return entry.isDirectory() ? this.files(folder, next) : [next];
      }),
    );
    return nested.flat();
  }
}

async function createWhatsAppClient() {
  if (!whatsappEnabled()) {
    console.log('WhatsApp notifications are disabled');
    setWhatsAppQrDisabled();
    return;
  }
  const senderNumber = process.env.WHATSAPP_SENDER_NUMBER;
  if (!senderNumber) throw new Error('WHATSAPP_SENDER_NUMBER is required when WhatsApp is enabled');
  const r2 = r2Config();
  const client = new S3Client({
    region: 'auto',
    endpoint: r2.endpoint,
    forcePathStyle: true,
    credentials: { accessKeyId: r2.accessKeyId, secretAccessKey: r2.secretAccessKey },
  });
  const authFolder = process.env.WHATSAPP_AUTH_PATH || '/tmp/baileys-auth';
  const store = new R2BaileysStore(r2.bucket, client);
  console.log(`Starting Baileys WhatsApp session with Cloudflare R2 bucket ${r2.bucket}`);
  setWhatsAppQrInitializing();
  await rm(authFolder, { recursive: true, force: true });
  await store.restore(authFolder);
  const { DisconnectReason, makeWASocket, useMultiFileAuthState } = await loadBaileys();
  const { state, saveCreds } = await useMultiFileAuthState(authFolder);
  const socket = makeWASocket({ auth: state, markOnlineOnConnect: false });
  whatsappSocket = socket;
  const backup = () => {
    clearTimeout(backupTimer);
    backupTimer = setTimeout(
      () =>
        void store.backup(authFolder).catch((error: unknown) => {
          const message = error instanceof Error ? error.message : String(error);
          console.error('Baileys R2 backup failed', error);
          setWhatsAppQrError(`Baileys session backup failed: ${message}`);
        }),
      1_000,
    );
  };
  socket.ev.on(
    'creds.update',
    () =>
      void saveCreds()
        .then(backup)
        .catch((error: unknown) => console.error('Saving Baileys credentials failed', error)),
  );
  socket.ev.on('connection.update', ({ connection, lastDisconnect, qr }) => {
    if (qr) {
      console.log(`Scan the WhatsApp QR code from the admin dashboard with ${senderNumber}`);
      void QRCode.toDataURL(qr, { errorCorrectionLevel: 'M', margin: 2, width: 360 })
        .then(setWhatsAppQr)
        .catch((error: unknown) => {
          const message = error instanceof Error ? error.message : String(error);
          setWhatsAppQrError(`Could not generate the WhatsApp QR image: ${message}`);
        });
    }
    if (connection === 'open') {
      console.log(`Baileys WhatsApp sender ${senderNumber} is ready`);
      setWhatsAppQrReady();
      backup();
    }
    if (connection === 'close') {
      const details = lastDisconnect?.error as { output?: { statusCode?: number } } | undefined;
      if (details?.output?.statusCode === DisconnectReason.loggedOut) {
        whatsappSocket = null;
        setWhatsAppQrError('WhatsApp logged out. Restart the API to scan a new QR code.');
        return;
      }
      setWhatsAppQrDisconnected('WhatsApp disconnected; reconnecting.');
      clearTimeout(reconnectTimer);
      reconnectTimer = setTimeout(
        () =>
          void createWhatsAppClient().catch((error: unknown) => {
            const message = error instanceof Error ? error.message : String(error);
            setWhatsAppQrError(`WhatsApp reconnection failed: ${message}`);
          }),
        5_000,
      );
    }
  });
}
async function sendWhatsApp(notification: NotificationRecord) {
  if (!whatsappSocket) throw new Error('WhatsApp is not connected');
  const result = await whatsappSocket.sendMessage(whatsappRecipient(notification.recipient), {
    text: whatsappMessage(notification),
  });
  if (!result?.key.id) throw new Error('WhatsApp did not return a message ID');
  return result.key.id;
}

export async function deliverRecommendationWhatsApp(requestId: string) {
  const request = await prisma.recommendationRequest.findUnique({ where: { id: requestId } });
  if (!request || request.whatsAppStatus === NotificationStatus.SENT) return;
  try {
    if (!whatsappEnabled()) throw new Error('WhatsApp notifications are disabled');
    const recipient = process.env.ADMIN_WHATSAPP_RECIPIENT;
    if (!recipient) throw new Error('ADMIN_WHATSAPP_RECIPIENT is not configured');
    if (!whatsappSocket) throw new Error('WhatsApp is not connected');
    const message = [
      'New coach & gym recommendation request',
      `Name: ${request.fullName}`,
      `Phone: ${request.phone}`,
      `Email: ${request.email || 'Not provided'}`,
      `Preferred gym location: ${request.gymLocation}`,
      `Service needed: ${request.serviceNeed}`,
      `Goal: ${request.goal}`,
    ].join('\n');
    const result = await whatsappSocket.sendMessage(whatsappRecipient(recipient), {
      text: message,
    });
    if (!result?.key.id) throw new Error('WhatsApp did not return a message ID');
    await prisma.recommendationRequest.update({
      where: { id: request.id },
      data: {
        whatsAppStatus: NotificationStatus.SENT,
        whatsAppSentAt: new Date(),
        whatsAppError: null,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Recommendation WhatsApp alert ${requestId} failed`, error);
    await prisma.recommendationRequest.update({
      where: { id: requestId },
      data: { whatsAppStatus: NotificationStatus.FAILED, whatsAppError: message.slice(0, 2_000) },
    });
  }
}

export async function deliverNotification(notificationId: string) {
  const notification = await prisma.notification.findUnique({
    where: { id: notificationId },
    include: { booking: { include: { client: true, service: true, slot: true } } },
  });
  if (!notification || notification.status === NotificationStatus.SENT) return;

  try {
    const isWhatsApp = notification.channel === NotificationChannel.WHATSAPP;
    let providerMessageId: string | undefined;
    if (isWhatsApp) {
      providerMessageId = await sendWhatsApp(notification);
    } else {
      providerMessageId = await sendEmail(notification);
    }

    await prisma.notification.update({
      where: { id: notification.id },
      data: {
        status: NotificationStatus.SENT,
        sentAt: new Date(),
        errorMessage: null,
        providerMessageId,
        providerStatus: 'sent',
        payload: Prisma.DbNull,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Notification ${notificationId} failed`, error);
    await prisma.notification.update({
      where: { id: notificationId },
      data: {
        status: NotificationStatus.FAILED,
        retryCount: { increment: 1 },
        errorMessage: message.slice(0, 2_000),
        providerStatus: 'failed',
      },
    });
  }
}

export async function startNotificationDelivery() {
  console.log('Starting direct notification delivery');
  try {
    await createWhatsAppClient();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('WhatsApp failed to initialize; email delivery will continue', error);
    setWhatsAppQrError(`WhatsApp could not initialize: ${message}`);
  }
  const pending = await prisma.notification.findMany({
    where: { status: NotificationStatus.PENDING },
    select: { id: true },
    orderBy: { createdAt: 'asc' },
    take: 100,
  });
  await Promise.all(pending.map((notification) => deliverNotification(notification.id)));
  if (pending.length)
    console.log(`Attempted direct delivery for ${pending.length} pending notifications`);
  console.log('Direct notification delivery is ready');
  return async () => {
    clearTimeout(reconnectTimer);
    clearTimeout(backupTimer);
    whatsappSocket?.end(undefined);
    whatsappSocket = null;
    await prisma.$disconnect();
  };
}
