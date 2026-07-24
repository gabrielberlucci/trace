import { createCompany, getCompany, getPaginatedCompany } from '@/services';
import type { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const createCompanyController = async (req: Request, res: Response) => {
  const companyData = req.body;

  const data = await createCompany(companyData);

  res.status(StatusCodes.CREATED).send({
    status: ReasonPhrases.CREATED,
    message: 'Empresa criada com sucesso',
    data: data,
  });
};

export const getPaginatedCompanyController = async (
  _req: Request,
  res: Response,
) => {
  const query = res.locals.query;

  const { total, data, hasPrevious, hasNext, totalPages } =
    await getPaginatedCompany(query);

  res.status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: 'Empresas resgatadas com sucesso',
    meta: {
      total: total,
      hasPrevious: hasPrevious,
      hasNext: hasNext,
      totalPages: totalPages,
    },

    data: data,
  });
};

export const getCompanyController = async (_req: Request, res: Response) => {
  const companyId = res.locals.params.id;

  const data = await getCompany(companyId);

  res.status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: 'Empresa resgatada com sucesso',
    data: data,
  });
};
