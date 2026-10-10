import type { PaginatedProducts } from '@/types/product-type';
import { apiClient } from '../api.client';
import { isAxiosError } from 'axios';

export const getProducts = async (
  page: number = 1,
  search?: string,
): Promise<PaginatedProducts> => {
  let url = `/products?page=${page}`;

  if (search && search.trim()) {
    const searchTerm = search.trim();
    const isNumber = /^\d+$/.test(searchTerm);
    
    if (isNumber) {
      // Se tiver 7 dígitos ou menos, assumimos que é um ID. 
      // Se tiver 8 ou mais (ex: EAN-13), assumimos que é código de barras.
      if (searchTerm.length >= 8) {
        url += `&barcode=${encodeURIComponent(searchTerm)}`;
      } else {
        url += `&id=${encodeURIComponent(searchTerm)}`;
      }
    } else if (searchTerm.length >= 2) {
      url += `&description=${encodeURIComponent(searchTerm)}`;
    }
  }

  const result = await apiClient.get<PaginatedProducts>(url);

  return result.data;
};

export const getSingleProduct = async (productId: number) => {
  try {
    const result = await apiClient.get(`/products/${productId}`);

    return result.data;
  } catch (error) {
    if (isAxiosError(error) && error.response?.data.message) {
      throw new Error(error.request.data.message);
    }
    throw error;
  }
};
