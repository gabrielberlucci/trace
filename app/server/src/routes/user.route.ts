import { registerUserController } from '@/controllers';
import { validateData } from '@/middlewares';
import { userSchema } from '@/schemas';
import { Router } from 'express';

const userRouter: Router = Router();

userRouter.post('/', validateData(userSchema), registerUserController);

export { userRouter };
