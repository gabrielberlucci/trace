import type { PaginatedProducts } from '@/types/product-type';
import { apiClient } from '../api.client';

export const getProducts = async (
  page: number = 1,
): Promise<PaginatedProducts> => {
  const result = await apiClient.get<PaginatedProducts>(
    `/products?page=${page}`,
  );

  return result.data;
};
