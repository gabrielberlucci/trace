import { isAxiosError } from 'axios';
import { apiClient } from '../api.client';
import type { PaginatedNfeLogs, PaginatedAxiomErrors } from '@/types';

export const getNfeLogs = async (
  page: number = 1,
  search?: string,
  numnf?: string,
): Promise<PaginatedNfeLogs> => {
  let url = `/uploader-xml/logs/imports?page=${page}`;

  if (search && search.trim()) {
    url += `&nfeKey=${encodeURIComponent(search.trim())}`;
  }

  if (numnf && numnf.trim()) {
    url += `&numnf=${encodeURIComponent(numnf.trim())}`;
  }

  const result = await apiClient.get<PaginatedNfeLogs>(url);
  return result.data;
};

export const getAxiomErrors = async (
  cursor?: string,
): Promise<PaginatedAxiomErrors> => {
  let url = `/uploader-xml/logs/imports/errors`;
  if (cursor) {
    url += `?cursor=${encodeURIComponent(cursor)}`;
  }
  const result = await apiClient.get<PaginatedAxiomErrors>(url);
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
