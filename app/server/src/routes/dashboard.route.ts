import { dashboardController } from '@/controllers';
import { validateQuery } from '@/middlewares';
import { dashboardQueryFilterSchema } from '@app/shared';
import { Router } from 'express';

const dashboardRouter: Router = Router();

dashboardRouter.get(
  '/',
  validateQuery(dashboardQueryFilterSchema),
  dashboardController,
);

export { dashboardRouter };
