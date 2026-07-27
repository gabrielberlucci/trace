export { getCustomers, getSingleCustomer } from './customers/get.customer';
export { getSuppliers, getSingleSupplier } from './suppliers/get-supplier';
export { getProducts, getSingleProduct } from './products/get-product';
export {
  getPaymentMethods,
  getSinglePaymentMethod,
} from './payment-methods/get-payment-methods';
export { getUsers, getSingleUser } from './users/get-users';

export { createCustomer } from './customers/post-client';
export { modifyCustomer } from './customers/patch-client';

export { getStates } from './localization/get-states';
export { getCityByState } from './localization/get-city-by-state';
export { createProduct } from './products/post-product';
export { createPaymentMethod } from './payment-methods/post-payment';
export { createUser } from './users/post-user';
export { getRoles } from './roles/get-roles';
export { createSale } from './sales/post-sales';
export { getSales } from './sales/get-sales';
export { getMe } from './users/me';

export { patchProduct } from './products/patch-product';
export { modifySupplier } from './suppliers/patch-supplier';
export { modifyPaymentMethod } from './payment-methods/patch-payment-methods';
export { modifyUser } from './users/patch-user';
export { getCompanies, getSingleCompany } from './companies/get-companies';
export { modifyCompany } from './companies/patch-company';
