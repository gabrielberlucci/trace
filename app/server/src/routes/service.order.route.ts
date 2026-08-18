import {
  createServiceOrderController,
  getPaginatedServiceOrderController,
} from '@/controllers';
import {
  authMiddleware,
  validateData,
  validatePermission,
  validateQuery,
} from '@/middlewares';
import {
  queryFilterSchema,
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

export { serviceOrderRouter };
