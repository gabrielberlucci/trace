import type { PaginationQueryParams } from './common.pagination.type';

export interface UserQueryParamsFilters extends PaginationQueryParams {
  username: string;
  active: boolean;
}

export interface UserLogin {
  username: string;
  password: string;
}

export interface UserRoleLevel {
  name: string;
  level: number;
}
