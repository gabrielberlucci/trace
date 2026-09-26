export interface StockAdjustmentData {
  date: Date;
  items: {
    barcode: string;
    type: string;
    quantity: number;
  }[];
}

export interface ValidatedStockAdjustmentData {
  barcode: string;
  quantity: number;
  type: string;
}

export interface Product {
  id: number;
  barcode: string;
  currentStock: number;
}
