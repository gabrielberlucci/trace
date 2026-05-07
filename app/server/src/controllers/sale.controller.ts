import { BadRequest } from '@/error';
import { createSale, getPaginatedSales, getSale } from '@/services';
import type { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const createSaleController = async (req: Request, res: Response) => {
  const values = req.body;

  const data = await createSale(values);

  res.status(StatusCodes.CREATED).send({
    status: ReasonPhrases.CREATED,
    message: 'Venda realizada com sucesso',
    data: data,
  });
};

export const getSalesController = async (req: Request, res: Response) => {
  const query = res.locals.query;

  const { total, data, totalPages, hasPrevious, hasNext } =
    await getPaginatedSales(query);

  res.status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: 'Vendas resgatadas com sucesso',
    meta: {
      totalSales: total,
      hasPrevious: hasPrevious,
      hasNext: hasNext,
      totalPages: totalPages,
    },
    data: data,
  });
};

export const getSingleSaleController = async (req: Request, res: Response) => {
  const id = req.params['id'];
  const validatedId = Number(id);

  /**
   * TODO: maybe it's a good thing to make a middleware to validate params schema
   * i believe my life would be easier xD
   */
  if (Number.isNaN(validatedId))
    throw new BadRequest(`O id ${id} é inválido. Use um número`);

  const data = await getSale(validatedId);

  res.status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: 'Venda resgatada com sucesso',
    data: data,
  });
};
