import { prisma } from 'lib/prisma';
import { Prisma } from '../../generated/prisma/client';
import { UniqueConstraint } from '@/error/UniqueConstraint';

export const createCustomer = async (
  customerData: Prisma.CustomerCreateInput,
) => {
  try {
    const customer = await prisma.customer.create({
      data: customerData,
    });

    return customer;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        const jsonError = JSON.parse(JSON.stringify(error.meta));
        const errorMessage = jsonError.driverAdapterError.cause.originalMessage;
        const match = errorMessage?.match(/\"(.*?)\"/);
        const finalMessage = match[1].match(/\_(.*?)\_/);

        throw new UniqueConstraint(
          `O usuário com o ${finalMessage[1]} já existe`,
        );
      }
    }

    throw error;
  }
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
