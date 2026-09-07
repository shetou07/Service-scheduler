ALTER TABLE "Notification" ADD COLUMN "payload" JSONB;

CREATE INDEX "Notification_status_createdAt_idx" ON "Notification"("status", "createdAt");
