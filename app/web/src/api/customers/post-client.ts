import type {
  CreateCustomerData,
  CreateCustomerDataResponse,
  GenericErrorMessageResponse,
} from '@/types';
import { apiClient } from '../api.client';
import { isAxiosError } from 'axios';

export const createCustomer = async (
  data: CreateCustomerData,
): Promise<CreateCustomerDataResponse> => {
  try {
    const response = await apiClient.post('/customers', data);
    return response.data;
  } catch (error) {
    if (
      isAxiosError<GenericErrorMessageResponse>(error) &&
      error.response?.data?.message
    ) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};
