import { getPaginatedData } from '@/repositories/paginated.repositorhy';
import type { Prisma } from '../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import type { CompanyQueryParamsFilters } from '@/types';

export const createCompany = async (companyData: Prisma.CompanyCreateInput) => {
  const result = await prisma.company.create({
    data: companyData,
  });

  return result;
};

export const getPaginatedCompany = async (
  queryFilters: CompanyQueryParamsFilters,
) => {
  const where: Prisma.CompanyWhereInput = {
    name: queryFilters.name
      ? { contains: queryFilters.name, mode: 'insensitive' }
      : undefined,
    document: queryFilters.document,
    active: queryFilters.active,
  };

  const { total, data, totalPages, hasPrevious, hasNext } =
    await getPaginatedData(
      prisma,
      prisma.company,
      where,
      queryFilters.page,
      'Company',
      undefined,
      undefined,
      undefined,
      undefined,
    );

  return { total, data, totalPages, hasPrevious, hasNext };
};
