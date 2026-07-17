import type { PaginatedPaymentMethods } from '@/types';
import { apiClient } from '../api.client';
import { isAxiosError } from 'axios';

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

export const getSinglePaymentMethod = async (paymentMethodId: number) => {
  try {
    const result = await apiClient.get(`/payment-methods/${paymentMethodId}`);

    return result.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.data.message) {
      throw new Error(error.request.data.message);
    }
    throw error;
  }
};
