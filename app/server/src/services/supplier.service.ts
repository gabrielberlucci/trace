import { prisma } from '../../lib/prisma';
import { Prisma } from '../../generated/prisma/client';
import type { SupplierQueryParamsFilters } from '@/types';
import { getPaginatedData } from '@/repositories/paginated.repositorhy';

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

export const getPaginatedSuppliers = async (
  queryFilters: SupplierQueryParamsFilters,
) => {
  const where: Prisma.SupplierWhereInput = {
    ...(queryFilters.document && { document: queryFilters.document }),
    ...(queryFilters.name && {
      name: { contains: queryFilters.name, mode: 'insensitive' },
    }),
    ...(queryFilters.active && { active: Number(queryFilters.active) }),
  };

  const { total, data, totalPages, hasPrevious, hasNext } =
    await getPaginatedData(
      prisma,
      prisma.supplier,
      where,
      queryFilters.page,
      'Supplier',
    );

  return {
    total,
    data,
    totalPages,
    hasPrevious,
    hasNext,
  };
};
