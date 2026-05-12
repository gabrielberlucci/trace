import {
  createSupplierController,
  modifySupplierController,
} from '@/controllers';
import { getSuppliersController } from '@/controllers';
import { authMiddleware, validateData, validateQuery } from '@/middlewares';
import {
  createSupplierSchema,
  modifySupplierSchema,
  queryFilterSchema,
} from '@/schemas';
import { Router } from 'express';

const supplierRoute: Router = Router();

supplierRoute.post(
  '/',
  authMiddleware,
  validateData(createSupplierSchema),
  createSupplierController,
);
supplierRoute.patch(
  '/:id',
  authMiddleware,
  validateData(modifySupplierSchema),
  modifySupplierController,
);

supplierRoute.get(
  '/',
  authMiddleware,
  validateQuery(queryFilterSchema),
  getSuppliersController,
);

export { supplierRoute };
