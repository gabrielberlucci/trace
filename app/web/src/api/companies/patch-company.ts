import { isAxiosError } from 'axios';
import { apiClient } from '../api.client';
import type { CreateCompanyData } from '@/types';

export const modifyCompany = async (
  companyId: number,
  companyData: Partial<CreateCompanyData>,
) => {
  try {
    const result = await apiClient.patch(
      `/companies/${companyId}`,
      companyData,
    );
    return result.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.data.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};
