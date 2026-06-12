import type { PaginatedPaymentMethods } from '@/types';
import { apiClient } from '../api.client';

export const getPaymentMethods = async (
  page: number,
  search?: string,
  active?: string,
): Promise<PaginatedPaymentMethods> => {
  let url = `/payment-methods?page=${page}`;

  if (search && search.trim()) {
    if (search.length === 2) {
      url += `&type=${encodeURIComponent(search)}`;
    } else if (search.length > 2) {
      url += `&description=${encodeURIComponent(search)}`;
    }
  }

  if (active === 'Ativo') {
    url += `&active=true`;
  } else if (active === 'Inativo') {
    url += `&active=false`;
  }

  const result = await apiClient.get<PaginatedPaymentMethods>(url);

  return result.data;
};
