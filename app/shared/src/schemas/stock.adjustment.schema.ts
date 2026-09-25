import { z } from './config';
import { productSchema } from './product.schema';
import { AdjustMovement } from '../constants/enums';

export const stockAdjustmentSchema = z.object({
  date: z.iso.datetime({ error: 'Insira uma data válida' }),
  items: z.array(
    z.object({
      ...productSchema.pick({ barcode: true }).shape,
      type: z.enum(AdjustMovement, {
        error: 'Insira o tipo de movimento correto',
      }),
    }),
  ),
});
