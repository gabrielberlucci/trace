import { NotFound } from '@/error';
import type { Prisma } from '../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import { getPaginatedData } from '@/repositories/paginated.repositorhy';
import type { PaymentMethodQueryParamsFilters } from '@/types/payment.methods.pagination';

export const createPaymentMethod = async (
  paymentData: Prisma.PaymentMethodCreateInput,
) => {
  const result = await prisma.paymentMethod.create({
    data: paymentData,
  });

  return result;
};

export const modifyPaymentMethod = async (
  paymentData: Prisma.PaymentMethodUpdateInput,
  paymentId: number,
) => {
  return prisma.$transaction(async (tx) => {
    const exists = await tx.paymentMethod.findUnique({
      where: { id: paymentId },
    });

    if (!exists)
      throw new NotFound(
        `O pagamento com o id: ${paymentId} não foi encontrado`,
      );

    const modifiedPayment = await tx.paymentMethod.update({
      where: {
        id: paymentId,
      },
      data: paymentData,
    });

    return { modifiedPayment };
  });
};

export const getPaginatedPaymentMethods = async (
  queryFilters: PaymentMethodQueryParamsFilters,
) => {
  const where = {
    ...(queryFilters.active && { active: queryFilters.active }),
    ...(queryFilters.description && {
      description: { contains: queryFilters.description, mode: 'insensitive' },
    }),
    ...(queryFilters.type && { type: queryFilters.type }),
  };

  const { total, data, totalPages, hasPrevious, hasNext } =
    await getPaginatedData(
      prisma,
      prisma.paymentMethod,
      where,
      queryFilters.page,
      'PaymentMethod',
      null,
      null,
    );

  return {
    total,
    data,
    totalPages,
    hasPrevious,
    hasNext,
  };
};
