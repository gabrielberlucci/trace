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
  /*
  TODO: refactor this queryOptions, because is only passed to the generic function the where 
  */
  const queryOptions: Prisma.CustomerFindManyArgs = {
    where: {},
  };

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

  const {
    totalGenerics: totalCustomers,
    paginatedGenerics: paginatedCustomers,
    totalPages,
    hasPrevious,
    hasNext,
  } = await getPaginatedData(
    prisma,
    prisma.customer,
    queryOptions.where,
    queryFilters.page,
  );

  return {
    totalCustomers,
    paginatedCustomers,
    hasPrevious,
    hasNext,
    totalPages,
  };
};
