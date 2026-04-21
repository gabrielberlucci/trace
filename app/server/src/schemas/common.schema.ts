import { z } from '@/config/zod.config';
import { validateCnpj, validateCpf } from '@/utils';

/*
 * Initial common schema
 */
export const commonSchema = z.object({
  document: z
    .string({ error: 'Insira um documento' })
    .trim()
    .transform((val) => val.replace(/\s+/g, ''))
    .refine((val) => val.length === 11 || val.length === 14, {
      error: 'O documento deve ter 11 ou 14 caracteres',
      abort: true,
    })
    .refine(
      (val) => (val.length === 1 ? validateCpf(val) : validateCnpj(val)),
      { error: 'Documento inválido' },
    ),

  typePerson: z
    .enum(['PJ', 'PF'], { error: 'O tipo de pessoa deve ser PJ ou PF' })
    .transform((val) => val.replace(/\s+/g, ''))
    .default('PJ'),

  name: z
    .string({ error: 'Insira um nome' })
    .trim()
    .min(2, { error: 'Nome muito curto. Insira pelo menos 3 caracteres' })
    .max(50, { error: 'Nome muito longo. Insira no máximo 50 caracteres' }),

  phone: z
    .string({ error: 'Insira um telefone' })
    .trim()
    .transform((val) => val.replace(/\s+/g, ''))
    .refine((val) => val.length === 11 || val.length === 10, {
      error: 'O telefone deve ter 11 ou 10 números (incluso o DDD)',
    })
    .optional(),

  address: z
    .string({ error: 'Insira um endereço' })
    .trim()
    .min(3, { error: 'Endereço muito curto. Insira pelo menos 3 caracteres' })
    .max(50, { error: 'Endereço muito longo. Insira no máximo 50 caracteres' })
    .optional(),

  zipcode: z
    .string()
    .trim()
    .length(8, { error: 'O CEP deve ter 8 caracteres' })
    .transform((val) => val.replace(/\s+/g, ''))
    .optional(),

  addressNumber: z.int({ error: 'Insira um número' }).optional(),

  complement: z
    .string()
    .trim()
    .min(3, {
      error: 'Complemento muito curto. Insira pelo menos 3 caracteres',
    })
    .max(50, {
      error: 'Complemento muito longo. Insira no máximo 50 caracteres',
    })
    .optional(),

  email: z.email({ error: 'E-mail inválido' }).optional(),

  ie: z
    .string({ error: 'Insira uma IE' })
    .trim()
    .min(8, {
      error: 'IE muito curto. Insira pelo menos 8 caracteres',
    })
    .max(14, {
      error: 'IE muito longo. Insira no máximo 14 caracteres',
    })
    .transform((val) => val.replace(/\s+/g, ''))
    .optional(),

  active: z
    .union([z.literal(0), z.literal(1)], {
      error: 'Ativo deve ser 0 ou 1',
    })
    .optional(),

  cityId: z.int({ error: 'Insira uma cidade' }).optional(),
});
