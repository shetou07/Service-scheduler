CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL', 'WHATSAPP');

ALTER TABLE "Notification"
ADD COLUMN "channel" "NotificationChannel" NOT NULL DEFAULT 'EMAIL',
ADD COLUMN "providerMessageId" TEXT,
ADD COLUMN "providerStatus" TEXT;

CREATE UNIQUE INDEX "Notification_providerMessageId_key" ON "Notification"("providerMessageId");
CREATE INDEX "Notification_channel_status_createdAt_idx" ON "Notification"("channel", "status", "createdAt");
