export interface SaleResponse {
  status: string;
  message: string;
  data: {
    sale: {
      id: number;
      customerId: number;
      paymentMethodId: number;
      userId: number;
      saleItem: SaleItem[];
    };
  };
}

export interface SaleItem {
  id: number;
  description: string;
  barcode: string;
  quantity: number;
  costPrice: number;
  salePrice: number;
  totalPrice: number;
  date: Date;
  saleId: number;
  productId: number;
}

export interface SaleData {
  document: string;
  cashier: number;
  payment: number;
  items: SaleDataItem[];
}

export interface SaleDataItem {
  barcode: string;
  quantity: number;
}

/**GET */

export interface PaginatedSales {
  status: string;
  message: string;
  meta: {
    totalSales: number;
    totalPages: number;
    hasPrevious: boolean;
    hasNext: boolean;
  };

  data: PaginatedSalesData[];
}

export interface PaginatedSalesData {
  id: number;
  customerId: number;
  paymentMethodId: number;
  userId: number;
  customer: {
    name: string;
  };
  paymentMethod: {
    description: string;
  };
}

export interface SingleSaleResponse {
  status: string;
  message: string;
  data: SingleSaleData;
}

export interface SingleSaleData {
  id: number;
  date: string;
  company: {
    fantasyName: string | null;
    phone: string | null;
    address: string | null;
    neighborhood: string | null;
    addressNumber: number | null;
    email: string | null;
  } | null;
  customer: {
    name: string | null;
    phone: string | null;
    address: string | null;
    neighborhood: string | null;
    addressNumber: number | null;
    city: {
      name: string;
      state: string;
    } | null;
  } | null;
  paymentMethod: {
    description: string | null;
  } | null;
  saleItem: {
    barcode: string;
    description: string | null;
    quantity: number;
    salePrice: string;
    totalPrice: string;
  }[] | null;
  user: {
    name: string | null;
  } | null;
}
