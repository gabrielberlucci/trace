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
    active: queryFilters.active,
    document: queryFilters.document,
    name: queryFilters.name
      ? {
          contains: queryFilters.name,
          mode: 'insensitive',
        }
      : undefined,
  };

  const select: Prisma.SupplierSelect = {
    id: true,
    document: true,
    typePerson: true,
    name: true,
    active: true,
  };

  const { total, data, totalPages, hasPrevious, hasNext } =
    await getPaginatedData(
      prisma,
      prisma.supplier,
      where,
      queryFilters.page,
      'Supplier',
      null,
      null,
      undefined,
      select,
    );

  return {
    total,
    data,
    totalPages,
    hasPrevious,
    hasNext,
  };
};
