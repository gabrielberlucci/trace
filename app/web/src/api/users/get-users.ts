import type { PaginatedUsers } from '@/types';
import { apiClient } from '../api.client';
import { isAxiosError } from 'axios';

export const getUsers = async (
  page: number = 1,
  search?: string,
  active?: string,
): Promise<PaginatedUsers> => {
  let url = `/users?page=${page}`;

  if (search && search.trim()) {
    if (search.length > 2) {
      url += `&username=${encodeURIComponent(search.trim())}`;
    }
  }

  if (active === 'Ativo') {
    url += `&active=true`;
  } else if (active === 'Inativo') {
    url += `&active=true`;
  }

  const result = await apiClient.get<PaginatedUsers>(url);

  return result.data;
};

export const getSingleUser = async (userId: number) => {
  try {
    const result = await apiClient.get(`/users/${userId}`);

    return result.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.data.message) {
      throw new Error(error.request.data.message);
    }
    throw error;
  }
};
