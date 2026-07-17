import { isAxiosError } from 'axios';
import { apiClient } from '../api.client';
import type { CreateSupplierData } from '@/types';

export const modifySupplier = async (
  supplierId: number,
  supplierData: Partial<CreateSupplierData>,
) => {
  try {
    const result = await apiClient.patch(
      `/suppliers/${supplierId}`,
      supplierData,
    );
    return result.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.data.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};
