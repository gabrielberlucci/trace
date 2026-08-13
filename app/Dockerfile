FROM node:24.13.0-alpine AS builder

WORKDIR /usr/src/app

RUN corepack enable && corepack prepare pnpm@11.17.0 --activate

COPY pnpm-workspace.yaml package.json pnpm-lock.yaml* ./

COPY server/package.json ./server/
COPY shared/package.json ./shared/

RUN pnpm install --no-frozen-lockfile

COPY . .

RUN pnpm -r build

# --- Runtime Stage ---
FROM node:24.13.0-alpine

WORKDIR /usr/src/app

RUN corepack enable && corepack prepare pnpm@11.17.0 --activate

COPY --from=builder /usr/src/app/pnpm-workspace.yaml /usr/src/app/package.json ./
COPY --from=builder /usr/src/app/server/dist ./server/dist
COPY --from=builder /usr/src/app/server/src ./server/src
COPY --from=builder /usr/src/app/server/lib ./server/lib
COPY --from=builder /usr/src/app/server/tsconfig.json ./server/tsconfig.json
COPY --from=builder /usr/src/app/server/generated ./server/generated
COPY --from=builder /usr/src/app/server/package.json ./server/package.json
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/server/node_modules ./server/node_modules
COPY --from=builder /usr/src/app/shared ./shared
COPY --from=builder /usr/src/app/server/prisma ./server/prisma
COPY --from=builder /usr/src/app/server/prisma.config.ts ./server

RUN mkdir -p server/uploads-xml/pending server/uploads-xml/error server/uploads-xml/processed

EXPOSE 3000

CMD ["pnpm", "--filter", "server", "start"]