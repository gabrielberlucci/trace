import { prisma } from '../../lib/prisma';
import { Prisma } from '../../generated/prisma/client';
import { loggerStorage } from '@/logger/storage';
import type { CustomerQueryParamsFilters } from '@/types';
import { getPaginatedData } from '@/repositories/paginated.repositorhy';

export const createCustomer = async (
  customerData: Prisma.CustomerCreateInput,
) => {
  /*
  TODO: make this a function
  */
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
    ...(queryFilters.active && { active: Number(queryFilters.active) }),
    ...(queryFilters.name && {
      name: { contains: queryFilters.name, mode: 'insensitive' },
    }),
    ...(queryFilters.document && { document: queryFilters.document }),
  };

  const { total, data, totalPages, hasPrevious, hasNext } =
    await getPaginatedData(
      prisma,
      prisma.customer,
      where,
      queryFilters.page,
      'Customer',
    );

  return {
    total,
    data,
    hasPrevious,
    hasNext,
    totalPages,
  };
};
