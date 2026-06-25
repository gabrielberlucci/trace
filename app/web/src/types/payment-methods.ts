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

//**POST Payment */

export interface CreatePaymentMethodDataResponse {
  status: string;
  message: string;
  data: {
    id: number;
    description: string;
    active: boolean;
    fee: number;
    type: string;
    createdAt: Date;
  };
}

export interface CreatePaymentMethodData {
  description: string;
  active?: boolean;
  fee?: number;
  type: string;
}
