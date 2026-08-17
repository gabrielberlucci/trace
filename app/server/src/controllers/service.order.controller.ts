import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import type { Request, Response } from 'express';
import { createServiceOrder } from '@/services';

export const createServiceOrderController = async (
  req: Request,
  res: Response,
) => {
  const serviceOrderData = req.body;

  await createServiceOrder(serviceOrderData);

  res.status(StatusCodes.CREATED).send({
    status: ReasonPhrases.CREATED,
    message: 'Ordem de serviço criado com sucesso',
  });
};
