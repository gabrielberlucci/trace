import type { HighestSalesProducts } from '@/types';
import { prisma } from '../../lib/prisma';
import { Prisma } from '../../generated/prisma/client';
import { Movement } from '@app/shared';

const MAX_SALES = 5;
const CRITICAL_STOCK = 10;

export const dashboardService = async (startDate: string, endDate: string) => {
  const finalDate = new Date(endDate);
  finalDate.setUTCHours(23, 59, 59, 999);

  const isoStartDate = new Date(startDate);
  const isoEndDate = finalDate;

  const result = await prisma.$transaction(async (tx) => {
    const saleIncome = await tx.saleItem.aggregate({
      _sum: {
        salePrice: true,
      },
      where: {
        date: {
          gte: isoStartDate,
          lte: isoEndDate,
        },
      },
    });

    if (saleIncome._sum.salePrice === null) return 1;

    const countSales = await prisma.sale.count({
      where: {
        date: {
          gte: isoStartDate,
          lte: isoEndDate,
        },
      },
    });

    const totalSaleIncome = saleIncome._sum.salePrice || 1;
    const totalSales = countSales || 1;
    const avgTicket = totalSaleIncome.div(totalSales);

    const highestSalesProducts: HighestSalesProducts[] = await tx.$queryRaw`
      SELECT p.barcode,
       p.description,
       p."currentStock",
       SUM(sm.quantity) as sales
      FROM "StockMovement" sm
              INNER JOIN "Product" p ON p.id = sm."productId"
      WHERE sm."typeMovement" = ${Movement.VENDAS}
        AND p."currentStock" < ${CRITICAL_STOCK}
        AND sm.date BETWEEN ${isoStartDate} AND ${isoEndDate}
      GROUP BY p.id
      ORDER BY sales DESC
      LIMIT ${MAX_SALES};`;

    const osIncome = await tx.serviceOrderItem.aggregate({
      _sum: {
        totalPrice: true,
      },
      where: {
        date: {
          gte: isoStartDate,
          lte: isoEndDate,
        },
      },
    });

    const totalOSIncome = osIncome._sum.totalPrice || 1;

    return { avgTicket, highestSalesProducts, totalSaleIncome, totalOSIncome };
  });

  return result;
};
