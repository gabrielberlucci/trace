import { prisma } from 'lib/prisma';
import { Prisma } from '../../generated/prisma/client';
import { formatPrismaError } from '@/utils/formatPrismaError';
import { NotNull } from '@/error/NotNull';
import { UniqueConstraint } from '@/error/UniqueConstraint';
import { NotFound } from '@/error/NotFound';

export const createSupplier = async (
  supplierData: Prisma.SupplierCreateInput,
) => {
  try {
    const supplier = await prisma.supplier.create({
      data: {
        document: supplierData.document,
        typePerson: supplierData.typePerson,
        name: supplierData.name,
        phone: supplierData.phone,
        address: supplierData.address,
        zipcode: supplierData.zipcode,
        addressNumber: supplierData.addressNumber,
        complement: supplierData.complement,
        email: supplierData.email,
        ie: supplierData.ie,
        city: supplierData.city,
      },
    });

    return supplier;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2011') {
        throw new NotNull(
          `O campo ${formatPrismaError(error)} não pode ser nulo`,
        );
      }

      if (error.code === 'P2002') {
        throw new UniqueConstraint(
          `O fornecedor com o ${formatPrismaError(error)} já existe`,
        );
      }
    }

    throw error;
  }
};

export const modifySupplier = async (
  supplierId: number,
  supplierData: Prisma.SupplierUpdateInput,
) => {
  try {
    const modifiedSupplier = await prisma.supplier.update({
      where: {
        id: supplierId,
      },

      data: {
        typePerson: supplierData.typePerson,
        name: supplierData.name,
        phone: supplierData.phone,
        address: supplierData.address,
        zipcode: supplierData.zipcode,
        addressNumber: supplierData.addressNumber,
        complement: supplierData.complement,
        email: supplierData.email,
        ie: supplierData.ie,
        city: supplierData.city,
        active: supplierData.active,
      },
    });

    return modifiedSupplier;
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        throw new NotFound(
          `O fornecedor com o id ${supplierId} não foi encontrado`,
        );
      }
    }

    throw error;
  }
};
