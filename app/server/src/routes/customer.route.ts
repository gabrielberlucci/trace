import { Router } from 'express';
import { createCustomerSchema, modifyCustomerSchema } from '@/schemas';
import {
  createCustomerController,
  getCustomerController,
  modifyCustomerController,
} from '@/controllers/';
import { validateData, validateQuery } from '@/middlewares';
import { queryFilterSchema } from '@/schemas';

const customerRoute: Router = Router();

customerRoute.post(
  '/',
  validateData(createCustomerSchema),
  createCustomerController,
);
customerRoute.patch(
  '/:id',
  validateData(modifyCustomerSchema),
  modifyCustomerController,
);
customerRoute.get('/', validateQuery(queryFilterSchema), getCustomerController);

export { customerRoute };
