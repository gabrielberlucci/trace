export interface PaginatedProducts {
  status: string;
  message: string;
  meta: PaginatedProductsMeta;
  data: PaginatedProductsData[];
}

export interface PaginatedProductsMeta {
  totalProductss: number;
  hasPrevious: boolean;
  hasNext: boolean;
  totalPages: number;
}

export interface PaginatedProductsData {
  id: number;
  description: string;
  barcode: string;
  currentStock: number;
  unity: string;
  salePrice: number;
}

//*POST PRODUCT */
//

export interface CreateProductDataResponse {
  status: string;
  message: string;
  data: {
    id: number;
    description: string;
    barcode: string;
    unity: string;
    currentStock: number;
    costPrice: number;
    salePrice: number;
    supplierId?: number;
  };
}

export interface CreateProductData {
  description: string;
  barcode: string;
  unity: string;
  currentStock: number;
  costPrice: number;
  salePrice: number;
  supplierId?: number;
}
