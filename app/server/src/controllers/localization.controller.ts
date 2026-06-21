import { getUniqueStates, getCitiesByState } from '@/services';
import type { Request, Response } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

export const getStatesController = async (req: Request, res: Response) => {
  const data = await getUniqueStates();

  res.status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: 'Estados resgatados com sucesso',
    data: data,
  });
};

export const getCitiesByStateController = async (
  _req: Request,
  res: Response,
) => {
  const query = res.locals.query;

  const { total, data, totalPages, hasPrevious, hasNext } =
    await getCitiesByState(query);

  res.status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: 'Cidades resgatadas com sucesso',
    meta: {
      total: total,
      totalPages: totalPages,
      hasPrevious: hasPrevious,
      hasNext: hasNext,
    },

    data: data,
  });
};
