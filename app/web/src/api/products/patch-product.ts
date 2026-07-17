import type { CreateProductData } from '@/types';
import { apiClient } from '../api.client';
import { isAxiosError } from 'axios';

export const patchProduct = async (
  productId: number,
  productData: Partial<CreateProductData>,
) => {
  try {
    const result = await apiClient.patch(`/products/${productId}`, productData);

    return result.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.data.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};
