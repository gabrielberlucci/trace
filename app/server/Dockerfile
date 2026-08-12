FROM node:24.13.0-alpine
WORKDIR /usr/src/app
RUN npm install -g pnpm
COPY app/server/package.json ./
RUN pnpm install
COPY . .
RUN pnpm build
CMD ["pnpm", "start"]