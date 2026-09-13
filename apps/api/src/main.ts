import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { startNotificationProcessor } from './workers/notification.worker';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const allowedOrigins = (process.env.APP_URL || 'http://localhost:3002,http://127.0.0.1:3002')
    .split(',')
    .map((origin) => origin.trim());
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (error: Error | null, allow?: boolean) => void,
    ) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Origin is not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(process.env.PORT || 4000, '0.0.0.0');
  console.log('Starting background notification processor');
  void startNotificationProcessor()
    .then((stopNotifications) => {
      const shutdown = async () => {
        await stopNotifications();
        await app.close();
      };
      process.once('SIGINT', () => void shutdown());
      process.once('SIGTERM', () => void shutdown());
    })
    .catch((error: unknown) => {
      console.error('Notification processor failed to start', error);
    });
}
bootstrap();
