import { Router } from 'express';
import {
  createCustomerSchema,
  modifyCustomerSchema,
} from '@/schema/customer.schema';
import {
  createCustomerController,
  modifyCustomerController,
} from '@/controllers/customer.controller';
import { validateData } from '@/middleware/general.validation.middleware';

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

export { customerRoute };
