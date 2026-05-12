import {
  createPaymentMethodController,
  getPaymentMethodController,
  modifyPaymentMethodController,
} from '@/controllers';
import { authMiddleware, validateData } from '@/middlewares';
import {
  createPaymentMethodSchema,
  modifyPaymentMethodSchema,
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

paymentMethodsRoutes.get('/', authMiddleware, getPaymentMethodController);

export { paymentMethodsRoutes };
