import {
  loginUserController,
  registerUserController,
  getUsersController,
} from '@/controllers';
import { validateData, validateQuery } from '@/middlewares';
import {
  userSchema,
  userLoginSchema,
  userQueryFilterSchema,
  modifyUserSchema,
} from '@/schemas';
import { Router } from 'express';

const userRouter: Router = Router();

userRouter.post('/register', validateData(userSchema), registerUserController);
userRouter.post('/login', validateData(userLoginSchema), loginUserController);
userRouter.get('/', validateQuery(userQueryFilterSchema), getUsersController);
userRouter.patch('/:id', validateData(modifyUserSchema));

export { userRouter };
