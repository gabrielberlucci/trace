import { authMiddleware, validateData, validateQuery } from '@/middlewares';
import { Router } from 'express';
import { queryFilterSchema, stockAdjustmentSchema } from '@app/shared';
import {
  createStockAdjustmentController,
  getPaginatedStockAdjustmentController,
} from '@/controllers';

const stockAdjustmentRouter: Router = Router();

stockAdjustmentRouter.post(
  '/',
  authMiddleware,
  validateData(stockAdjustmentSchema),
  createStockAdjustmentController,
);

stockAdjustmentRouter.get(
  '/',
  authMiddleware,
  validateQuery(queryFilterSchema),
  getPaginatedStockAdjustmentController,
);

export { stockAdjustmentRouter };
