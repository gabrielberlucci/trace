import express, { type Express } from 'express';
import cors from 'cors';
import { routes } from '@/routes/index';
import cookieParser from 'cookie-parser';
import { validateError } from '@/middleware/general.error.middleware';
import { logger } from '@/logger/pino.logger';
import { pinoHttp } from 'pino-http';
import { logsMiddleware } from './middleware/general.logs.middleware';

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(pinoHttp({ logger }));
app.use(logsMiddleware);
app.use(routes);
app.use(validateError);

export { app };
