import { apiClient } from '../api.client';
import type { PaginatedCustomers } from '@/types/customer-type';

export const getCustomers = async (
  page: number = 1,
  search?: string,
): Promise<PaginatedCustomers> => {
  let url = `/customers?page=${page}`;

  if (search && search.trim()) {
    const cleaned = search.replace(/\D/g, '');
    if (cleaned.length === 11 || cleaned.length === 14) {
      url += `&document=${encodeURIComponent(cleaned)}`;
    } else if (search.trim().length >= 2) {
      url += `&name=${encodeURIComponent(search.trim())}`;
    }
  }

  const response = await apiClient.get<PaginatedCustomers>(url);
  return response.data;
};
