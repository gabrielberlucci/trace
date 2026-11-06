import type { PaginationQueryParams } from '@/types';

export interface CategoriesQueryFilter extends PaginationQueryParams {
  name: string;
}
