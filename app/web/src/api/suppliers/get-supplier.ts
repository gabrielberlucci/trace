import type { PaginatedSuppliers } from '@/types';
import { apiClient } from '../api.client';

export const getSuppliers = async (): Promise<PaginatedSuppliers> => {
  const result = await apiClient.get<PaginatedSuppliers>('/suppliers');

  return result.data;
};
