export type StockAdjustmentItem = {
  barcode: string;
  type: string;
  quantity: number;
};

export type StockAdjustmentData = {
  date: string;
  items: StockAdjustmentItem[];
};

export type StockAdjustmentResponse = {
  message: string;
};

export type StockAdjustmentPaginatedItem = {
  id: number;
  quantity: number;
  date: string;
  typeMovement: string;
  productId: number;
  product?: {
    id: number;
    description: string;
    barcode: string;
    unity: string;
  };
};

export type PaginatedStockAdjustmentMeta = {
  totalSales: number;
  hasPrevious: boolean;
  hasNext: boolean;
  totalPages: number;
};

export type PaginatedStockAdjustments = {
  status: string;
  message: string;
  meta: PaginatedStockAdjustmentMeta;
  data: StockAdjustmentPaginatedItem[];
};
