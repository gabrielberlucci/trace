import type { PaginatedSuppliers } from '@/types';
import { apiClient } from '../api.client';

export const getSuppliers = async (page: number = 1): Promise<PaginatedSuppliers> => {
  const result = await apiClient.get<PaginatedSuppliers>(`/suppliers?page=${page}`);

  return result.data;
};
