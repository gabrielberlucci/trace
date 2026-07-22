import type { Prisma } from '../../generated/prisma/client';
import { prisma } from '../../lib/prisma';

export const createCompany = async (companyData: Prisma.CompanyCreateInput) => {
  const result = await prisma.company.create({
    data: companyData,
  });

  return result;
};
