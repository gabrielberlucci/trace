import type { PaginationQueryParams } from './common.pagination.type';

export interface SupplierQueryParamsFilters extends PaginationQueryParams {
  document: string;
  name: string;
  active: string;
}
