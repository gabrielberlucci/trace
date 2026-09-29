import { createStockAdjustment, getPaginatedStockAdjustment } from '@/services';
import type { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const createStockAdjustmentController = async (
  req: Request,
  res: Response,
) => {
  const data = req.body;

  await createStockAdjustment(data);

  res.status(StatusCodes.CREATED).send({
    status: ReasonPhrases.CREATED,
    message: 'Ajuste de estoque realizado com sucesso',
  });
};

export const getPaginatedStockAdjustmentController = async (
  _req: Request,
  res: Response,
) => {
  const query = res.locals.query;

  const { total, data, totalPages, hasPrevious, hasNext } =
    await getPaginatedStockAdjustment(query);

  res.status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: 'Ajuste de estoque resgatadas com sucesso',
    meta: {
      totalSales: total,
      hasPrevious: hasPrevious,
      hasNext: hasNext,
      totalPages: totalPages,
    },
    data: data,
  });
};
