import {
  createCompanyController,
  getPaginatedCompanyController,
} from '@/controllers';
import {
  authMiddleware,
  validateData,
  validatePermission,
  validateQuery,
} from '@/middlewares';
import { Router } from 'express';
import { companySchema, queryFilterSchema } from '@app/shared';

const companyRouter: Router = Router();

companyRouter.post(
  '/',
  authMiddleware,
  //   validatePermission(),
  validateData(companySchema),
  createCompanyController,
);

companyRouter.get(
  '/',
  authMiddleware,
  validateQuery(queryFilterSchema),
  getPaginatedCompanyController,
);

export { companyRouter };
