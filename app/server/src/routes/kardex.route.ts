import { getKardexController } from '@/controllers';
import { validateQuery } from '@/middlewares';
import { queryFilterSchema } from '@app/shared';
import { Router } from 'express';

const kardexRouter: Router = Router();

kardexRouter.get('/', validateQuery(queryFilterSchema), getKardexController);

export { kardexRouter };
