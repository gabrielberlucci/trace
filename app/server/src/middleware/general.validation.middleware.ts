import type { Request, Response, NextFunction } from 'express';
import { z } from '../config/zod.config';

export const validateData =
  (schema: z.ZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    schema.strict().parse(req.body);
    next();
  };
