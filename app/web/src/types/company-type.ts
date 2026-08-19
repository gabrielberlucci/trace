export interface PaginatedCompanies {
  status: string;
  message: string;
  data: PaginatedCompanyData[];
  meta: PaginatedCompanyMeta;
}

export interface PaginatedCompanyMeta {
  total: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface PaginatedCompanyData {
  id: number;
  document: string;
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
  createdAt: string;
  updatedAt: string;
  cityId: number;
  city?: {
    id: number;
    name: string;
    state: string;
  };
}

export interface CreateCompanyData {
  id?: number;
  document: string;
  name: string;
  fantasyName?: string;
  birthdate?: Date;
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
