import {
  createServiceOrderController,
  getPaginatedServiceOrderController,
  getServiceOrderController,
} from '@/controllers';
import {
  authMiddleware,
  validateData,
  validateParam,
  validatePermission,
  validateQuery,
} from '@/middlewares';
import {
  queryFilterSchema,
  reqParamSchema,
  serviceOrderSchema,
  UserPermissions,
} from '@app/shared';
import { Router } from 'express';

const serviceOrderRouter: Router = Router();

serviceOrderRouter.post(
  '/',
  authMiddleware,
  validateData(serviceOrderSchema),
  validatePermission(UserPermissions.CREATE_SERVICE_ORDER),
  createServiceOrderController,
);

serviceOrderRouter.get(
  '/',
  authMiddleware,
  validateQuery(queryFilterSchema),
  validatePermission(UserPermissions.VIEW_SERVICE_ORDER),
  getPaginatedServiceOrderController,
);

serviceOrderRouter.get(
  '/:id',
  authMiddleware,
  validateParam(reqParamSchema),
  validatePermission(UserPermissions.VIEW_SERVICE_ORDER),
  getServiceOrderController,
);

export { serviceOrderRouter };
