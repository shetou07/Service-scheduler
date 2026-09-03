# Repository layout

- `apps/web` — Next.js public booking and future admin portal.
- `apps/api` — NestJS API, Prisma data model, and background workers.
- `legacy/vite-prototype` — original UI prototype retained for reference during migration; it is not built or deployed.
- `docs` — product and technical documentation.
- Root configuration — workspace scripts, Docker Compose, Render blueprint, environment template, and project readme.

The API uses a domain-first layout: `modules/` holds business features, `database/` holds persistence integration, `common/` holds cross-cutting concerns, and `workers/` holds independently run background processes.
