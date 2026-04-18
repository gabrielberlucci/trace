import { BadRequest } from '@/error';
import { createProduct, modifyProduct } from '@/services/product.service';
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
  const productId = req.params['id'];
  const convertedId = Number(productId);
  const productData = req.body;

  if (Number.isNaN(convertedId)) {
    throw new BadRequest(`O produto com o ID ${productId} é inválido`);
  }

  const modifiedProduct = await modifyProduct(convertedId, productData);

  res.status(StatusCodes.OK).send({
    message: 'Produto modificado com sucesso',
    data: modifiedProduct,
  });
};
