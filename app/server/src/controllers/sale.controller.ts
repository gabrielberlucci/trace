import { createSale } from '@/services';
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
