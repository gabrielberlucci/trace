import { createStockAdjustment } from '@/services';
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
