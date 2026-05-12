import { BadRequest, NotFound, UnprocessableEntity } from '@/error';
import { Prisma, type Product } from '../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import type {
  SaleCart,
  SaleQueryParamsFilters,
  ValidatedSaleCart,
} from '@/types';
import { loggerStorage } from '@/logger';
import { getPaginatedData } from '@/repositories/paginated.repositorhy';
import { fa } from '@faker-js/faker';

export const createSale = async (saleData: SaleCart) => {
  return await prisma.$transaction(async (tx) => {
    let validatedCart: ValidatedSaleCart[] = [];

    const customer = await tx.customer.findUnique({
      where: {
        document: saleData.document,
      },
    });

    if (!customer)
      throw new NotFound(
        `O cliente com o documento ${saleData.document} não foi encontrado`,
      );

    /**
     * blud is still using 0 and 1 for inactive and inactive 💔🥀
     * TODO: refactor using boolean for active in all tables
     */
    if (customer.active === 0)
      throw new BadRequest(`O cliente ${customer.document} está inativo`);

    /**
     * TODO: by now, it's acceptable only ONE type of payment
     * make it accept one or more type of payment
     */
    const paymentMethod = await tx.paymentMethod.findUnique({
      where: {
        id: saleData.payment,
      },
    });

    if (!paymentMethod)
      throw new NotFound(
        `O pagamento com o id ${saleData.payment} não foi encontrado`,
      );

    if (paymentMethod.active === false)
      throw new BadRequest(
        `O pagamento ${paymentMethod.description} está inativo`,
      );

    /**
     * TODO: refactor
     * i hate this chunk of code, it's ugly
     */
    for (let i = 0; i < saleData.items.length; i++) {
      const currentItem = saleData.items[i];
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
        paymentMethodId: paymentMethod.id,

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

export const getPaginatedSales = async (
  queryFilters: SaleQueryParamsFilters,
) => {
  const where: Prisma.SaleWhereInput = {
    ...(queryFilters.document && {
      customer: {
        document: queryFilters.document,
      },
    }),
  };

  const include: Prisma.SaleInclude = {
    customer: {
      select: {
        name: true,
      },
    },

    paymentMethod: {
      select: {
        description: true,
      },
    },
  };

  const result = await getPaginatedData(
    prisma,
    prisma.sale,
    where,
    queryFilters.page,
    'Sale',
    null,
    include,
  );

  return result;
};

export const getSale = async (id: number) => {
  const result = await prisma.sale.findUnique({
    where: {
      id: id,
    },

    omit: {
      id: true,
      customerId: true,
      paymentMethodId: true,
    },

    include: {
      customer: {
        select: {
          name: true,
          email: true,
        },
      },
      paymentMethod: {
        select: {
          description: true,
        },
      },
      saleItem: {
        omit: {
          costPrice: true,
        },
      },
    },
  });

  if (!result)
    throw new NotFound(`Não foi possível encontrar uma venda com o id ${id}`);

  return result;
};
