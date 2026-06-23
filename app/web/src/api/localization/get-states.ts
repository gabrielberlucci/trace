import { apiClient } from '../api.client';

export const getStates = async (): Promise<object> => {
  const result = await apiClient.get('/localization/states');

  return result.data;
};
