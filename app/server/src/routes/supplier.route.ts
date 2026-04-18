import {
  createSupplierController,
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
  '/',
  validateData(createSupplierSchema),
  createSupplierController,
);
supplierRoute.patch(
  '/:id',
  validateData(modifySupplierSchema),
  modifySupplierController,
);

export { supplierRoute };
