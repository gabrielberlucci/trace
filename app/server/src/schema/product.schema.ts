import { z } from '../config/zod.config';

export const productSchema = z.object({
  description: z
    .string({ error: 'Descrição inválida' })
    .trim()
    .min(1, { error: 'Descrição muito curta. Use pelo menos 1 caractere' })
    .max(50, { error: 'Descrição muito longa. Use no máximo 50 caracteres' }),
  barcode: z
    .string({ error: 'Código de barras inválido' })
    .superRefine((val, ctx) => {
      if (val.length < 8) {
        ctx.addIssue({
          code: 'too_small',
          minimum: 8,
          origin: 'string',
          inclusive: true,
          message: 'Insira pelo menos 8 caracteres no código de barras',
          input: val,
        });
      }
      if (val.length > 13) {
        ctx.addIssue({
          code: 'too_big',
          maximum: 3,
          origin: 'string',
          inclusive: true,
          message: 'Insira no máximo 13 caracteres no código de barras',
          input: val,
        });
      }
    }),
  unity: z.enum(['UN', 'CM', 'MT', 'MM'], {
    error: 'Unidades de medida devem ser UN, CM, MT ou MM',
  }),
  currentStock: z.float32({ error: 'Insira um valor para o estoque' }),
  costPrice: z.float64({ error: 'Insira um preço de custo' }),
  salePrice: z.float64({ error: 'Insira um preço de venda' }),
  supplierId: z.int({ error: 'ID do fornecedor inválido' }).optional(),
});
