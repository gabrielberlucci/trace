import { getKardex } from '@/services';
import type { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const getKardexController = async (_req: Request, res: Response) => {
  const query = res.locals.query;

  const { total, data, totalPages, hasPrevious, hasNext } =
    await getKardex(query);

  res.status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: 'Kardex resgatada com sucesso',
    meta: {
      total: total,
      totalPages: totalPages,
      hasPrevious: hasPrevious,
      hasNext: hasNext,
    },
    data: data,
  });
};
