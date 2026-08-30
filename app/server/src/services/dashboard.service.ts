import type { HighestSalesProducts } from '@/types';
import { prisma } from '../../lib/prisma';
import { Prisma } from '../../generated/prisma/client';
import { Movement } from '@app/shared';
import { Decimal } from '@prisma/client/runtime/client';

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

    const countSales = await tx.sale.count({
      where: {
        date: {
          gte: isoStartDate,
          lte: isoEndDate,
        },
      },
    });

    const totalSaleIncome = saleIncome._sum.salePrice || Decimal(0);
    const totalSales = countSales;
    const avgTicket =
      totalSales === 0 ? Decimal(0) : totalSaleIncome.div(totalSales);

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

    const totalOSIncome = osIncome._sum.totalPrice || Decimal(0);

    return { avgTicket, highestSalesProducts, totalSaleIncome, totalOSIncome };
  });

  return result;
};
