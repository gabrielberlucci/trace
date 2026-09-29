import type { PaginatedStockAdjustments } from '@/types';
import { apiClient } from '../api.client';

export const getPaginatedStockAdjustments = async (
  page: number,
  barcode?: string,
): Promise<PaginatedStockAdjustments | null> => {
  try {
    let url = `/stock-adjustment?page=${page}`;

    if (barcode) {
      url += `&barcode=${barcode}`;
    }

    const { data } = await apiClient.get<PaginatedStockAdjustments>(url);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
