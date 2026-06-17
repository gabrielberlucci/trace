import { z } from '@/config/zod.config';

export const reqParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
