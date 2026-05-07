import type { PaginationQueryParams } from './common.pagination.type';

export interface SaleQueryParamsFilters extends PaginationQueryParams {
  document: string;
}
