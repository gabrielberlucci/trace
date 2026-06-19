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

/* handle customer POST */

export interface CreateCustomerDataResponse {
  status: string;
  message: string;
  data: {
    id: number;
    document: string;
    typePerson: string;
    name: string;
    birthdate: Date;
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

export interface CreateCustomerData {
  id?: number;
  document: string;
  typePerson?: string;
  name: string;
  birthdate?: Date;
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
