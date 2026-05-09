import { paymentCreateController } from '@/controllers';
import { validateData } from '@/middlewares';
import { createPaymentMethodSchema } from '@/schemas';
import { Router } from 'express';

const paymentMethodsRoutes: Router = Router();

paymentMethodsRoutes.post(
  '/',
  validateData(createPaymentMethodSchema),
  paymentCreateController,
);

export { paymentMethodsRoutes };
