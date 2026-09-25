import { authMiddleware, validateData } from '@/middlewares';
import { Router } from 'express';
import { stockAdjustmentSchema } from '@app/shared';
import { createStockAdjustmentController } from '@/controllers';

const stockAdjustmentRouter: Router = Router();

stockAdjustmentRouter.post(
  '/',
  authMiddleware,
  validateData(stockAdjustmentSchema),
  createStockAdjustmentController,
);

export { stockAdjustmentRouter };
