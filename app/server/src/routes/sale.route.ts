import { createSaleController } from '@/controllers';
import { validateData } from '@/middlewares';
import { saleCartSchema } from '@/schemas';
import { Router } from 'express';

const saleRouter: Router = Router();

saleRouter.post('/', validateData(saleCartSchema), createSaleController);

export { saleRouter };
