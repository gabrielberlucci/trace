import { BadRequest, NotFound, UnprocessableEntity } from '@/error';
import { type Product } from '../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import type { SaleCart, ValidatedSaleCart } from '@/types';
import { loggerStorage } from '@/logger';

export const createSale = async (saleData: SaleCart) => {
  return await prisma.$transaction(async (tx) => {
    let validatedCart: ValidatedSaleCart[] = new Array();

    /**
     * !TODO: add validation if customer doesn't exists
     */

    const customer = await prisma.customer.findUnique({
      where: {
        document: saleData.document,
      },
    });

    if (!customer)
      throw new NotFound(
        `O cliente com o documento ${saleData.document} não foi encontrado`,
      );

    for (let i = 0; i < saleData.item.length; i++) {
      const currentItem = saleData.item[i];
      const requestBarcode = currentItem!.barcode;
      const requestQuantity = currentItem!.quantity;

      const product: Product[] = await tx.$queryRaw`
        SELECT * FROM "Product"
        WHERE barcode = ${requestBarcode} FOR UPDATE`;

      if (product.length === 0)
        throw new NotFound(`O produto ${requestBarcode} não foi encontrado`);

      const dbBarcode = product.at(0)?.barcode;
      const dbQuantity = product.at(0)?.currentStock;
      const dbSalePrice = product.at(0)?.salePrice;
      const dbCostPrice = product.at(0)?.costPrice;
      const dbDescription = product.at(0)?.description;
      const dbProductId = product.at(0)?.id;

      // i mean, not a good way to throw error, but....
      if (
        !dbBarcode ||
        !dbQuantity ||
        !dbSalePrice ||
        !dbCostPrice ||
        !dbDescription ||
        !dbProductId
      )
        throw new BadRequest(`Ocorreu um erro ao realizar a venda`);

      /**
       * ZOD validation for positive could handle this, making it only accepting
       * positive numbers, but yeahh, why not?
       */
      if (requestQuantity === 0)
        throw new BadRequest(
          `O produto ${requestBarcode} não pode ter a quantidade 0`,
        );

      if (dbQuantity < requestQuantity)
        throw new UnprocessableEntity(
          `O produto ${requestBarcode} está sem estoque suficiente para a operação`,
        );

      validatedCart.push({
        description: dbDescription,
        barcode: dbBarcode,
        quantity: requestQuantity,
        costPrice: dbCostPrice,
        salePrice: dbSalePrice,
        totalPrice: dbSalePrice.mul(requestQuantity),

        product: {
          connect: {
            id: dbProductId,
          },
        },

        movement: {
          create: {
            quantity: requestQuantity,
            typeMovement: 'VENDAS',
            productId: dbProductId,
          },
        },
      });

      await tx.product.update({
        where: {
          barcode: requestBarcode,
        },
        data: {
          currentStock: {
            decrement: requestQuantity,
          },
        },
      });
    }

    const sale = await tx.sale.create({
      data: {
        customerId: customer.id,

        saleItem: {
          create: validatedCart,
        },
      },

      include: {
        saleItem: true,
      },
    });

    return { sale };
  });
};
