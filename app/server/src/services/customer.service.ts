import { prisma } from '../../lib/prisma';
import { Prisma } from '../../generated/prisma/client';
import { loggerStorage } from '@/logger/storage';
import type { CustomerQueryParamsFilters } from '@/types';
import { getPaginatedData } from '@/repositories/paginated.repositorhy';
import { NotFound } from '@/error';

export const createCustomer = async (
  customerData: Prisma.CustomerCreateInput,
) => {
  if (customerData.document.length === 11) {
    customerData.typePerson = 'PF';
  } else {
    customerData.typePerson = 'PJ';
  }

  const customer = await prisma.customer.create({
    data: customerData,
  });

  return customer;
};

export const modifyCustomer = async (
  customerData: Prisma.CustomerCreateInput,
  customerId: number,
) => {
  const modifiedCustomer = prisma.customer.update({
    where: {
      id: customerId,
    },
    data: customerData,
  });

  return modifiedCustomer;
};

export const getPaginatedCustomers = async (
  queryFilters: CustomerQueryParamsFilters,
) => {
  const where: Prisma.CustomerWhereInput = {
    name: queryFilters.name
      ? { contains: queryFilters.name, mode: 'insensitive' }
      : undefined,
    document: queryFilters.document,
    active: queryFilters.active,
  };

  const select: Prisma.CustomerSelect = {
    id: true,
    name: true,
    document: true,
    active: true,
  };

  const { total, data, totalPages, hasPrevious, hasNext } =
    await getPaginatedData(
      prisma,
      prisma.customer,
      where,
      queryFilters.page,
      'Customer',
      null,
      null,
      undefined,
      select,
    );

  return {
    total,
    data,
    hasPrevious,
    hasNext,
    totalPages,
  };
};

export const getCustomer = async (customerId: number) => {
  const data = await prisma.customer.findUnique({
    where: {
      id: customerId,
    },
    include: {
      city: true,
    },
  });

  if (!data)
    throw new NotFound(
      `Não foi possível encontrar o cliente com o id ${customerId}`,
    );

  return data;
};
