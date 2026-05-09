import { z } from '@/config/zod.config';
import { productSchema } from './product.schema';
import { commonSchema } from './common.schema';

export const saleCartSchema = z.object({
  document: commonSchema.shape.document,
  payment: z.number({ error: 'Insira um id de pagamento' }),
  items: z.array(
    z.object({
      ...productSchema.pick({ barcode: true }).shape,
      quantity: z
        .number()
        .check(z.gte(1, { error: 'Insira uma quantidade acima de zero' })),
    }),
  ),
});
