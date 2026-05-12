import {
  createSaleController,
  getSalesController,
  getSingleSaleController,
} from '@/controllers';
import { authMiddleware, validateData, validateQuery } from '@/middlewares';
import { queryFilterSchema, saleCartSchema } from '@/schemas';
import { Router } from 'express';

const saleRouter: Router = Router();

saleRouter.post(
  '/',
  authMiddleware,
  validateData(saleCartSchema),
  createSaleController,
);
saleRouter.get(
  '/',
  authMiddleware,
  validateQuery(queryFilterSchema),
  getSalesController,
);
saleRouter.get('/:id', authMiddleware, getSingleSaleController);

export { saleRouter };
