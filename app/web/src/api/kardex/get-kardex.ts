import type { PaginatedKardex } from '@/types/kardex-type';
import { apiClient } from '../api.client';

export const getKardex = async (
  page: number = 1,
  barcode?: string,
): Promise<PaginatedKardex> => {
  let url = `/kardex?page=${page}`;

  if (barcode && barcode.trim()) {
    url += `&barcode=${encodeURIComponent(barcode.trim())}`;
  }

  const result = await apiClient.get<PaginatedKardex>(url);

  return result.data;
};
