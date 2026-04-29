import type { PaginationQueryParams } from './common.pagination.type';

export interface CustomerQueryParamsFilters extends PaginationQueryParams {
  document: string;
  name: string;
  active: number;
}
