import { Router } from 'express';
import {
  createCustomerSchema,
  modifyCustomerSchema,
} from '@/schema/customer.schema';
import {
  createCustomerController,
  getCustomerController,
  modifyCustomerController,
} from '@/controllers/customer.controller';
import {
  validateData,
  validateQuery,
} from '@/middleware/general.validation.middleware';
import { querySchema } from '@/schema/query.schema';

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
customerRoute.get('/', validateQuery(querySchema), getCustomerController);

export { customerRoute };
