import { Unauthorized } from '@/error';
import { loggerStorage } from '@/logger';
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

interface AuthPayload {
  id: number;
  username: string;
  role: string;
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.access_token;

  if (!token) throw new Unauthorized(`Usuário não autorizado`);

  const decoded = jwt.verify(token, process.env.JWT_SECRET) as AuthPayload;

  res.locals.user = decoded;

  next();
};
