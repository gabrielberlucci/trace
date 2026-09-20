import type { KardexQueryParams, KardexResult } from '@/types';
import { prisma } from '../../lib/prisma';

export const getKardex = async (query: KardexQueryParams) => {
  const PAGE_SIZE = 50;
  const skip = (Math.max(query.page || 1, 1) - 1) * PAGE_SIZE;
  const currentPage = Math.max(Number(query.page) || 1, 1);

  const [totalCount, result] = await Promise.all([
    prisma.stockMovement.count({
      where: { product: { barcode: query.barcode } },
    }),
    prisma.$queryRaw<
      KardexResult[]
    >`WITH kardex AS (SELECT sm.id                                                              as "movementId",
                       sm.quantity,
                       sm.date,
                       sm."typeMovement",
                       nfc."numNf",
                       nfc."serieNf",
                       s.id                                                               as "saleId",
                       p.barcode,
                       SUM(sm.quantity) OVER (PARTITION BY sm."productId" ORDER BY sm.date, sm.id ASC) as total
                FROM "StockMovement" sm
                         JOIN "Product" p ON p.id = sm."productId"
                         LEFT JOIN "NfeUploadControl" nfc ON nfc.id = sm."nfeUploadControlId"
                         LEFT JOIN "SaleItem" si ON si.id = sm."saleItemId"
                         LEFT JOIN "Sale" s ON s.id = si."saleId"
                WHERE p.barcode = ${query.barcode})
SELECT *
FROM kardex
LIMIT ${PAGE_SIZE} OFFSET ${skip};`,
  ]);

  const total = totalCount;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const hasPrevious: boolean = currentPage > 1;
  const hasNext: boolean = currentPage < totalPages;
  const data = result;

  return {
    total,
    data,
    totalPages,
    hasPrevious,
    hasNext,
  };
};
