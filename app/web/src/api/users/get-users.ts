import type { PaginatedUsersData } from '@/types';
import { apiClient } from '../api.client';

export const getUsers = async (
  page: number = 1,
  search?: string,
  active?: string,
): Promise<PaginatedUsersData> => {
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

  const result = await apiClient.get<PaginatedUsersData>(url);

  return result.data;
};
