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
  message?: string; // added to merge axiom data
}

export interface PaginatedAxiomErrors {
  status: string;
  message: string;
  meta: {
    minCursor: string;
    maxCursor: string;
  };
  data: AxiomErrorData[];
}

export interface AxiomErrorData {
  time: string;
  jobMessage: string;
  jobName: string;
}
