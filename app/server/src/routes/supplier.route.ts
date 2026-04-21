import {
  createSupplierController,
  modifySupplierController,
} from '@/controllers';
import { validateData } from '@/middleware';
import { createSupplierSchema, modifySupplierSchema } from '@/schemas';
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
