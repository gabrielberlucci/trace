import { prisma } from '../../lib/prisma';
import { Prisma } from '../../generated/prisma/client';
import { getPaginatedData } from '@/repositories/paginated.repositorhy';
import type { ProductQueryParamsFilters } from '@/types';

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
    ...(queryFilters.barcode && { barcode: queryFilters.barcode }),
    ...(queryFilters.description && {
      description: { contains: queryFilters.description, mode: 'insensitive' },
    }),
  };

  const {
    totalGenerics: totalProducts,
    paginatedGenerics: paginatedProducts,
    totalPages,
    hasPrevious,
    hasNext,
  } = await getPaginatedData(prisma, prisma.product, where, queryFilters.page);

  return {
    totalProducts,
    paginatedProducts,
    totalPages,
    hasPrevious,
    hasNext,
  };
};
