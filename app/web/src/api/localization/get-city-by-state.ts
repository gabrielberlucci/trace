import { apiClient } from '../api.client';
import type { PaginatedCity } from '@/types';

export const getCityByState = async (
  page: number = 1,
  state: string,
  city: string,
): Promise<PaginatedCity> => {
  let url = `/localization/cities?page=${page}`;

  if (state && state.trim()) {
    url += `&state=${state}`;
  }

  if (city && city.trim()) {
    url += `&city=${city}`;
  }

  const result = await apiClient.get(url);

  return result.data;
};
