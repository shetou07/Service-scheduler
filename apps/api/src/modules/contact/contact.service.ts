import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

type ContactMessage = { fullName: string; email: string; phone?: string; message: string };

@Injectable()
export class ContactService {
  constructor(private readonly config: ConfigService) {}

  async send(message: ContactMessage) {
    const apiKey = this.config.get<string>('RESEND_API_KEY');
    const from = this.config.get<string>('EMAIL_FROM');
    const recipient = this.config.get<string>('CONTACT_RECIPIENT_EMAIL');
    if (!apiKey || !from || !recipient) throw new ServiceUnavailableException('Feedback delivery is not configured yet. Please call us instead.');
    await new Resend(apiKey).emails.send({
      from,
      to: recipient,
      replyTo: message.email.trim().toLowerCase(),
      subject: `Website feedback from ${message.fullName.trim()}`,
      text: [`Name: ${message.fullName.trim()}`, `Email: ${message.email.trim().toLowerCase()}`, `Phone: ${message.phone?.trim() || 'Not provided'}`, '', 'Message:', message.message.trim()].join('\n'),
    });
    return { ok: true };
  }
}
