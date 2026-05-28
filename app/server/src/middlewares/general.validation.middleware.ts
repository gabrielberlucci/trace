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
        active: true,
      },
    });

    if (!userHasAccess)
      throw new Forbidden(`Usuário sem permissão para realizar essa ação`);

    /**
     * this is the start of something that i will implement later
     * because i want to be possible to revoke tokens
     *
     * revoke tokens will be used to log-out and to be able to revoke if something
     * go wrong
     */
    if (userHasAccess.active === false) throw new Forbidden(`Usuário inativo`);

    next();
  };
