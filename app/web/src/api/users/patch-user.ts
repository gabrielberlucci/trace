import { isAxiosError } from 'axios';
import { apiClient } from '../api.client';
import type { CreateUserData } from '@/types';

export const modifyUser = async (
  userId: number,
  userData: Partial<CreateUserData>,
) => {
  try {
    const result = await apiClient.patch(`/users/${userId}`, userData);
    return result.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.data.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};
