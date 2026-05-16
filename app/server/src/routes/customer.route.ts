import { Router } from 'express';
import { createCustomerSchema, modifyCustomerSchema } from '@/schemas';
import {
  createCustomerController,
  getCustomerController,
  modifyCustomerController,
} from '@/controllers/';
import { authMiddleware, validateData, validateQuery } from '@/middlewares';
import { queryFilterSchema } from '@/schemas';

/**
 * @swagger
 * /api/v1/customers:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               name: "John Doe"
 *               document: "49608940087"
 *               email: "john@example.com"
 *               phone: "1424538158"
 *               address: "Street 123"
 *               birthdate: "1990-01-01"
 *     responses:
 *       201:
 *         description: Customer successfully created
 *   get:
 *     summary: List customers
 *     tags: [Customers]
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
 * /api/v1/customers/{id}:
 *   patch:
 *     summary: Update a customer
 *     tags: [Customers]
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
 *               name: "John Doe Updated"
 *               email: "john.updated@example.com"
 *     responses:
 *       200:
 *         description: Customer updated
 */
const customerRoute: Router = Router();

customerRoute.post(
  '/',
  authMiddleware,
  validateData(createCustomerSchema),
  createCustomerController,
);
customerRoute.patch(
  '/:id',
  authMiddleware,
  validateData(modifyCustomerSchema),
  modifyCustomerController,
);
customerRoute.get(
  '/',
  authMiddleware,
  validateQuery(queryFilterSchema),
  getCustomerController,
);

export { customerRoute };
