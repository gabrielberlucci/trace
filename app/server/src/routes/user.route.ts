import { loginUserController, registerUserController } from '@/controllers';
import { validateData } from '@/middlewares';
import { userSchema, userLoginSchema } from '@/schemas';
import { Router } from 'express';

const userRouter: Router = Router();

userRouter.post('/register', validateData(userSchema), registerUserController);
userRouter.post('/login', validateData(userLoginSchema), loginUserController);

export { userRouter };
