import type { PaginationQueryParams } from './common.pagination.type';

export interface ProductQueryParamsFilters extends PaginationQueryParams {
  description: string;
  barcode: string;
}
