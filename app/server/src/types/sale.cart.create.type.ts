import type { DecimalJsLike } from '@prisma/client/runtime/client';
import { type Movement } from '../../generated/prisma/client';

export interface SaleCart {
  items: SaleItemCart[];
  document: string;
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
