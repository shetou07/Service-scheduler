# Coach Rickie Scheduling System

Production-oriented monorepo: Next.js client portal in `apps/web`, NestJS/Prisma API in `apps/api`, PostgreSQL, Redis, and a notification worker. The original Vite prototype is retained under `legacy/vite-prototype` while its screens are migrated.

## Local setup

1. Copy `.env.example` to `.env`, set a strong `JWT_SECRET`, and add your Neon pooled and direct connection URLs. When running the API from `apps/api`, put the same variables in `apps/api/.env`.
2. Docker Postgres is optional for offline development: run `docker compose up -d` only when using its local `DATABASE_URL` and `DIRECT_URL` values.
3. Run `npm install`, `npm run db:generate`, `npx prisma migrate deploy` from `apps/api`, and `npm run db:seed` for local development or staging only.
4. Run `npm run dev`; web runs on port 3002 and the API on 4000.

The seed admin credentials are configured by `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`. Change them before any shared deployment.

## WhatsApp admin alerts

When `WHATSAPP_ENABLED=true`, confirmed bookings also create a Redis-backed WhatsApp Web notification for `ADMIN_WHATSAPP_RECIPIENT`. The API logs a QR code the first time it starts. Scan it in **Linked devices** from the sender account configured as `WHATSAPP_SENDER_NUMBER` (currently `+250 792 831 227`). New-booking alerts are sent to `+256 765 463 811` and contain the client name, service, Kampala date/time, booking reference, and the protected admin bookings URL only.

The WhatsApp Multi-Device session is encrypted by WhatsApp and backed up to the private Cloudflare R2 bucket specified by `WHATSAPP_R2_*`; no Render disk or separate worker is required. Do not make the bucket public and do not commit its credentials. After scanning the QR code, wait for the `WhatsApp session backup saved to Cloudflare R2` log before restarting or redeploying the API. WhatsApp Web is suitable for a small internal-alert workflow, but it relies on the linked phone/session remaining active and is less reliable than the official business API for a public-scale service.
