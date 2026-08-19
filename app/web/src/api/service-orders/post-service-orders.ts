import { apiClient } from '../api.client';
import type { z } from 'zod';
import { serviceOrderSchema } from '@app/shared';

type CreateServiceOrderPayload = z.infer<typeof serviceOrderSchema>;

export const createServiceOrder = async (
  data: CreateServiceOrderPayload,
): Promise<{ status: string; message: string }> => {
  const result = await apiClient.post('/service-orders', data);
  return result.data;
};
