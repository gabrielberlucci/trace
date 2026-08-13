import { z } from './config';
import { PaymentType } from '../constants/enums';

export const createPaymentMethodSchema = z.object({
  description: z.string({ error: 'Insira uma descrição' }).min(1, 'Insira uma descrição'),
  active: z
    .stringbool({
      truthy: ['true'],
      falsy: ['false'],
      error: 'Insira true ou false',
    })
    .optional(),
  fee: z.float64({ error: 'Insira uma taxa' }).optional(),
  type: z.nativeEnum(PaymentType, {
    error: 'O tipo deve ser POS, TEF, PIX, CREDITO, DEBITO ou OUTRO',
  }),
});

export const modifyPaymentMethodSchema = createPaymentMethodSchema.partial();
