import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { whatsappQrStatus } from './whatsapp-qr';

@UseGuards(JwtAuthGuard)
@Controller('admin/whatsapp')
export class AdminWhatsAppController {
  @Get('qr')
  qr() {
    return whatsappQrStatus();
  }
}
