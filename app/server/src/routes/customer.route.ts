import { Router } from 'express';
import {
  createCustomerSchema,
  modifyCustomerSchema,
} from '@/schema/customer.schema';
import {
  activeCustomerController,
  createCustomerController,
  inactiveCustomerController,
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

customerRoute.patch('/inactive/:id', inactiveCustomerController);
customerRoute.patch('/active/:id', activeCustomerController);

export { customerRoute };
