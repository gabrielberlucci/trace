import { getRoles } from '@/services';
import type { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const getRolesController = async (_req: Request, res: Response) => {
  const data = await getRoles();

  res.status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: 'Cargos resgatados com sucesso',
    data: data,
  });
};
