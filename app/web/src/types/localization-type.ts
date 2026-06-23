export interface PaginatedCity {
  status: string;
  message: string;
  meta: PaginatedCityMeta;
  data: PaginatedCityData[];
}

export interface PaginatedCityMeta {
  total: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface PaginatedCityData {
  id: number;
  name: string;
  state: string;
}
