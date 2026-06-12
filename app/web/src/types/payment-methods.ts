export interface PaginatedPaymentMethods {
  status: string;
  message: string;
  meta: PaginatedPaymentMethodsMeta;
  data: PaginatedPaymentMethodsData[];
}

export interface PaginatedPaymentMethodsMeta {
  total: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface PaginatedPaymentMethodsData {
  id: number;
  description: string;
  type: string;
  active: boolean;
}
