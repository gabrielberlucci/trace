import { omit } from 'zod/mini';
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
  searchTable: Prisma.ModelName,
  omit?: any,
) => {
  const PAGE_SIZE = 50;
  const skip = (page - 1) * PAGE_SIZE;
  let total: number;
  let data;

  if (!where || Object.keys(where).length === 0) {
    const [fastTotal, generics] = await tx.$transaction([
      tx.totalCount.findUnique({
        where: { tableName: searchTable },
      }),

      model.findMany({
        where: where,
        skip: skip,
        take: PAGE_SIZE,
        orderBy: { id: 'asc' },
        omit: omit,
      }),
    ]);

    total = fastTotal?.total || 0;
    data = generics;
  } else {
    const [slowTotal, filteredGenerics] = await tx.$transaction([
      model.count({
        where: where,
      }),
      model.findMany({
        where: where,
        skip: skip,
        take: PAGE_SIZE,
        orderBy: { id: 'asc' },
        omit: omit,
      }),
    ]);

    total = slowTotal;
    data = filteredGenerics;
  }

  const totalPages = Math.ceil(total / PAGE_SIZE);
  const hasPrevious: boolean = page > 1;
  const hasNext: boolean = page < totalPages;

  return {
    total,
    data,
    totalPages,
    hasPrevious,
    hasNext,
  };
};
