import {
  createSupplierController,
  modifySupplierController,
} from '@/controllers';
import { getSuppliersController } from '@/controllers';
import { validateData, validateQuery } from '@/middlewares';
import {
  createSupplierSchema,
  modifySupplierSchema,
  queryFilterSchema,
} from '@/schemas';
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

supplierRoute.get(
  '/',
  validateQuery(queryFilterSchema),
  getSuppliersController,
);

export { supplierRoute };
