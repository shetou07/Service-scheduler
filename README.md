# Coach Rickie Scheduling System

Production-oriented monorepo: Next.js client portal in `apps/web`, NestJS/Prisma API in `apps/api`, PostgreSQL, Redis, and a notification worker. The original Vite prototype is retained under `legacy/vite-prototype` while its screens are migrated.

## Local setup

1. Copy `.env.example` to `.env`, set a strong `JWT_SECRET`, and add your Neon pooled and direct connection URLs. When running the API from `apps/api`, put the same variables in `apps/api/.env`.
2. Docker Postgres is optional for offline development: run `docker compose up -d` only when using its local `DATABASE_URL` and `DIRECT_URL` values.
3. Run `npm install`, `npm run db:generate`, `npx prisma migrate deploy` from `apps/api`, and `npm run db:seed` for local development or staging only.
4. Run `npm run dev`; web runs on port 3000 and the API on 4000.

The seed admin credentials are configured by `SEED_ADMIN_EMAIL` and `SEED_ADMIN_PASSWORD`. Change them before any shared deployment.
