import type { DecimalJsLike } from '@prisma/client/runtime/client';
import { type Movement } from '../../generated/prisma/client';
import type { PaginationQueryParams } from './common.pagination.type';

export interface SaleCart {
  items: SaleItemCart[];
  document: string;
  payment: number;
  cashier: number;
}

interface SaleItemCart {
  barcode: string;
  quantity: number;
}

export interface ValidatedSaleCart {
  description: string;
  barcode: string;
  quantity: number;
  costPrice: DecimalJsLike;
  salePrice: DecimalJsLike;
  totalPrice: DecimalJsLike;
  saleId?: number;

  product: {
    connect: {
      id: number;
    };
  };

  movement: {
    create: {
      quantity: number;
      typeMovement: Movement;
      productId: number;
    };
  };
}

export interface SaleQueryParamsFilters extends PaginationQueryParams {
  document: string;
}
