import type { Request, Response, NextFunction } from 'express';
import { z } from '@/config/zod.config';
import { prisma } from '../../lib/prisma';
import { Forbidden } from '@/error';

export const validateData =
  (schema: z.ZodObject) =>
  (req: Request, _res: Response, next: NextFunction) => {
    req.body = schema.strict().parse(req.body);
    next();
  };

export const validateQuery =
  (schema: z.ZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    res.locals.query = schema.strict().parse(req.query);
    next();
  };

export const validateParam =
  (schema: z.ZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    res.locals.params = schema.strict().parse(req.params);
    next();
  };

export const validatePermission =
  (permissionName: string) =>
  async (_req: Request, res: Response, next: NextFunction) => {
    const userId = res.locals.user.id;

    const userHasAccess = await prisma.user.findUnique({
      where: {
        id: userId,
        role: {
          permission: {
            some: {
              permission: {
                name: permissionName,
              },
            },
          },
        },
      },

      select: {
        id: true,
        role: true,
      },
    });

    if (!userHasAccess)
      throw new Forbidden(`Usuário sem permissão para realizar essa ação`);

    next();
  };
