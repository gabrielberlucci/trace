import { apiClient } from '../api.client';
import type { DashboardResponse, DashboardData, GetDashboardParams } from '@/types';

export const getDashboard = async (
  params: GetDashboardParams,
): Promise<DashboardData> => {
  const response = await apiClient.get<DashboardResponse>('/dashboard', {
    params,
  });
  return response.data.data;
};
