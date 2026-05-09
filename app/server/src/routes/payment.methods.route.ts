import {
  modifyPaymentController,
  paymentCreateController,
} from '@/controllers';
import { validateData } from '@/middlewares';
import {
  createPaymentMethodSchema,
  modifyPaymentMethodSchema,
} from '@/schemas';
import { Router } from 'express';

const paymentMethodsRoutes: Router = Router();

paymentMethodsRoutes.post(
  '/',
  validateData(createPaymentMethodSchema),
  paymentCreateController,
);

paymentMethodsRoutes.patch(
  '/:id',
  validateData(modifyPaymentMethodSchema),
  modifyPaymentController,
);

export { paymentMethodsRoutes };
