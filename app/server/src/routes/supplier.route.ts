import {
  createSupplierController,
  inactiveSupplierController,
  modifySupplierController,
} from '@/controllers/supplier.controller';
import { validateData } from '@/middleware/general.validation.middleware';
import {
  createSupplierSchema,
  modifySupplierSchema,
} from '@/schema/supplier.schema';
import { Router } from 'express';

const supplierRoute: Router = Router();

supplierRoute.post(
  '/create',
  validateData(createSupplierSchema),
  createSupplierController,
);
supplierRoute.patch(
  '/modify/:id',
  validateData(modifySupplierSchema),
  modifySupplierController,
);
supplierRoute.patch('/inactive/:id', inactiveSupplierController);

export { supplierRoute };
