import { prisma } from '../../lib/prisma';
import { Prisma } from '../../generated/prisma/client';

export const createProduct = async (productData: Prisma.ProductCreateInput) => {
  const product = await prisma.product.create({ data: productData });

  return product;
};
