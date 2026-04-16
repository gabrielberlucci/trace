import { createProductController } from '@/controllers/product.controller';
import { validateData } from '@/middleware/general.validation.middleware';
import { productSchema } from '@/schema/product.schema';
import { Router } from 'express';

const productRouter: Router = Router();

productRouter.post(
  '/create',
  validateData(productSchema),
  createProductController,
);

export { productRouter };
