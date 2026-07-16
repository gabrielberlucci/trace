import { isAxiosError } from 'axios';
import { apiClient } from '../api.client';
import type { CreateCustomerData } from '@/types/customer-type';

export const modifyCustomer = async (
  customerId: number,
  data: Partial<CreateCustomerData>,
) => {
  try {
    const result = await apiClient.patch(`/customers/${customerId}`, data);
    return result.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.data.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};
