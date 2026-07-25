import {
  createCompanyController,
  getCompanyController,
  getPaginatedCompanyController,
  modifyCompanyController,
} from '@/controllers';
import {
  authMiddleware,
  validateData,
  validateParam,
  validatePermission,
  validateQuery,
} from '@/middlewares';
import { Router } from 'express';
import {
  companySchema,
  modifyCompanySchema,
  queryFilterSchema,
  reqParamSchema,
} from '@app/shared';

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

companyRouter.get(
  '/:id',
  authMiddleware,
  validateParam(reqParamSchema),
  getCompanyController,
);

companyRouter.patch(
  '/:id',
  authMiddleware,
  validateParam(reqParamSchema),
  validateData(modifyCompanySchema),
  modifyCompanyController,
);

export { companyRouter };
