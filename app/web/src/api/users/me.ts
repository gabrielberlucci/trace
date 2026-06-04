import type { MeApiResponse, UserMeResponse } from '@/types';
import { apiClient } from '../api.client';

export const getMe = async (): Promise<UserMeResponse> => {
  const response = await apiClient.get<MeApiResponse>('/users/me');
  return response.data.data;
};
