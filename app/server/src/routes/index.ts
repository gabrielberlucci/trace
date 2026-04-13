import { Router } from 'express';
import { customerRoute } from './customer.route';
import { supplierRoute } from './supplier.route';

const routes: Router = Router();

routes.use('/api/customer', customerRoute);
routes.use('/api/supplier', supplierRoute);

export { routes };
