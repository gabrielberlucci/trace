import { BadRequest } from '@/error';
import {
  createProduct,
  getPaginatedProducts,
  modifyProduct,
  getProduct,
} from '@/services';
import { type Request, type Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const createProductController = async (req: Request, res: Response) => {
  const productData = req.body;

  const product = await createProduct(productData);

  res.status(StatusCodes.CREATED).send({
    status: ReasonPhrases.CREATED,
    message: 'Produto cadastrado com sucesso',
    data: product,
  });
};

export const modifyProductController = async (req: Request, res: Response) => {
  const id = res.locals.params.id;
  const productData = req.body;

  const modifiedProduct = await modifyProduct(id, productData);

  res.status(StatusCodes.OK).send({
    message: 'Produto modificado com sucesso',
    data: modifiedProduct,
  });
};

export const getPaginatedProductsController = async (
  _req: Request,
  res: Response,
) => {
  const query = res.locals.query;

  const { total, data, hasPrevious, hasNext, totalPages } =
    await getPaginatedProducts(query);

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

export const getProductController = async (_req: Request, res: Response) => {
  const id = res.locals.params.id;

  const data = await getProduct(id);

  res.status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: 'Produto resgatado com sucesso',
    data: data,
  });
};
