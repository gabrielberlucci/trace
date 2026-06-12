import { BadRequest } from '@/error';
import {
  createPaymentMethod,
  getPaginatedPaymentMethods,
  getPaymentMethod,
  modifyPaymentMethod,
} from '@/services';
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
  const id = res.locals.params.id;

  const data = await modifyPaymentMethod(paymentData, id);

  res.status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: 'Pagamento modificado com sucesso',
    data: data,
  });
};

export const getPaginatedPaymentMethodsController = async (
  req: Request,
  res: Response,
) => {
  const query = res.locals.query;

  const { total, data, totalPages, hasPrevious, hasNext } =
    await getPaginatedPaymentMethods(query);

  res.status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: 'Métodos de pagamentos resgatados com sucesso',
    meta: {
      total: total,
      totalPages: totalPages,
      hasPrevious: hasPrevious,
      hasNext: hasNext,
    },
    data: data,
  });
};

export const getPaymentMethodController = async (
  _req: Request,
  res: Response,
) => {
  const id = res.locals.params.id;

  const data = await getPaymentMethod(id);

  res.status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: 'Pagamento resgatado com sucesso',
    data: data,
  });
};
