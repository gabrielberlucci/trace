export interface PaginatedSuppliers {
  status: string;
  message: string;
  meta: PaginatedSuppliersMeta;
  data: PaginatedSuppliersData[];
}

export interface PaginatedSuppliersMeta {
  totalSuppliers: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface PaginatedSuppliersData {
  id: number;
  document: string;
  typePerson: string;
  name: string;
  active: boolean;
}
