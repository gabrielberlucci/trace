import {
  createPaymentMethodController,
  getPaymentMethodController,
  modifyPaymentMethodController,
} from '@/controllers';
import { authMiddleware, validateData, validateQuery } from '@/middlewares';
import {
  createPaymentMethodSchema,
  modifyPaymentMethodSchema,
  queryFilterSchema,
} from '@/schemas';
import { Router } from 'express';

const paymentMethodsRoutes: Router = Router();

paymentMethodsRoutes.post(
  '/',
  authMiddleware,
  validateData(createPaymentMethodSchema),
  createPaymentMethodController,
);

paymentMethodsRoutes.patch(
  '/:id',
  authMiddleware,
  validateData(modifyPaymentMethodSchema),
  modifyPaymentMethodController,
);

paymentMethodsRoutes.get(
  '/',
  authMiddleware,
  validateQuery(queryFilterSchema),
  getPaymentMethodController,
);

export { paymentMethodsRoutes };
