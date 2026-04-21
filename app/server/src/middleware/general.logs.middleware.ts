import type { NextFunction, Request, Response } from 'express';
import { loggerStorage } from '@/logger';

export const logsMiddleware = (
  req: Request,
  _res: Response,
  next: NextFunction,
) => {
  loggerStorage.run(req.log, () => {
    next();
  });
};
