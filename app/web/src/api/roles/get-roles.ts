import type { RoleResponse } from '@/types';
import { apiClient } from '../api.client';

export const getRoles = async (): Promise<RoleResponse> => {
  const result = await apiClient.get('/roles');

  return result.data;
};
