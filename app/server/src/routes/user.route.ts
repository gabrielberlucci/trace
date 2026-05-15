import {
  loginUserController,
  registerUserController,
  getUsersController,
  modifyUserController,
} from '@/controllers';
import {
  authMiddleware,
  rateLimiting,
  validateData,
  validateQuery,
} from '@/middlewares';
import {
  userSchema,
  userLoginSchema,
  userQueryFilterSchema,
  modifyUserSchema,
} from '@/schemas';
import { Router } from 'express';

const userRouter: Router = Router();

userRouter.post('/register', validateData(userSchema), registerUserController);
userRouter.post(
  '/login',
  validateData(userLoginSchema),
  rateLimiting,
  loginUserController,
);
userRouter.get(
  '/',
  authMiddleware,
  validateQuery(userQueryFilterSchema),
  getUsersController,
);
userRouter.patch(
  '/:id',
  authMiddleware,
  validateData(modifyUserSchema),
  modifyUserController,
);

export { userRouter };
