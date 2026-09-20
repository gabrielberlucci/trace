export interface PaginatedKardex {
  status: string;
  message: string;
  meta: PaginatedKardexMeta;
  data: PaginatedKardexData[];
}

export interface PaginatedKardexMeta {
  total: number;
  hasPrevious: boolean;
  hasNext: boolean;
  totalPages: number;
}

export interface PaginatedKardexData {
  movementId: number;
  quantity: number;
  date: string;
  typeMovement: string;
  numNf?: string;
  serieNf?: string;
  saleId?: number;
  barcode: string;
  total: number;
}
