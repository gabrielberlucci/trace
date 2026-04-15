import { prisma } from 'lib/prisma';
import { Prisma } from '../../generated/prisma/client';

export const createSupplier = async (
  supplierData: Prisma.SupplierCreateInput,
) => {
  const supplier = await prisma.supplier.create({
    data: supplierData,
  });

  return supplier;
};

export const modifySupplier = async (
  supplierId: number,
  supplierData: Prisma.SupplierUpdateInput,
) => {
  const modifiedSupplier = await prisma.supplier.update({
    where: {
      id: supplierId,
    },
    data: supplierData,
  });

  return modifiedSupplier;
};

export const inactiveSupplier = async (supplierId: number) => {
  const inactiveSupplier = await prisma.supplier.update({
    where: {
      id: supplierId,
    },
    data: {
      active: 'NO',
    },
  });

  return inactiveSupplier;
};
