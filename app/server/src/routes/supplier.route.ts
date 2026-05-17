import {
  createSupplierController,
  getPaginatedSuppliersController,
  getSupplierController,
  modifySupplierController,
} from '@/controllers';
import {
  authMiddleware,
  validateData,
  validateParam,
  validateQuery,
} from '@/middlewares';
import {
  createSupplierSchema,
  modifySupplierSchema,
  queryFilterSchema,
  reqParamSchema,
} from '@/schemas';
import { Router } from 'express';

/**
 * @swagger
 * /api/v1/suppliers:
 *   post:
 *     summary: Create a new supplier
 *     tags: [Suppliers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               name: "Tech Supplier Inc"
 *               document: "84735390000138"
 *               email: "contact@techsupplier.com"
 *               phone: "1532530623"
 *               address: "Industrial Avenue 45"
 *     responses:
 *       201:
 *         description: Supplier successfully created
 *   get:
 *     summary: List suppliers
 *     tags: [Suppliers]
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
 * /api/v1/suppliers/{id}:
 *   patch:
 *     summary: Update a supplier
 *     tags: [Suppliers]
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
 *               name: "Tech Supplier Inc Updated"
 *               phone: "1435302685"
 *     responses:
 *       200:
 *         description: Supplier updated
 */
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
  getPaginatedSuppliersController,
);

supplierRoute.get(
  '/:id',
  authMiddleware,
  validateParam(reqParamSchema),
  getSupplierController,
);

export { supplierRoute };
