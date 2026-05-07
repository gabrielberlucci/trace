import { createSale, getPaginatedSales } from '@/services';
import type { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const createSaleController = async (req: Request, res: Response) => {
  const values = req.body;

  const data = await createSale(values);

  res.status(StatusCodes.CREATED).send({
    status: ReasonPhrases.CREATED,
    message: 'Venda realizada com sucesso',
    data: data,
  });
};

export const getSalesController = async (req: Request, res: Response) => {
  const query = res.locals.query;

  const { total, data, totalPages, hasPrevious, hasNext } =
    await getPaginatedSales(query);

  res.status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: 'Vendas resgatadas com sucesso',
    meta: {
      totalSales: total,
      hasPrevious: hasPrevious,
      hasNext: hasNext,
      totalPages: totalPages,
    },
    data: data,
  });
};
