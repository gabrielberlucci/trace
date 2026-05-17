import {
  createPaymentMethodController,
  getPaymentMethodController,
  modifyPaymentMethodController,
} from '@/controllers';
import {
  authMiddleware,
  validateData,
  validateParam,
  validateQuery,
} from '@/middlewares';
import {
  createPaymentMethodSchema,
  modifyPaymentMethodSchema,
  queryFilterSchema,
  reqParamSchema,
} from '@/schemas';
import { getPaginatedPaymentMethods } from '@/services';
import { Router } from 'express';

/**
 * @swagger
 * /api/v1/payment-methods:
 *   post:
 *     summary: Create a new payment method
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               description: "Credit Card"
 *               type: "CREDITO"
 *               fee: 1.5
 *     responses:
 *       201:
 *         description: Payment method successfully created
 *   get:
 *     summary: List payment methods
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List successfully returned
 * /api/v1/payment-methods/{id}:
 *   patch:
 *     summary: Update payment method
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               tax: 2.0
 *     responses:
 *       200:
 *         description: Payment method updated
 */
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
  validateParam(reqParamSchema),
  modifyPaymentMethodController,
);

paymentMethodsRoutes.get(
  '/',
  authMiddleware,
  validateQuery(queryFilterSchema),
  getPaginatedPaymentMethods,
);

paymentMethodsRoutes.get(
  '/:id',
  authMiddleware,
  validateParam(reqParamSchema),
  getPaymentMethodController,
);

export { paymentMethodsRoutes };
