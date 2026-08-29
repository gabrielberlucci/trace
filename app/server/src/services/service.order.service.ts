import type { ServiceOrder, ServiceOrderQueryParamsFilters } from '@/types';
import { Prisma } from '../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import { BadRequest, NotFound } from '@/error';
import { getPaginatedData } from '@/repositories';

export const createServiceOrder = async (serviceOrderData: ServiceOrder) => {
  await prisma.$transaction(async (tx) => {
    const customer = await tx.customer.findUnique({
      where: {
        document: serviceOrderData.document,
      },
      select: {
        document: true,
        active: true,
        id: true,
      },
    });

    if (!customer)
      throw new NotFound(
        `O cliente com o documento: ${serviceOrderData.document} não foi encontrado`,
      );
    if (customer.active === false)
      throw new BadRequest(
        `O cliente com o documento: ${serviceOrderData.document} não está ativo`,
      );

    const company = await tx.company.findFirst();

    if (!company) throw new NotFound('Empresa não cadastrada');
    if (company.active === false)
      throw new BadRequest(
        `Empresa com o documento: ${company.document} inativa`,
      );

    const items = serviceOrderData.items;

    const updatedItems = items.map((item) => ({
      ...item,
      totalPrice: item.hourlyRate * item.hours,
    }));

    await tx.serviceOrder.create({
      data: {
        date: new Date(),
        customerId: customer.id,
        companyId: company.id,

        serviceOrderItems: {
          create: updatedItems,
        },
      },
    });
  });
};

export const getPaginatedServiceOrder = async (
  queryFilters: ServiceOrderQueryParamsFilters,
) => {
  const where: Prisma.ServiceOrderWhereInput = {
    customer: queryFilters.document
      ? { document: queryFilters.document }
      : undefined,
  };

  const include: Prisma.ServiceOrderInclude = {
    customer: {
      select: {
        document: true,
        name: true,
      },
    },
  };

  const omit: Prisma.ServiceOrderOmit = {
    customerId: true,
    companyId: true,
  };

  const result = await getPaginatedData(
    prisma,
    prisma.serviceOrder,
    where,
    queryFilters.page,
    'ServiceOrder',
    omit,
    include,
    undefined,
    undefined,
  );

  return result;
};

export const getServiceOrder = async (id: number) => {
  const result = await prisma.serviceOrder.findUnique({
    where: {
      id: id,
    },

    select: {
      id: true,
      date: true,

      serviceOrderItems: {
        omit: {
          serviceOrderId: true,
        },
      },

      company: {
        select: {
          fantasyName: true,
          address: true,
          addressNumber: true,
          neighborhood: true,
          phone: true,
          document: true,
          email: true,
          complement: true,

          city: {
            select: {
              name: true,
              state: true,
            },
          },
        },
      },

      customer: {
        select: {
          name: true,
          address: true,
          addressNumber: true,
          neighborhood: true,
          phone: true,
          document: true,
          email: true,
          complement: true,

          city: {
            select: {
              name: true,
              state: true,
            },
          },
        },
      },
    },
  });

  if (!result)
    throw new NotFound(`A ordem de serviço ${id} não foi encontrada`);

  return result;
};
