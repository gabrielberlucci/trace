import { Router } from 'express';
import { customerRoute } from './customer.route';
import { supplierRoute } from './supplier.route';
import { productRouter } from './product.route';
import { userRouter } from './user.route';
import { saleRouter } from './sale.route';
import { paymentMethodsRoutes } from './payment.methods.route';
import { localizationRouter } from './localization.route';
import { roleRouter } from './role.route';

const routes: Router = Router();

routes.use('/api/v1/customers', customerRoute);
routes.use('/api/v1/suppliers', supplierRoute);
routes.use('/api/v1/products', productRouter);
routes.use('/api/v1/users', userRouter);
routes.use('/api/v1/sales', saleRouter);
routes.use('/api/v1/payment-methods', paymentMethodsRoutes);
routes.use('/api/v1/localization', localizationRouter);
routes.use('/api/v1/roles', roleRouter);

export { routes };
