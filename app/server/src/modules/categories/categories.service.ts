import type { CreateCategoryDto, UpdateCategoryDto } from '@app/shared';
import { prisma } from '../../../lib/prisma';
import { getPaginatedData } from '@/repositories';
import type { Prisma } from '../../../generated/prisma/client';

export const createCategory = async (createCategoryDto: CreateCategoryDto) => {
  await prisma.categories.create({
    data: createCategoryDto,
  });
};

export const findAllCategory = async (queryFilters: any) => {
  const where: Prisma.CategoriesWhereInput = {
    name: queryFilters.name
      ? { contains: queryFilters.name, mode: 'insensitive' }
      : undefined,
  };

  const { total, data, totalPages, hasPrevious, hasNext } =
    await getPaginatedData(
      prisma,
      prisma.categories,
      where,
      queryFilters.page,
      'Categories',
      undefined,
      undefined,
      undefined,
      undefined,
    );

  return {
    total,
    data,
    totalPages,
    hasPrevious,
    hasNext,
  };
};

export const findCategory = async (id: number) => {
  const result = await prisma.categories.findUnique({
    where: {
      id: id,
    },
  });

  return result;
};

export const updateCategory = async (
  id: number,
  updateCategoryDto: UpdateCategoryDto,
) => {
  await prisma.categories.update({
    data: updateCategoryDto,
    where: {
      id: id,
    },
  });
};
