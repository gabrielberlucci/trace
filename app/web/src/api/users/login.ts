import type { UserLoginPayload } from '@/types';
import { apiClient } from '../api.client';

export const loginUser = async (data: UserLoginPayload): Promise<void> => {
  await apiClient.post('/users/login', data);
};
