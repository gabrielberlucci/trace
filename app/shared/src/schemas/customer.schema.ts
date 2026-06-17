import { commonSchema } from '@/schemas/common.schema';
import { z } from '@/config/zod.config';

export const createCustomerSchema = commonSchema.extend({
  birthdate: z.coerce
    .date({
      error: (issue) =>
        issue.input === undefined ? 'Insira uma data' : 'Data inválida',
    })
    .min(new Date('1900-01-01'), { error: 'Cliente muito velho' })
    .max(new Date(), { error: 'Cliente muito novo' })
    .optional(),
});
/*
 * we don't want that the user can modify CPF/CNPJ
 * it can cause problems
 */
export const modifyCustomerSchema = createCustomerSchema
  .partial()
  .omit({ document: true });
