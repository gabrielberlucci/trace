export interface HighestSalesProduct {
  barcode: string;
  description: string;
  currentStock: number;
  sales: number;
}

export interface DashboardData {
  avgTicket: string;
  highestSalesProducts: HighestSalesProduct[];
  totalSaleIncome: string;
  totalOSIncome: string;
}

export interface DashboardResponse {
  status: string;
  message: string;
  data: DashboardData;
}

export interface GetDashboardParams {
  startDate: string;
  endDate: string;
}
