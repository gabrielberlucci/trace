import type { ServiceOrder } from '@/types';
import type { Prisma } from '../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import { BadRequest, NotFound } from '@/error';

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
