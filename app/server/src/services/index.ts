import {
  createCustomer,
  modifyCustomer,
  getPaginatedCustomers,
} from './customer.service';

import {
  createProduct,
  modifyProduct,
  getPaginatedProducts,
} from './product.service';

import { createSupplier, modifySupplier } from './supplier.service';

import {
  createUser,
  loginUser,
  getPaginatedUsers,
  modifyUser,
} from './user.service';

import { createSale, getPaginatedSales, getSale } from './sale.service';
import { createPaymentMethod, modifyPaymentMethod } from './payment.service';

export {
  createCustomer,
  modifyCustomer,
  getPaginatedCustomers,
  createProduct,
  modifyProduct,
  createSupplier,
  modifySupplier,
  getPaginatedProducts,
  createUser,
  loginUser,
  getPaginatedUsers,
  modifyUser,
  createSale,
  getPaginatedSales,
  getSale,
  createPaymentMethod,
  modifyPaymentMethod,
};
