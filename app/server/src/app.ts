import express, { type Express } from 'express';
import cors from 'cors';
import { routes } from './routes';
import cookieParser from 'cookie-parser';
import { validateError } from './middleware/general.error.middleware';

const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(routes);
app.use(validateError);

export { app };
