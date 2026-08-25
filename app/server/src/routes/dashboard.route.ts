import { dashboardController } from '@/controllers';
import { authMiddleware, validateQuery } from '@/middlewares';
import { dashboardQueryFilterSchema } from '@app/shared';
import { Router } from 'express';

const dashboardRouter: Router = Router();

dashboardRouter.get(
  '/',
  authMiddleware,
  validateQuery(dashboardQueryFilterSchema),
  dashboardController,
);

export { dashboardRouter };
