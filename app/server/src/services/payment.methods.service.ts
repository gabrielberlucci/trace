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
  const where: Prisma.PaymentMethodWhereInput = {
    active: queryFilters.active,
    description: queryFilters.description
      ? { contains: queryFilters.description, mode: 'insensitive' }
      : undefined,
    type: queryFilters.type,
  };

  const select: Prisma.PaymentMethodSelect = {
    id: true,
    description: true,
    type: true,
    active: true,
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
      undefined,
      select,
    );

  return {
    total,
    data,
    totalPages,
    hasPrevious,
    hasNext,
  };
};

export const getPaymentMethod = async (paymentId: number) => {
  const result = await prisma.paymentMethod.findUnique({
    where: {
      id: paymentId,
    },
  });

  if (!result)
    throw new NotFound(`Pagamento com o ID ${paymentId} não foi encontrado`);

  return result;
};
