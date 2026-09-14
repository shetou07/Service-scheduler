FROM node:22-bookworm-slim

WORKDIR /app

COPY . .

RUN npm ci --include=dev \
    && npm run db:generate \
    && npm run build --workspace=@coach-rickie/api

CMD ["sh", "-c", "npx prisma migrate deploy --schema apps/api/prisma/schema.prisma && node apps/api/dist/src/main.js"]
