import type { SaleData, SaleResponse } from '@/types';
import { apiClient } from '../api.client';
import { isAxiosError } from 'axios';

export const createSale = async (saleData: SaleData): Promise<SaleResponse> => {
  try {
    const result = await apiClient.post('/sales', saleData);

    return result.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.data) {
      const data = error.response.data;
      if (data.message) {
        throw new Error(data.message);
      }
      if (data.fieldErrors || data.formErrors) {
        const fieldErrors = data.fieldErrors
          ? JSON.stringify(data.fieldErrors)
          : '';
        const formErrors = data.formErrors?.length
          ? data.formErrors.join(', ')
          : '';
        throw new Error(`Erro de validação: ${formErrors} ${fieldErrors}`);
      }
    }
    throw error;
  }
};
