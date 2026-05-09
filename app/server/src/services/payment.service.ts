import type { Prisma } from '../../generated/prisma/client';
import { prisma } from '../../lib/prisma';

export const createPaymentMethod = async (
  paymentData: Prisma.PaymentMethodCreateInput,
) => {
  const result = await prisma.paymentMethod.create({
    data: paymentData,
  });

  return result;
};
