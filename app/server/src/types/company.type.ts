import type { PaginationQueryParams } from './common.pagination.type';

export interface CompanyQueryParamsFilters extends PaginationQueryParams {
  document: string;
  name: string;
  active: boolean;
}
