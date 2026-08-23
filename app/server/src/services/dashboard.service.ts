import { prisma } from '../../lib/prisma';

export const getAverageTicket = async (startDate: string, endDate: string) => {
  const finalDate = new Date(endDate);
  finalDate.setUTCHours(23, 59, 59, 999);

  const result = await prisma.$transaction(async (tx) => {
    const totalSalesIncome = await tx.saleItem.aggregate({
      _sum: {
        salePrice: true,
      },
      where: {
        date: {
          gte: new Date(startDate).toISOString(),
          lte: finalDate,
        },
      },
    });

    if (totalSalesIncome._sum.salePrice === null) return 1;

    const countSales = await prisma.sale.count({
      where: {
        date: {
          gte: new Date(startDate).toISOString(),
          lte: finalDate,
        },
      },
    });

    const income = totalSalesIncome._sum.salePrice || 1;
    const totalSales = countSales || 1;

    return income.div(totalSales);
  });

  return result;
};
