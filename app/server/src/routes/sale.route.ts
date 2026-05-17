import {
  createSaleController,
  getSalesController,
  getSingleSaleController,
} from '@/controllers';
import {
  authMiddleware,
  validateData,
  validateParam,
  validateQuery,
} from '@/middlewares';
import { queryFilterSchema, reqParamSchema, saleCartSchema } from '@/schemas';
import { Router } from 'express';

/**
 * @swagger
 * /api/v1/sales:
 *   post:
 *     summary: Create a new sale
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               document: "49608940087"
 *               payment: 1
 *               items:
 *                 - barcode: "123456789012"
 *                   quantity: 2
 *                 - barcode: "123456921"
 *                   quantity: 1
 *     responses:
 *       201:
 *         description: Sale successfully created
 *   get:
 *     summary: List sales
 *     tags: [Sales]
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
 * /api/v1/sales/{id}:
 *   get:
 *     summary: Return a specific sale
 *     tags: [Sales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Sale found
 */
const saleRouter: Router = Router();

saleRouter.post(
  '/',
  authMiddleware,
  validateData(saleCartSchema),
  createSaleController,
);
saleRouter.get(
  '/',
  authMiddleware,
  validateQuery(queryFilterSchema),
  getSalesController,
);
saleRouter.get(
  '/:id',
  authMiddleware,
  validateParam(reqParamSchema),
  getSingleSaleController,
);

export { saleRouter };
