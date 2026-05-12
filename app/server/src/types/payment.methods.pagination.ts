import type { PaginationQueryParams } from './common.pagination.type';
import { PaymentType } from '../../generated/prisma/client';

export interface PaymentMethodQueryParamsFilters extends PaginationQueryParams {
  description: string;
  active: boolean;
  type: PaymentType;
}
