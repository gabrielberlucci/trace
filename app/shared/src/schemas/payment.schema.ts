import { z } from '@/config/zod.config';
import { PaymentType } from '../../generated/prisma/client';

export const createPaymentMethodSchema = z.object({
  description: z.string({ error: 'Insira uma descrição' }),
  active: z
    .stringbool({
      truthy: ['true'],
      falsy: ['false'],
      error: 'Insira true ou false',
    })
    .optional(),
  fee: z.float64({ error: 'Insira uma taxa' }).optional(),
  type: z.enum(PaymentType, {
    error: 'O tipo deve ser POS, TEF, PIX, CREDITO, DEBITO ou OUTRO',
  }),
});

export const modifyPaymentMethodSchema = createPaymentMethodSchema.partial();
