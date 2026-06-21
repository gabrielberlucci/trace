import type { PaginationQueryParams } from './common.pagination.type';

export interface CityStateQueryParamsFilters extends PaginationQueryParams {
  state: string;
  city: string;
}
