import type { KardexQueryParams, KardexResult } from '@/types';
import { prisma } from '../../lib/prisma';

export const getKardex = async (query: KardexQueryParams) => {
  const PAGE_SIZE = 50;
  const skip = (query.page - 1) * PAGE_SIZE;

  const response = await prisma.$transaction(async (tx) => {
    const totalCount = await tx.stockMovement.count({
      where: {
        product: {
          barcode: query.barcode,
        },
      },
    });

    const result: KardexResult[] = await tx.$queryRaw`
  WITH kardex AS (SELECT sm.id                                                              as "movementId",
                       sm.quantity,
                       sm.date,
                       sm."typeMovement",
                       nfc."numNf",
                       nfc."serieNf",
                       s.id                                                               as "saleId",
                       p.barcode,
                       SUM(sm.quantity) OVER (PARTITION BY sm."productId" ORDER BY sm.id) as total
                FROM "StockMovement" sm
                         JOIN "Product" p ON p.id = sm."productId"
                         LEFT JOIN "NfeUploadControl" nfc ON nfc.id = sm."nfeUploadControlId"
                         LEFT JOIN "SaleItem" si ON si.id = sm."saleItemId"
                         LEFT JOIN "Sale" s ON s.id = si."saleId"
                WHERE p.barcode = ${query.barcode})
SELECT *
FROM kardex
LIMIT ${PAGE_SIZE} OFFSET ${skip};`;

    return { totalCount, result };
  });

  const total = response.totalCount;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const hasPrevious: boolean = query.page > 1;
  const hasNext: boolean = query.page < totalPages;
  const data = response.result.map((item) => item);

  return {
    total,
    data,
    totalPages,
    hasPrevious,
    hasNext,
  };
};
