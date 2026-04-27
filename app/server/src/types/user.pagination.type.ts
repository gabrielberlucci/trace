import type { PaginationQueryParams } from './common.pagination.type';

export interface UserQueryParamsFilters extends PaginationQueryParams {
  username: string;
}
