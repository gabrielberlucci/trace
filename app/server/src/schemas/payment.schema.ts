import { z } from '@/config/zod.config';
import { PaymentType } from '../../generated/prisma/client';

export const createPaymentMethodSchema = z.object({
  description: z.string(),
  active: z.boolean(),
  fee: z.float64(),
  type: z.enum(PaymentType),
});
