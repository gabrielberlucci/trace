import { UserPermissions } from '@/constants';
import {
  createProductController,
  getPaginatedProductsController,
  getProductController,
  modifyProductController,
} from '@/controllers';
import {
  authMiddleware,
  validateData,
  validateParam,
  validatePermission,
  validateQuery,
} from '@/middlewares';
import {
  modifyProductSchema,
  productSchema,
  queryFilterSchema,
  reqParamSchema,
} from '@/schemas';
import { Router } from 'express';

/**
 * @swagger
 * /api/v1/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               description: "Wireless Mouse"
 *               barcode: "123456789012"
 *               unity: "UN"
 *               currentStock: 150
 *               costPrice: 25.50
 *               salePrice: 50.00
 *               supplierId: 1
 *     responses:
 *       201:
 *         description: Product successfully created
 *   get:
 *     summary: List products
 *     tags: [Products]
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
 * /api/v1/products/{id}:
 *   patch:
 *     summary: Update a product
 *     tags: [Products]
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
 *               salePrice: 55.00
 *               currentStock: 140
 *     responses:
 *       200:
 *         description: Product updated
 */
const productRouter: Router = Router();

productRouter.post(
  '/',
  authMiddleware,
  validatePermission(UserPermissions.CREATE_PRODUCT),
  validateData(productSchema),
  createProductController,
);

productRouter.patch(
  '/:id',
  authMiddleware,
  validatePermission(UserPermissions.MODIFY_PRODUCT),
  validateData(modifyProductSchema),
  validateParam(reqParamSchema),
  modifyProductController,
);

productRouter.get(
  '/',
  authMiddleware,
  validatePermission(UserPermissions.VIEW_PRODUCT),
  validateQuery(queryFilterSchema),
  getPaginatedProductsController,
);

productRouter.get(
  '/:id',
  authMiddleware,
  validatePermission(UserPermissions.VIEW_PRODUCT),
  validateParam(reqParamSchema),
  getProductController,
);

export { productRouter };
