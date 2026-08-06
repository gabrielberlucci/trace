import { BadRequest } from '@/error';
import {
  uploadXMLService,
  getPaginatedNfeLogs,
  getAxiomNfeLogs,
} from '@/services';
import type { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const uploadXMLController = async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) throw new BadRequest('Nenhum arquivo encontrado para upload.');
  if (file.size === 0) throw new BadRequest('Arquivo não pode ter 0KB');

  await uploadXMLService(file.destination, file.filename);

  res.status(StatusCodes.ACCEPTED).send({
    status: ReasonPhrases.ACCEPTED,
    message: 'Upload de XML realizado com sucesso para processamento',
  });
};

export const getPaginatedNfeLogsController = async (
  _req: Request,
  res: Response,
) => {
  const query = res.locals.query;

  const { total, data, hasPrevious, hasNext, totalPages } =
    await getPaginatedNfeLogs(query);

  res.status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: 'Logs resgatados com sucesso',
    meta: {
      total: total,
      hasPrevious: hasPrevious,
      hasNext: hasNext,
      totalPages: totalPages,
    },
    data: data,
  });
};

export const getAxiomNfeLogsController = async (
  req: Request,
  res: Response,
) => {
  const cursor = req.query.cursor as string | undefined;
  const { minCursor, maxCursor, data } = await getAxiomNfeLogs(cursor);

  res.status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: 'Logs resgatados com sucesso',
    meta: {
      minCursor: minCursor,
      maxCursor: maxCursor,
    },
    data: data,
  });
};
