export interface PaginatedCustomers {
  status: string;
  message: string;
  meta: PaginatedCustomerMeta;
  data: PaginatedCustomerData[];
}

export interface PaginatedCustomerMeta {
  totalCustomers: number;
  hasPrevious: boolean;
  hasNext: boolean;
  totalPages: number;
}

export interface PaginatedCustomerData {
  id: number;
  name: string;
  document: string;
  active: boolean;
}
