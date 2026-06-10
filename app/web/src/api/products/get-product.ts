import type { PaginatedProducts } from '@/types';
import { apiClient } from '../api.client';

export const getProducts = async (page: number): Promise<PaginatedProducts> => {
  const result = await apiClient.get<PaginatedProducts>(
    `/products?page=${page}`,
  );

  return result.data;
};
