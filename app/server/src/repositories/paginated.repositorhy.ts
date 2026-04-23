import type { Prisma } from '../../generated/prisma/client';
import type { PrismaPromise } from '@prisma/client/runtime/client';

interface PrismaDelegate<T> {
  count: (arg0: any) => PrismaPromise<number>;
  findMany: (arg0: any) => PrismaPromise<T[]>;
}

/*
TODO: make possible to pass PAGE_SIZE as param  
*/
export const getPaginatedData = async <T>(
  tx: Prisma.TransactionClient,
  model: PrismaDelegate<T>,
  where: any,
  page: number,
) => {
  const PAGE_SIZE = 50;
  const skip = (page - 1) * PAGE_SIZE;

  const [totalGenerics, paginatedGenerics] = await tx.$transaction([
    model.count({
      where: where,
    }),
    model.findMany({
      where: where,
      skip: skip,
      take: PAGE_SIZE,
      orderBy: { id: 'asc' },
    }),
  ]);

  const totalPages = Math.ceil(totalGenerics / PAGE_SIZE);
  const hasPrevious: boolean = page > 1;
  const hasNext: boolean = page < totalPages;

  return {
    totalGenerics,
    paginatedGenerics,
    totalPages,
    hasPrevious,
    hasNext,
  };
};
