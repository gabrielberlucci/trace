import { isAxiosError } from 'axios';
import { apiClient } from '../api.client';
import type { CreateUserData, CreateUserDataResponse } from '@/types';

export const createUser = async (
  userData: CreateUserData,
): Promise<CreateUserDataResponse> => {
  try {
    const result = await apiClient.post('/users/register', userData);

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
