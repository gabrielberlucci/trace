import {
  loginUserController,
  registerUserController,
  getUsersController,
} from '@/controllers';
import { validateData, validateQuery } from '@/middlewares';
import { userSchema, userLoginSchema, userQueryFilterSchema } from '@/schemas';
import { Router } from 'express';

const userRouter: Router = Router();

userRouter.post('/register', validateData(userSchema), registerUserController);
userRouter.post('/login', validateData(userLoginSchema), loginUserController);
userRouter.get('/', validateQuery(userQueryFilterSchema), getUsersController);

export { userRouter };
