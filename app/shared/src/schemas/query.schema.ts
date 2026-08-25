import { z } from './config';

export const queryFilterSchema = z.object({
  page: z.coerce
    .number({ error: 'Insira uma página' })
    .positive({ error: 'Insira um número positivo' })
    .default(1),

  active: z
    .stringbool({
      truthy: ['true'],
      falsy: ['false'],
      error: 'Insira true ou false',
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

  description: z
    .string({ error: 'Insira uma descrição' })
    .min(2, {
      error: 'Descriçao muito curta. Insira pelo menos 3 caracteres',
    })
    .max(50, {
      error: 'Descriçao muito longa. Insira no máximo 50 caracteres',
    })
    .optional(),

  barcode: z.string({ error: 'Insira um código de barras' }).trim().optional(),

  state: z
    .string({ error: 'Insira um estado' })
    .length(2, { error: 'Informe a sigla corretamente' })
    .optional(),

  city: z
    .string({ error: 'Insira uma cidade' })
    .min(3, {
      error: 'Nome da cidade muito curta. Insira pelo menos 3 caracteres',
    })
    .max(32, {
      error: 'Nome da cidade muito longa. Insira no máximo 32 caracteres',
    })
    .optional(),

  nfeKey: z
    .string({ error: 'Insira uma chave NFe' })
    .length(44, { error: 'Chave da NFe deve conter 44 dígitos' })
    .trim()
    .optional(),

  numnf: z
    .string({ error: 'Insira o número da NFe' })
    .min(1, { error: 'Insira uma numeração' })
    .max(9, { error: 'Numeração máxima deve conter 9 digitos' })
    .optional(),
});
