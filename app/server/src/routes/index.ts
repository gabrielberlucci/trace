import { Router } from 'express';
import { customerRoute } from './customer.route';
import { supplierRoute } from './supplier.route';
import { productRouter } from './product.route';

const routes: Router = Router();

routes.use('/api/customer', customerRoute);
routes.use('/api/supplier', supplierRoute);
routes.use('/api/product', productRouter);

export { routes };
