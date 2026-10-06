import {
  authMiddleware,
  validateData,
  validateParam,
  validateQuery,
} from '@/middlewares';
import {
  categorySchema,
  queryFilterSchema,
  reqParamSchema,
  updateCategorySchema,
} from '@app/shared';
import { Router } from 'express';
import {
  createCategoryController,
  findAllCategoryController,
  findCategoryController,
  updateCategoryController,
} from './categories.controller';

const categoriesRouter: Router = Router();

categoriesRouter.post(
  '/',
  authMiddleware,
  validateData(categorySchema),
  createCategoryController,
);
categoriesRouter.get(
  '/',
  authMiddleware,
  validateQuery(queryFilterSchema),
  findAllCategoryController,
);
categoriesRouter.get(
  '/:id',
  authMiddleware,
  validateParam(reqParamSchema),
  findCategoryController,
);
categoriesRouter.patch(
  '/:id',
  authMiddleware,
  validateParam(reqParamSchema),
  validateData(updateCategorySchema),
  updateCategoryController,
);

export { categoriesRouter };
