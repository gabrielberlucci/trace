FROM node:24.13.0-alpine
WORKDIR /usr/src/app
RUN npm install -g pnpm
COPY app/server/package.json app/pnpm-workspace.yaml ./
RUN PNPM_SKIP_VERIFY_APP_BINARIES=true pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
CMD ["pnpm", "start"]