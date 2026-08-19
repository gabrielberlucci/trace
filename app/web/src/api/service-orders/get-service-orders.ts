import { apiClient } from '../api.client';
import type { PaginatedServiceOrders, ServiceOrderData } from '@/types';

export const getServiceOrders = async (
  page: number = 1,
  search?: string,
): Promise<PaginatedServiceOrders> => {
  let url = `/service-orders?page=${page}`;

  if (search && search.trim()) {
    url += `&document=${encodeURIComponent(search.trim())}`;
  }

  const result = await apiClient.get<PaginatedServiceOrders>(url);
  return result.data;
};

export const getSingleServiceOrder = async (
  id: number,
): Promise<{ status: string; message: string; data: ServiceOrderData }> => {
  const result = await apiClient.get<{
    status: string;
    message: string;
    data: ServiceOrderData;
  }>(`/service-orders/${id}`);
  return result.data;
};
