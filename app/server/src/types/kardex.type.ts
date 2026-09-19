import type { PaginationQueryParams } from './common.pagination.type';

export interface KardexQueryParams extends PaginationQueryParams {
  barcode: string;
}

export interface KardexResult {
  movementId: number;
  quantity: number;
  date: Date;
  typeMovement: string;
  numNf?: string;
  serieNf?: string;
  saleId?: number;
  barcode: string;
  total: number;
}
