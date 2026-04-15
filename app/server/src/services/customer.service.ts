import { prisma } from 'lib/prisma';
import { Prisma } from '../../generated/prisma/client';

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

export const inactiveCustomer = async (customerId: number) => {
  const inactiveCustomer = await prisma.customer.update({
    where: {
      id: customerId,
    },
    data: {
      active: 'NO',
    },
  });

  return inactiveCustomer;
};

export const activeCustomer = async (customerId: number) => {
  const activeCustomer = await prisma.customer.update({
    where: {
      id: customerId,
    },
    data: {
      active: 'YES',
    },
  });

  return activeCustomer;
};
