import { createCompany } from '@/services';
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
