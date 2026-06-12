import { UserPermissions } from '@/constants';
import {
  createPaymentMethodController,
  getPaymentMethodController,
  modifyPaymentMethodController,
  getPaginatedPaymentMethodsController,
} from '@/controllers';
import {
  authMiddleware,
  validateData,
  validateParam,
  validatePermission,
  validateQuery,
} from '@/middlewares';
import {
  createPaymentMethodSchema,
  modifyPaymentMethodSchema,
  queryFilterSchema,
  reqParamSchema,
} from '@/schemas';
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
  validatePermission(UserPermissions.CREATE_PAYMENT_METHOD),
  validateData(createPaymentMethodSchema),
  createPaymentMethodController,
);

paymentMethodsRoutes.patch(
  '/:id',
  authMiddleware,
  validatePermission(UserPermissions.MODIFY_PAYMENT_METHOD),
  validateData(modifyPaymentMethodSchema),
  validateParam(reqParamSchema),
  modifyPaymentMethodController,
);

paymentMethodsRoutes.get(
  '/',
  authMiddleware,
  validatePermission(UserPermissions.VIEW_PAYMENT_METHOD),
  validateQuery(queryFilterSchema),
  getPaginatedPaymentMethodsController,
);

paymentMethodsRoutes.get(
  '/:id',
  authMiddleware,
  validatePermission(UserPermissions.VIEW_PAYMENT_METHOD),
  validateParam(reqParamSchema),
  getPaymentMethodController,
);

export { paymentMethodsRoutes };
