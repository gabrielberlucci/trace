import express, { type Express } from 'express';
import cors from 'cors';
import { routes } from '@/routes/index';
import cookieParser from 'cookie-parser';
import { validateError } from '@/middlewares';
import { logger } from '@/logger/pino.logger';
import { pinoHttp } from 'pino-http';
import { logsMiddleware } from '@/middlewares';
import swaggerJSDoc from 'swagger-jsdoc';
import { swaggerConfigOptions } from './config';
import SwaggerUI from 'swagger-ui-express';

const app: Express = express();

const swaggerSpec = swaggerJSDoc(swaggerConfigOptions);

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(pinoHttp({ logger }));
app.use(logsMiddleware);
app.use('/v1/docs', SwaggerUI.serve, SwaggerUI.setup(swaggerSpec));
app.use(routes);
app.use(validateError);

export { app };
