FROM node:24.13.0-alpine AS builder

WORKDIR /usr/src/app

RUN corepack enable && corepack prepare pnpm@10.30.3 --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./

COPY server/package.json ./server/
COPY shared/package.json ./shared/

RUN pnpm install --no-frozen-lockfile

COPY . .

RUN pnpm -r build

# --- Runtime Stage ---
FROM node:24.13.0-alpine

WORKDIR /usr/src/app

RUN corepack enable && corepack prepare pnpm@10.30.3 --activate

COPY --from=builder /usr/src/app/pnpm-workspace.yaml /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/server/dist ./server/dist
COPY --from=builder /usr/src/app/server/generated ./server/generated
COPY --from=builder /usr/src/app/server/package.json ./server/package.json
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/server/node_modules ./server/node_modules
COPY --from=builder /usr/src/app/shared ./shared

EXPOSE 3000

CMD ["pnpm", "--filter", "server", "start"]