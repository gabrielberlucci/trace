import express, { type Express } from 'express';
import cors from 'cors';
import { routes } from './routes';
import cookieParser from 'cookie-parser';

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(routes);

export { app };
