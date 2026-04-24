import {
  createProductController,
  getProductController,
  modifyProductController,
} from '@/controllers';
import { validateData, validateQuery } from '@/middlewares';
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
  validateData(modifyProductSchema),
  modifyProductController,
);

productRouter.get('/', validateQuery(queryFilterSchema), getProductController);

export { productRouter };
