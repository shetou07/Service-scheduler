CREATE TYPE "RecommendationStatus" AS ENUM ('NEW', 'CONTACTED', 'CLOSED');

CREATE TABLE "RecommendationRequest" (
  "id" TEXT NOT NULL,
  "fullName" TEXT NOT NULL,
  "email" TEXT,
  "phone" TEXT NOT NULL,
  "gymLocation" TEXT NOT NULL,
  "serviceNeed" TEXT NOT NULL,
  "goal" TEXT NOT NULL,
  "privacyAcceptedAt" TIMESTAMP(3) NOT NULL,
  "status" "RecommendationStatus" NOT NULL DEFAULT 'NEW',
  "whatsAppStatus" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
  "whatsAppSentAt" TIMESTAMP(3),
  "whatsAppError" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "RecommendationRequest_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "RecommendationRequest_status_createdAt_idx"
  ON "RecommendationRequest"("status", "createdAt");
CREATE INDEX "RecommendationRequest_whatsAppStatus_createdAt_idx"
  ON "RecommendationRequest"("whatsAppStatus", "createdAt");
