FROM node:24.13.0-alpine AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./

COPY server/package.json ./server/

RUN pnpm install --no-frozen-lockfile

COPY . .

RUN pnpm --filter server build

FROM node:24.13.0-alpine

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/server/package.json ./server/package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/server/node_modules ./server/node_modules

EXPOSE 3000

CMD ["pnpm", "--filter", "server", "start"]