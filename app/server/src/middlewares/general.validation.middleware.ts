import type { Request, Response, NextFunction } from 'express';
import { z } from '@/config/zod.config';

export const validateData =
  (schema: z.ZodObject) =>
  (req: Request, _res: Response, next: NextFunction) => {
    req.body = schema.strict().parse(req.body);
    next();
  };

export const validateQuery =
  (schema: z.ZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    res.locals.query = schema.parse(req.query);
    next();
  };
