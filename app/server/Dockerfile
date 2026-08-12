FROM node:24.13.0-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./

COPY app/server/package.json ./app/server/

RUN pnpm install --no-frozen-lockfile

COPY . .

RUN pnpm --filter server build

# --- Runtime Stage ---
FROM node:24.13.0-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=builder /app/app/server/dist ./app/server/dist
COPY --from=builder /app/app/server/package.json ./app/server/package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/app/server/node_modules ./app/server/node_modules

EXPOSE 3000

CMD ["pnpm", "--filter", "server", "start"]