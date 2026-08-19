export interface ServiceOrderItem {
  id: number;
  date: string;
  description: string;
  hours: number;
  hourlyRate: number;
  totalPrice: number;
}

export interface ServiceOrderCompany {
  document: string;
  name: string;
  fantasyName: string | null;
  phone: string | null;
  address: string | null;
  neighborhood: string | null;
  zipcode: string | null;
  addressNumber: number | null;
  complement: string | null;
  email: string | null;
  ie: string | null;
  active: boolean;
  city: {
    name: string;
    ibge: string;
    stateId: number;
  } | null;
}

export interface ServiceOrderCustomer {
  document: string;
  name: string;
  fantasyName: string | null;
  phone: string | null;
  address: string | null;
  neighborhood: string | null;
  zipcode: string | null;
  addressNumber: number | null;
  complement: string | null;
  email: string | null;
  active: boolean;
  city: {
    name: string;
    ibge: string;
    stateId: number;
  } | null;
}

export interface ServiceOrderData {
  id: number;
  date: string;
  serviceOrderItems: ServiceOrderItem[];
  company: ServiceOrderCompany;
  customer: ServiceOrderCustomer;
}

export interface PaginatedServiceOrderMeta {
  total: number;
  hasPrevious: boolean;
  hasNext: boolean;
  totalPages: number;
}

export interface PaginatedServiceOrders {
  status: string;
  message: string;
  meta: PaginatedServiceOrderMeta;
  data: ServiceOrderData[];
}
