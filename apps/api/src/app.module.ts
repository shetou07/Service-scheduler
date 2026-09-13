import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './database/prisma.service';
import { HealthController } from './common/health/health.controller';
import {
  AdminOperationsController,
  AdminServicesController,
  ManageBookingController,
  ServicesController,
  BookingController,
  AvailabilityController,
} from './modules/scheduling/scheduling.controller';
import { SchedulingService } from './modules/scheduling/scheduling.service';
import { AuthModule } from './modules/auth/auth.module';
import { ContactController } from './modules/contact/contact.controller';
import { ContactService } from './modules/contact/contact.service';
import { AdminWhatsAppController } from './modules/notifications/admin-whatsapp.controller';
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule],
  controllers: [
    HealthController,
    ServicesController,
    AdminServicesController,
    AvailabilityController,
    BookingController,
    ManageBookingController,
    AdminOperationsController,
    ContactController,
    AdminWhatsAppController,
  ],
  providers: [PrismaService, SchedulingService, ContactService],
})
export class AppModule {}
