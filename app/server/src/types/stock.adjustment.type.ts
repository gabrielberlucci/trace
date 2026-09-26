export interface StockAdjustmentData {
  date: Date;
  items: {
    barcode: string;
    type: string;
    quantity: number;
  }[];
}
