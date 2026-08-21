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
    fantasyName: string | null;
    phone: string;
    address: string;
    neighborhood: string | null;
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
  fantasyName?: string;
  phone?: string;
  address?: string;
  neighborhood?: string;
  zipcode?: string;
  addressNumber?: number;
  complement?: string;
  email?: string;
  ie?: string;
  active?: boolean | string;
  cityId?: number;
}
