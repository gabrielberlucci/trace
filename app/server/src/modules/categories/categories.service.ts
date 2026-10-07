import type { CreateCategoryDto, UpdateCategoryDto } from '@app/shared';
import { prisma } from '../../../lib/prisma';
import { getPaginatedData } from '@/repositories';
import type { Prisma } from '../../../generated/prisma/client';

export const createCategory = async (
  createCategoryDto: CreateCategoryDto,
  createdById: number,
) => {
  await prisma.category.create({
    data: {
      name: createCategoryDto.name,
      createdById: createdById,
    },
  });
};

export const findAllCategory = async (queryFilters: any) => {
  const where: Prisma.CategoryWhereInput = {
    name: queryFilters.name
      ? { contains: queryFilters.name, mode: 'insensitive' }
      : undefined,
  };

  const { total, data, totalPages, hasPrevious, hasNext } =
    await getPaginatedData(
      prisma,
      prisma.category,
      where,
      queryFilters.page,
      'Category',
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
  const result = await prisma.category.findUnique({
    where: {
      id: id,
    },
  });

  return result;
};

export const updateCategory = async (
  id: number,
  updateCategoryDto: UpdateCategoryDto,
  updatedById: number,
) => {
  await prisma.category.update({
    data: {
      name: updateCategoryDto.name,
      updatedById: updatedById,
    },
    where: {
      id: id,
    },
  });
};
