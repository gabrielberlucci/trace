import type { PaginationQueryParams } from '../../../types/common.pagination.type';

export interface ProductQueryFilters extends PaginationQueryParams {
  description: string;
  barcode: string;
  id: string;
}
