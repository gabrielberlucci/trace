import { createSaleController } from '@/controllers';
import { validateData } from '@/middlewares';
import { Router } from 'express';

const saleRouter: Router = Router();

/**
 * !TODO: add validation schema from ZOD
 */
saleRouter.post('/', createSaleController);

export { saleRouter };
