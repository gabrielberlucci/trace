import { dashboardService } from '@/services';
import type { Request, Response } from 'express';
import { StatusCodes, ReasonPhrases } from 'http-status-codes';

export const dashboardController = async (req: Request, res: Response) => {
  const startDate: string = res.locals.query.startDate;
  const endDate: string = res.locals.query.endDate;

  const data = await dashboardService(startDate, endDate);

  res.status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: 'Informações do dashboard resgatadas com sucesso',
    data: data,
  });
};
