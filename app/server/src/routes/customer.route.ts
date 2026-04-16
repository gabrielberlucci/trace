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
  '/create',
  validateData(createCustomerSchema),
  createCustomerController,
);
customerRoute.patch(
  '/modify/:id',
  validateData(modifyCustomerSchema),
  modifyCustomerController,
);

export { customerRoute };
