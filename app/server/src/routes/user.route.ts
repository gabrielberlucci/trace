import {
  loginUserController,
  registerUserController,
  modifyUserController,
  getPaginatedUsersController,
  getUserController,
  meController,
} from '@/controllers';
import {
  authMiddleware,
  rateLimiting,
  validateData,
  validateParam,
  validatePermission,
  validateQuery,
} from '@/middlewares';
import {
  userSchema,
  userLoginSchema,
  userQueryFilterSchema,
  modifyUserSchema,
  reqParamSchema,
} from '@app/shared';
import { Router } from 'express';
import { UserPermissions } from '@app/shared';

/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               name: "Admin User"
 *               email: "admin@trace.com"
 *               password: "securepassword123"
 *               confirmedPassword: "securepassword123"
 *               role: "ADMIN"
 *               username: "adm"
 *     responses:
 *       201:
 *         description: User successfully created
 * /api/v1/users/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               username: "admin"
 *               password: "securepassword123"
 *     responses:
 *       200:
 *         description: Login successful
 * /api/v1/users:
 *   get:
 *     summary: List users
 *     tags: [Users]
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
 * /api/v1/users/{id}:
 *   patch:
 *     summary: Update a user
 *     tags: [Users]
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
 *               name: "Admin User Updated"
 *     responses:
 *       200:
 *         description: User updated
 */
const userRouter: Router = Router();

userRouter.post(
  '/register',
  authMiddleware,
  validatePermission(UserPermissions.CREATE_USER),
  validateData(userSchema),
  registerUserController,
);
userRouter.post(
  '/login',
  validateData(userLoginSchema),
  rateLimiting,
  loginUserController,
);

userRouter.get('/me', authMiddleware, meController);

userRouter.get(
  '/',
  authMiddleware,
  validatePermission(UserPermissions.VIEW_USER),
  validateQuery(userQueryFilterSchema),
  getPaginatedUsersController,
);
userRouter.patch(
  '/:id',
  authMiddleware,
  validatePermission(UserPermissions.MODIFY_USER),
  validateData(modifyUserSchema),
  validateParam(reqParamSchema),
  modifyUserController,
);
userRouter.get(
  '/:id',
  authMiddleware,
  validatePermission(UserPermissions.VIEW_USER),
  validateParam(reqParamSchema),
  getUserController,
);

export { userRouter };
