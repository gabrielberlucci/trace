import { AsyncLocalStorage } from 'node:async_hooks';
import type { Logger } from 'pino';

export const loggerStorage = new AsyncLocalStorage<Logger>();
