export interface DashboardQueryParams {
  inicialDate: Date;
  finalDate: Date;
}

export interface HighestSalesProducts {
  barcode: string;
  description: string;
  currentStock: number;
  sales: number;
}
