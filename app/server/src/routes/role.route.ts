import { getRolesController } from '@/controllers';
import { authMiddleware } from '@/middlewares';
import { Router } from 'express';

const roleRouter: Router = Router();

roleRouter.get('/', authMiddleware, getRolesController);

export { roleRouter };
