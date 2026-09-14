import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';
import nodemailer from 'nodemailer';

type ContactMessage = { fullName: string; email: string; phone?: string; message: string };

@Injectable()
export class ContactService {
  constructor(private readonly config: ConfigService) {}

  async send(message: ContactMessage) {
    const recipient = this.config.get<string>('CONTACT_RECIPIENT_EMAIL');
    const gmailUser = this.config.get<string>('GMAIL_SMTP_USER');
    const gmailAppPassword = this.config.get<string>('GMAIL_SMTP_APP_PASSWORD');
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    const from = this.config.get<string>('EMAIL_FROM');
    if (
      !recipient ||
      (!gmailUser && !apiKey) ||
      (!gmailAppPassword && !apiKey) ||
      (!from && !gmailUser)
    )
      throw new ServiceUnavailableException(
        'Feedback delivery is not configured yet. Please call us instead.',
      );
    const payload = {
      to: recipient,
      replyTo: message.email.trim().toLowerCase(),
      subject: `Website feedback from ${message.fullName.trim()}`,
      text: [
        `Name: ${message.fullName.trim()}`,
        `Email: ${message.email.trim().toLowerCase()}`,
        `Phone: ${message.phone?.trim() || 'Not provided'}`,
        '',
        'Message:',
        message.message.trim(),
      ].join('\n'),
    };
    if (gmailUser && gmailAppPassword) {
      await nodemailer
        .createTransport({ service: 'gmail', auth: { user: gmailUser, pass: gmailAppPassword } })
        .sendMail({ ...payload, from: `Coach Rickie <${gmailUser}>` });
    } else if (apiKey && from) {
      const result = await new Resend(apiKey).emails.send({ ...payload, from });
      if (result.error) throw new ServiceUnavailableException(result.error.message);
    } else {
      throw new ServiceUnavailableException(
        'Feedback delivery is not configured yet. Please call us instead.',
      );
    }
    return { ok: true };
  }
}
