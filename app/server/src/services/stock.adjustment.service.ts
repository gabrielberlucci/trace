import type {
  Product,
  StockAdjustmentData,
  StockAdjustmentQueryParamsFilters,
  ValidatedStockAdjustmentData,
} from '@/types';
import { prisma } from '../../lib/prisma';
import { BadRequest } from '@/error';
import { Prisma } from '../../generated/prisma/client';
import { Movement } from '@app/shared';
import { getPaginatedData } from '@/repositories';

export const createStockAdjustment = async (data: StockAdjustmentData) => {
  const products = data.items.map((p) => p.barcode);
  let validatedProducts: ValidatedStockAdjustmentData[] = [];

  await prisma.$transaction(async (tx) => {
    const lockedProducts: Product[] = await tx.$queryRaw`
      SELECT id, barcode, "currentStock" FROM "Product"
      WHERE barcode IN (${Prisma.join(products)})
      FOR UPDATE;`;

    if (lockedProducts.length === 0)
      throw new BadRequest('Produtos não encontrados');

    if (lockedProducts.length !== products.length) {
      const foundBarcodes = new Set(lockedProducts.map((p) => p.barcode));
      const missing = products.filter((item) => !foundBarcodes.has(item));

      throw new BadRequest(
        'Produtos nao encontrados',
        undefined,
        undefined,
        missing,
      );
    }

    const productIdByBarcode = new Map(
      lockedProducts.map((p) => [p.barcode, p.id]),
    );

    validatedProducts = data.items.map((item) => ({
      barcode: item.barcode,
      quantity: item.quantity,
      type: item.type,
    }));

    /**
     * keep in mind that if this grow as too much products, probably it will need
     * refactor
     */
    for (const prd of validatedProducts) {
      const isIntake = prd.type === Movement.AJUSTE_ENTRADA;

      const productId = productIdByBarcode.get(prd.barcode);

      if (productId === undefined) {
        throw new BadRequest(`Produto não encontrado: ${prd.barcode}`);
      }

      await tx.product.update({
        where: {
          barcode: prd.barcode,
        },
        data: {
          currentStock: {
            [isIntake ? 'increment' : 'decrement']: prd.quantity,
          },
        },
      });

      await tx.stockMovement.create({
        data: {
          productId: productId,
          quantity: isIntake ? prd.quantity : prd.quantity * -1,
          typeMovement: isIntake
            ? Movement.AJUSTE_ENTRADA
            : Movement.AJUSTE_SAIDA,
        },
      });
    }
  });
};

export const getPaginatedStockAdjustment = async (
  queryFilters: StockAdjustmentQueryParamsFilters,
) => {
  const where: Prisma.StockMovementWhereInput = {
    product: {
      barcode: queryFilters.barcode,
    },
    typeMovement: {
      in: [Movement.AJUSTE_ENTRADA, Movement.AJUSTE_SAIDA],
    },
  };

  const result = await getPaginatedData(
    prisma,
    prisma.stockMovement,
    where,
    queryFilters.page,
    'StockMovement',
    undefined,
    { product: true },
    undefined,
    undefined,
  );

  return result;
};
