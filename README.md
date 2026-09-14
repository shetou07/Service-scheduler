# Coach Rickie Scheduling System

Production-oriented monorepo: Next.js client portal in `apps/web`, NestJS/Prisma API in `apps/api`, PostgreSQL, and direct email/WhatsApp notification delivery. The original Vite prototype is retained under `legacy/vite-prototype` while its screens are migrated.

## Local setup

1. Copy `.env.example` to `.env`, set a strong `JWT_SECRET`, and add your Neon pooled and direct connection URLs. When running the API from `apps/api`, put the same variables in `apps/api/.env`.
2. Docker Postgres is optional for offline development: run `docker compose up -d` only when using its local `DATABASE_URL` and `DIRECT_URL` values.
3. Run `npm install`, `npm run db:generate`, `npx prisma migrate deploy` from `apps/api`, and `npm run db:seed` for local development or staging only.
4. Run `npm run dev`; web runs on port 3002 and the API on 4000.

The seed admin credentials are configured by `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`. Change them before any shared deployment.

## Email delivery

Set `GMAIL_SMTP_USER` to the company Gmail address and `GMAIL_SMTP_APP_PASSWORD` to a Google App Password to send booking, cancellation, rescheduling, and contact-form emails through Gmail. Gmail is used whenever both values are set; otherwise the app uses Resend (`RESEND_API_KEY` and `EMAIL_FROM`). Enable two-step verification on the Gmail account before creating its App Password. Never use or store the normal Gmail password.

## WhatsApp admin alerts

When `WHATSAPP_ENABLED=true`, confirmed bookings create a Baileys notification for `ADMIN_WHATSAPP_RECIPIENT` immediately after the booking commits. The protected admin dashboard displays the initial QR code. Scan it in **Linked devices** from the sender account configured as `WHATSAPP_SENDER_NUMBER` (currently `+250 792 831 227`). New-booking alerts are sent to `+256 765 463 811` and contain the client name, service, Kampala date/time, booking reference, and the protected admin bookings URL only.

The Baileys session credentials are backed up to the private Cloudflare R2 bucket specified by `WHATSAPP_R2_*`; no Render disk, Redis instance, or separate worker is required. Do not make the bucket public and do not commit its credentials. If a provider send fails, the booking remains confirmed and the notification is recorded as failed; direct delivery does not retry automatically. Baileys is an unofficial WhatsApp client library, so the official Meta Cloud API remains the preferred option for a public-scale production service.
