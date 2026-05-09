import { createPaymentMethod } from '@/services';
import type { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const paymentCreateController = async (req: Request, res: Response) => {
  const paymentData = req.body;

  const data = await createPaymentMethod(paymentData);

  res.status(StatusCodes.CREATED).send({
    status: ReasonPhrases.CREATED,
    message: 'Pagamento criado com sucesso',
    data: data,
  });
};
