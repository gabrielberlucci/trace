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

//** POST SUPPLIER */

export interface CreateSupplierDataResponse {
  status: string;
  message: string;
  data: {
    id: number;
    document: string;
    typePerson: string;
    name: string;
    phone: string;
    address: string;
    zipcode: string;
    addressNumber: number;
    complement: string;
    email: string;
    ie: string;
    active: boolean;
    cityId: number;
  };
}

export interface CreateSupplierData {
  document: string;
  typePerson?: string;
  name: string;
  phone?: string;
  address?: string;
  zipcode?: string;
  addressNumber?: number;
  complement?: string;
  email?: string;
  ie?: string;
  active?: boolean | string;
  cityId?: number;
}
