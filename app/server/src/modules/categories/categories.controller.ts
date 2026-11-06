import type { Request, Response } from 'express';
import {
  createCategory,
  findAllCategory,
  findCategory,
  updateCategory,
} from './categories.service';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const createCategoryController = async (req: Request, res: Response) => {
  const body = req.body;
  const userId = res.locals.user.id;

  await createCategory(body, userId);

  res.status(StatusCodes.CREATED).send({
    status: ReasonPhrases.CREATED,
    message: 'Categoria criada com sucesso',
  });
};

export const findAllCategoryController = async (
  _req: Request,
  res: Response,
) => {
  const query = res.locals.query;

  const { total, data, hasPrevious, hasNext, totalPages } =
    await findAllCategory(query);

  res.status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: 'Categorias resgatadas com sucesso',
    meta: {
      totalSuppliers: total,
      totalPages: totalPages,
      hasPrevious: hasPrevious,
      hasNext: hasNext,
    },
    data: data,
  });
};

export const findCategoryController = async (_req: Request, res: Response) => {
  const id = res.locals.params.id;

  const data = await findCategory(id);

  res.status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: 'Categoria resgada com sucesso',
    data: data,
  });
};

export const updateCategoryController = async (req: Request, res: Response) => {
  const id = res.locals.params.id;
  const body = req.body;
  const userId = res.locals.user.id;

  await updateCategory(id, body, userId);

  res.status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: 'Categoria alterada com sucesso',
  });
};
