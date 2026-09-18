import type { PaginationQueryParams } from './common.pagination.type';

export interface KardexQueryParams extends PaginationQueryParams {
  barcode: string;
}
