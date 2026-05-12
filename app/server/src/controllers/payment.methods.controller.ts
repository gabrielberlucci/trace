import { BadRequest } from '@/error';
import { createPaymentMethod, modifyPaymentMethod } from '@/services';
import type { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const createPaymentMethodController = async (
  req: Request,
  res: Response,
) => {
  const paymentData = req.body;

  const data = await createPaymentMethod(paymentData);

  res.status(StatusCodes.CREATED).send({
    status: ReasonPhrases.CREATED,
    message: 'Pagamento criado com sucesso',
    data: data,
  });
};

export const modifyPaymentMethodController = async (
  req: Request,
  res: Response,
) => {
  const paymentData = req.body;
  const id = Number(req.params['id']);

  if (Number.isNaN(id)) throw new BadRequest('Id inválido');

  const data = await modifyPaymentMethod(paymentData, id);

  res.status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: 'Pagamento modificado com sucesso',
    data: data,
  });
};

export const getPaymentMethodController = async (
  req: Request,
  res: Response,
) => {};
