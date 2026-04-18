import { prisma } from '../../lib/prisma';
import { Prisma } from '../../generated/prisma/client';

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
