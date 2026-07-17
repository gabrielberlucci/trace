import type { PaginatedSuppliers } from '@/types/supplier-type';
import { apiClient } from '../api.client';
import { isAxiosError } from 'axios';

export const getSuppliers = async (
  page: number = 1,
  search?: string,
  active?: string,
): Promise<PaginatedSuppliers> => {
  let url = `/suppliers?page=${page}`;

  if (search && search.trim()) {
    const cleaned = search.replace(/\D/g, '');

    if (cleaned.length === 11 || cleaned.length === 14) {
      url += `&document=${encodeURIComponent(cleaned)}`;
    } else if (search.trim().length >= 2) {
      url += `&name=${encodeURIComponent(search.trim())}`;
    }
  }

  if (active === 'Ativo') {
    url += '&active=true';
  } else if (active === 'Inativo') {
    url += '&active=false';
  }

  const result = await apiClient.get<PaginatedSuppliers>(url);

  return result.data;
};

export const getSingleSupplier = async (supplierId: number) => {
  try {
    const result = await apiClient.get(`/suppliers/${supplierId}`);

    return result.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.data.message) {
      throw new Error(error.request.data.message);
    }
    throw error;
  }
};
