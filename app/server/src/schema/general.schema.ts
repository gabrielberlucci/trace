import * as z from 'zod';

export const defaultSchema = z.object({
  document: z
    .string()
    .trim()
    .refine((val) => val.length === 11 || val.length === 14, {
      message: 'Documento deve ter 11 (CPF) ou 14 (CNPJ) dígitos',
    }),
  typePerson: z
    .enum(['PJ', 'PF'], { error: 'Tipo de pessoa diferente de PJ ou PF' })
    .default('PJ'),
  name: z
    .string({ error: 'Nome inválido' })
    .min(3, { error: 'Nome muito curto. Use pelo menos 3 caracteres' })
    .max(50, { error: 'Nome muito longe. Use no máximo 50 caracteres' }),
  phone: z
    .string({ error: 'Telefone inválido' })
    .trim()
    .length(10, { error: 'Telefone deve conter 10 números' })
    .optional(),
  address: z
    .string({ error: 'Endereço inválido' })
    .min(5, { error: 'Endereço muito curto. Use pelo menos 5 caracteres' })
    .max(50, { error: 'Endereço muito longo. Use no máximo 50 caracteres' })
    .optional(),
  zipcode: z
    .string({ error: 'CEP inválido' })
    .trim()
    .length(8, { error: 'CEP deve conter 8 dígitos' })
    .optional(),
  addressNumber: z.int({ error: 'Número inválido' }).optional(),
  complement: z
    .string({ error: 'Complemento inválido' })
    .min(3, { error: 'Complemento muito curto. Use pelo menos 3 caracteres.' })
    .max(50, { error: 'Complemento muito longo. Use no máximo 50 caracteres' })
    .optional(),
  email: z.email({ error: 'E-mail inválido' }).trim().optional(),
  ie: z
    .string({ error: 'IE inválida' })
    .min(9, { error: 'IE muita curta. Use pelo menos 9 caracteres' })
    .max(14, { error: 'IE muito longa. Use no máximo 14 caracteres' })
    .optional(),
  active: z
    .enum(['YES', 'NO'], { error: 'Ativo informado diferente de YES ou NO' })
    .default('YES')
    .optional(),
  city: z.int({ error: 'Cidade inválida' }).optional(),
});
