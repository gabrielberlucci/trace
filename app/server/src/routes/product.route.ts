import {
  createProductController,
  modifyProductController,
} from '@/controllers/product.controller';
import { validateData } from '@/middleware/general.validation.middleware';
import { modifyProductSchema, productSchema } from '@/schema/product.schema';
import { Router } from 'express';

const productRouter: Router = Router();

productRouter.post('/', validateData(productSchema), createProductController);

productRouter.patch(
  '/:id',
  validateData(modifyProductSchema),
  modifyProductController,
);

export { productRouter };
