import { isAxiosError } from 'axios';
import { apiClient } from '../api.client';
import type { PaginatedNfeLogs } from '@/types';

export const getNfeLogs = async (
  page: number = 1,
  search?: string,
): Promise<PaginatedNfeLogs> => {
  let url = `/uploader-xml/logs?page=${page}`;

  if (search && search.trim()) {
    url += `&name=${encodeURIComponent(search.trim())}`;
  }

  const result = await apiClient.get<PaginatedNfeLogs>(url);
  return result.data;
};

export const uploadXmlFile = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const result = await apiClient.post('/uploader-xml', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return result.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.data.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};
