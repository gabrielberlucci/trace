import { prisma } from '../../lib/prisma';
import { Prisma } from '../../generated/prisma/client';
import { loggerStorage } from '@/logger/storage';
import type { QueryProductParams } from '@/types/';

export const createCustomer = async (
  customerData: Prisma.CustomerCreateInput,
) => {
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
  queryFilters: QueryProductParams,
) => {
  const PAGE_SIZE = 50;

  const queryOptions: Prisma.CustomerFindManyArgs = {
    take: PAGE_SIZE,
    where: {},
    orderBy: {
      id: 'asc',
    },
  };

  if (queryFilters.page) {
    queryOptions.skip = (queryFilters.page - 1) * PAGE_SIZE;
  }

  if (queryFilters.active) {
    queryOptions.where = {
      ...queryOptions.where,
      active: Number(queryFilters.active),
    };
  }

  if (queryFilters.name) {
    queryOptions.where = {
      ...queryOptions.where,
      name: { contains: queryFilters.name, mode: 'insensitive' },
    };
  }

  if (queryFilters.document) {
    queryOptions.where = {
      ...queryOptions.where,
      document: queryFilters.document,
    };
  }

  const [totalCustomers, paginatedCustomers] = await prisma.$transaction([
    prisma.customer.count({
      where: queryOptions.where,
    }),
    prisma.customer.findMany(queryOptions),
  ]);

  const totalPages = Math.ceil(totalCustomers / PAGE_SIZE);

  const hasPrevious: boolean = queryFilters.page !== 1;
  const hasNext: boolean = queryFilters.page < totalPages;

  return {
    totalCustomers,
    paginatedCustomers,
    hasPrevious,
    hasNext,
    totalPages,
  };
};
