import { z } from '@/config/zod.config';

export const queryFilterSchema = z.object({
  page: z.coerce
    .number({ error: 'Insira uma página' })
    .positive({ error: 'Insira um número positivo' })
    .default(1),

  active: z
    .enum(['0', '1'], {
      error: 'Ativo deve ser 0 ou 1',
    })
    .optional(),

  name: z
    .string({ error: 'Insira um nome' })
    .trim()
    .min(2, { error: 'Nome muito curto. Insira pelo menos 3 caracteres' })
    .max(50, { error: 'Nome muito longo. Insira no máximo 50 caracteres' })
    .optional(),

  document: z
    .string({ error: 'Insira um documento' })
    .trim()
    .transform((val) => val.replace(/\s+/g, ''))
    .transform((val) => val.replace(/\D/g, ''))
    .refine((val) => val.length === 11 || val.length === 14, {
      error: 'O documento deve ter 11 ou 14 caracteres',
      abort: true,
    })
    .optional(),
});
