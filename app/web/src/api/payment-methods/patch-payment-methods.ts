import { isAxiosError } from 'axios';
import { apiClient } from '../api.client';
import type { CreatePaymentMethodData } from '@/types';

export const modifyPaymentMethod = async (
  paymentMethodID: number,
  paymentMethodData: Partial<CreatePaymentMethodData>,
) => {
  try {
    const result = await apiClient.patch(
      `/payment-methods/${paymentMethodID}`,
      paymentMethodData,
    );
    return result.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.data.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};
