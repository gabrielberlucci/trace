import { z } from './config/index';

export const reqParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
