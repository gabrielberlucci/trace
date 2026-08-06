export interface PaginatedNfeLogs {
  status: string;
  message: string;
  data: NfeLogData[];
  meta: PaginatedNfeLogMeta;
}

export interface PaginatedNfeLogMeta {
  total: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface NfeLogData {
  id: number;
  nfeAccessKey: string;
  processedAt: string;
  createdAt: string;
}
