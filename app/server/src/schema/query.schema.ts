import { z } from '../config/zod.config';

enum Status {
  Active = '1',
  Inactive = '0',
}

const first = z.transform((val) => {
  if (Array.isArray(val)) return val[0];
  return val;
});

const emptyStringToUndefined = z.transform((val) => {
  if (val === '') return undefined;
  return val;
});

export const querySchema = z.object({
  page: z
    .unknown()
    .pipe(first)
    .pipe(emptyStringToUndefined)
    .pipe(z.coerce.number().int().positive().default(1)),

  name: z
    .unknown()
    .pipe(first)
    .pipe(emptyStringToUndefined)
    .pipe(z.coerce.string().optional()),

  document: z
    .unknown()
    .pipe(first)
    .pipe(emptyStringToUndefined)
    .pipe(
      z
        .string()
        .min(11, { error: 'Documento muito curto' })
        .max(14, { error: 'Documento muito longo' })
        .optional(),
    ),

  active: z
    .enum(['0', '1'], { error: 'Por favor informar ativo = 1 ou ativo = 0' })
    .optional(),
});
