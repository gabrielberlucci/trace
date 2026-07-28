import { BadRequest } from '@/error';
import type { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const uploadXMLController = async (req: Request, res: Response) => {
  const file = req.file;

  if (!file) throw new BadRequest('Nenhum arquivo encontrado para upload.');

  res.status(StatusCodes.ACCEPTED).send({
    status: ReasonPhrases.ACCEPTED,
    message: 'Upload de XML realizado com sucesso para processamento',
    data: req.file,
  });
};
