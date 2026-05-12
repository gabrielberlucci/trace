import { Router } from 'express';
import { createCustomerSchema, modifyCustomerSchema } from '@/schemas';
import {
  createCustomerController,
  getCustomerController,
  modifyCustomerController,
} from '@/controllers/';
import { authMiddleware, validateData, validateQuery } from '@/middlewares';
import { queryFilterSchema } from '@/schemas';

const customerRoute: Router = Router();

customerRoute.post(
  '/',
  authMiddleware,
  validateData(createCustomerSchema),
  createCustomerController,
);
customerRoute.patch(
  '/:id',
  authMiddleware,
  validateData(modifyCustomerSchema),
  modifyCustomerController,
);
customerRoute.get(
  '/',
  authMiddleware,
  validateQuery(queryFilterSchema),
  getCustomerController,
);

export { customerRoute };
