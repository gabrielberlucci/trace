import { createCompanyController } from '@/controllers';
import {
  authMiddleware,
  validateData,
  validatePermission,
} from '@/middlewares';
import { Router } from 'express';
import { companySchema } from '@app/shared';

const companyRouter: Router = Router();

companyRouter.post(
  '/',
  authMiddleware,
  //   validatePermission(),
  validateData(companySchema),
  createCompanyController,
);

export { companyRouter };
