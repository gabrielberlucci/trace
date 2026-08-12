import { prisma } from '../../lib/prisma';
import { Prisma } from '../../generated/prisma/client';
import { getPaginatedData } from '@/repositories';
import type { ProductQueryParamsFilters } from '@/types';
import { NotFound } from '@/error';

export const createProduct = async (productData: Prisma.ProductCreateInput) => {
  const product = await prisma.product.create({ data: productData });

  return product;
};

export const modifyProduct = async (
  productId: number,
  productData: Prisma.ProductUpdateInput,
) => {
  const modifiedProduct = await prisma.product.update({
    where: {
      id: productId,
    },

    data: productData,
  });

  return modifiedProduct;
};

export const getPaginatedProducts = async (
  queryFilters: ProductQueryParamsFilters,
) => {
  const where: Prisma.ProductWhereInput = {
    barcode: queryFilters.barcode,
    description: queryFilters.description
      ? { contains: queryFilters.description, mode: 'insensitive' }
      : undefined,
  };

  const select: Prisma.ProductSelect = {
    id: true,
    description: true,
    barcode: true,
    currentStock: true,
    unity: true,
    salePrice: true,
  };

  const { total, data, totalPages, hasPrevious, hasNext } =
    await getPaginatedData(
      prisma,
      prisma.product,
      where,
      queryFilters.page,
      'Product',
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

export const getProduct = async (productId: number) => {
  const result = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!result)
    throw new NotFound(`O produto com o ID ${productId} não foi encontrado`);

  return result;
};
