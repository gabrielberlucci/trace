import { BadRequest } from '@/error';
import {
  createProduct,
  findAllProduct,
  findProduct,
  updateProduct,
} from './product.service';
import { type Request, type Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const createProductController = async (req: Request, res: Response) => {
  const productData = req.body;

  await createProduct(productData);

  res.status(StatusCodes.CREATED).send({
    status: ReasonPhrases.CREATED,
    message: 'Produto cadastrado com sucesso',
  });
};

export const updateProductController = async (req: Request, res: Response) => {
  const id = res.locals.params.id;
  const productData = req.body;

  const modifiedProduct = await updateProduct(id, productData);

  res.status(StatusCodes.OK).send({
    message: 'Produto modificado com sucesso',
    data: modifiedProduct,
  });
};

export const findAllProductController = async (
  _req: Request,
  res: Response,
) => {
  const query = res.locals.query;

  const { total, data, hasPrevious, hasNext, totalPages } =
    await findAllProduct(query);

  res.status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: 'Produtos resgatados com sucesso',
    meta: {
      totalProducts: total,
      hasPrevious: hasPrevious,
      hasNext: hasNext,
      totalPages: totalPages,
    },

    data: data,
  });
};

export const findProductController = async (_req: Request, res: Response) => {
  const id = res.locals.params.id;

  const data = await findProduct(id);

  res.status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: 'Produto resgatado com sucesso',
    data: data,
  });
};
