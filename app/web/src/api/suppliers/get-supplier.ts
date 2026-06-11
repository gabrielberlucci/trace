import type { PaginatedSuppliers } from '@/types';
import { apiClient } from '../api.client';

export const getSuppliers = async (
  page: number = 1,
  search?: string,
): Promise<PaginatedSuppliers> => {
  let url = `/suppliers?page=${page}`;

  if (search && search.trim()) {
    const cleaned = search.replace(/\D/g, '');

    if (cleaned.length === 11 || cleaned.length === 14) {
      url += `document?=${encodeURIComponent(cleaned)}`;
    } else if (search.trim() && search.length > 2) {
      url += `name?=${encodeURIComponent(search.trim())}`;
    }
  }

  const result = await apiClient.get<PaginatedSuppliers>(url);

  return result.data;
};
