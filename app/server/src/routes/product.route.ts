import {
  createProductController,
  getProductController,
  modifyProductController,
} from '@/controllers';
import { authMiddleware, validateData, validateQuery } from '@/middlewares';
import {
  modifyProductSchema,
  productSchema,
  queryFilterSchema,
} from '@/schemas';
import { Router } from 'express';

const productRouter: Router = Router();

productRouter.post('/', validateData(productSchema), createProductController);

productRouter.patch(
  '/:id',
  authMiddleware,
  validateData(modifyProductSchema),
  modifyProductController,
);

productRouter.get(
  '/',
  authMiddleware,
  validateQuery(queryFilterSchema),
  getProductController,
);

export { productRouter };
