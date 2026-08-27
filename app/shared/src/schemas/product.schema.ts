import { z } from './config';
import { Unity } from '../constants/enums';

export const productSchema = z.object({
  description: z
    .string({ error: 'Descrição inválida' })
    .trim()
    .min(1, { error: 'Descrição muito curta. Use pelo menos 1 caractere' })
    .max(100, { error: 'Descrição muito longa. Use no máximo 50 caracteres' }),

  barcode: z
    .string({ error: 'Código de barras inválido' })
    // .transform((val) => val.replace(/\s+/g, ''))
    .pipe(
      z
        .string()
        .min(5, { error: 'Insira pelo menos 5 caracteres no código de barras' })
        .max(15, {
          error: 'Insira no máximo 13 caracteres no código de barras',
        }),
    ),

  unity: z.enum(Unity, {
    error: 'Unidades de medida devem ser UN, CM, MT ou MM',
  }),

  currentStock: z.float32({ error: 'Insira um valor para o estoque' }),

  costPrice: z.float64({ error: 'Insira um preço de custo' }),

  salePrice: z.float64({ error: 'Insira um preço de venda' }),

  supplierId: z.int({ error: 'ID do fornecedor inválido' }).optional(),
});

export const modifyProductSchema = productSchema.partial();
