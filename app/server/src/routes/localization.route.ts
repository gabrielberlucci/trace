import { getCitiesByStateController, getStatesController } from '@/controllers';
import { authMiddleware } from '@/middlewares';
import { Router } from 'express';
import { validateQuery } from '@/middlewares';
import { queryFilterSchema } from '@app/shared';

const localizationRouter: Router = Router();

localizationRouter.get('/states', authMiddleware, getStatesController);
localizationRouter.get(
  '/cities',
  authMiddleware,
  validateQuery(queryFilterSchema),
  getCitiesByStateController,
);

export { localizationRouter };
