import { isAxiosError } from 'axios';
import { apiClient } from '../api.client';
import type { PaginatedCompanies } from '@/types';

export const getCompanies = async (
  page: number = 1,
  search?: string,
  active?: string,
): Promise<PaginatedCompanies> => {
  let url = `/companies?page=${page}`;

  if (search && search.trim()) {
    if (search.length > 2) {
      url += `&name=${encodeURIComponent(search.trim())}`;
    }
  }

  if (active === 'Ativo') {
    url += `&active=true`;
  } else if (active === 'Inativo') {
    url += `&active=false`;
  }

  const result = await apiClient.get<PaginatedCompanies>(url);
  return result.data;
};

export const getSingleCompany = async (companyId: number) => {
  try {
    const result = await apiClient.get(`/companies/${companyId}`);
    return result.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.data.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};
