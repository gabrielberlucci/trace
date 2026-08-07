import type { PaginationQueryParams } from './common.pagination.type';

export interface UploadXMLQueryParamsFilters extends PaginationQueryParams {
  numnf: string;
  nfeKey: string;
}
