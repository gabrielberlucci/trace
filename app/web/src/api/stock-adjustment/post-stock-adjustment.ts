import type { StockAdjustmentData, StockAdjustmentResponse } from '@/types';
import { apiClient } from '../api.client';
import { isAxiosError } from 'axios';

export const createStockAdjustment = async (
  data: StockAdjustmentData,
): Promise<StockAdjustmentResponse> => {
  try {
    const result = await apiClient.post('/stock-adjustment', data);

    return result.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.data) {
      const errorData = error.response.data;
      if (errorData.message) {
        throw new Error(errorData.message);
      }
      if (errorData.fieldErrors || errorData.formErrors) {
        const fieldErrors = errorData.fieldErrors
          ? JSON.stringify(errorData.fieldErrors)
          : '';
        const formErrors = errorData.formErrors?.length
          ? errorData.formErrors.join(', ')
          : '';
        throw new Error(`Erro de validação: ${formErrors} ${fieldErrors}`);
      }
    }
    throw error;
  }
};
