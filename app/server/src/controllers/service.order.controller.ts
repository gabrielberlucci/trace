import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import type { Request, Response } from 'express';
import {
  createServiceOrder,
  getPaginatedServiceOrder,
  getServiceOrder,
} from '@/services';

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

export const getPaginatedServiceOrderController = async (
  req: Request,
  res: Response,
) => {
  const query = res.locals.query;

  const { total, data, totalPages, hasPrevious, hasNext } =
    await getPaginatedServiceOrder(query);

  res.status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: 'Ordens de serviço resgatadas com sucesso',
    meta: {
      total: total,
      totalPages: totalPages,
      hasPrevious: hasPrevious,
      hasNext: hasNext,
    },
    data: data,
  });
};

export const getServiceOrderController = async (
  _req: Request,
  res: Response,
) => {
  const id = res.locals.params.id;

  const data = await getServiceOrder(id);

  res.status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: 'Ordem de serviço resgatada com sucesso',
    data: data,
  });
};
