import { apiClient } from '../api.client';
import type { PaginatedCustomers } from '@/types/customer-type';

export const getCustomers = async (page: number = 1): Promise<PaginatedCustomers> => {
  const response = await apiClient.get<PaginatedCustomers>(`/customers?page=${page}`);
  return response.data;
};
