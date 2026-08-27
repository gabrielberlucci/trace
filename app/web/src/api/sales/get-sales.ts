import { apiClient } from '../api.client';
import { type PaginatedSales, type SingleSaleResponse } from '@/types';

export const getSales = async (
  page: number = 1,
  document: string,
): Promise<PaginatedSales> => {
  let url = `/sales?page=${page}`;

  if (document && document.trim()) {
    url += `&document=${encodeURIComponent(document)}`;
  }

  const result = await apiClient.get<PaginatedSales>(url);

  return result.data;
};

export const getSingleSale = async (
  id: number,
): Promise<SingleSaleResponse> => {
  const result = await apiClient.get<SingleSaleResponse>(`/sales/${id}`);

  return result.data;
};
