import {
  createProductController,
  getProductController,
  modifyProductController,
} from '@/controllers';
import { validateData } from '@/middleware';
import { modifyProductSchema, productSchema } from '@/schemas';
import { Router } from 'express';

const productRouter: Router = Router();

productRouter.post('/', validateData(productSchema), createProductController);

productRouter.patch(
  '/:id',
  validateData(modifyProductSchema),
  modifyProductController,
);

productRouter.get('/', getProductController);

export { productRouter };
