import { BadRequest } from '@/error/index';
import { createProduct } from '@/services/product.service';
import { type Request, type Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const createProductController = async (req: Request, res: Response) => {
  const productData = req.body;

  const product = await createProduct(productData);

  res.status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: 'Produto cadastrado com sucesso',
    data: product,
  });
};
