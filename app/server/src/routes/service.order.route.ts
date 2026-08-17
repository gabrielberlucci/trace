import { createServiceOrderController } from '@/controllers';
import {
  authMiddleware,
  validateData,
  validatePermission,
} from '@/middlewares';
import { serviceOrderSchema, UserPermissions } from '@app/shared';
import { Router } from 'express';

const serviceOrderRouter: Router = Router();

serviceOrderRouter.post(
  '/',
  authMiddleware,
  validateData(serviceOrderSchema),
  validatePermission(UserPermissions.CREATE_SERVICE_ORDER),
  createServiceOrderController,
);

export { serviceOrderRouter };
