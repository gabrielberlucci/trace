FROM node:24.13.0-alpine
WORKDIR /usr/src/app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY app/pnpm-workspace.yaml app/package.json ./

COPY app/server/package.json ./app/server/

RUN pnpm install --no-frozen-lockfile

COPY . .
RUN pnpm --filter server build
CMD ["pnpm", "start"]