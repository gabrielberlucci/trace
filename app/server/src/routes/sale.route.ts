import { createSaleController, getSalesController } from '@/controllers';
import { validateData, validateQuery } from '@/middlewares';
import { queryFilterSchema, saleCartSchema } from '@/schemas';
import { Router } from 'express';

const saleRouter: Router = Router();

saleRouter.post('/', validateData(saleCartSchema), createSaleController);
saleRouter.get('/', validateQuery(queryFilterSchema), getSalesController);

export { saleRouter };
