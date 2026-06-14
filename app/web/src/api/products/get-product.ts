import type { PaginatedProducts } from '@/types/product-type';
import { apiClient } from '../api.client';

export const getProducts = async (
  page: number = 1,
  search?: string,
): Promise<PaginatedProducts> => {
  let url = `/products?page=${page}`;

  if (search && search.trim()) {
    const isBarcode = /^\d+$/.test(search.trim());
    if (isBarcode) {
      url += `&barcode=${encodeURIComponent(search.trim())}`;
    } else if (search.trim().length >= 2) {
      url += `&description=${encodeURIComponent(search.trim())}`;
    }
  }

  const result = await apiClient.get<PaginatedProducts>(url);

  return result.data;
};
