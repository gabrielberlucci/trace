import { BadRequest } from '@/error/BadRequest';
import {
  createSupplier,
  getPaginatedSuppliers,
  modifySupplier,
  getSupplier,
} from '@/services';
import type { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const createSupplierController = async (req: Request, res: Response) => {
  const supplierData = req.body;

  const supplier = await createSupplier(supplierData);

  res.status(StatusCodes.CREATED).send({
    status: ReasonPhrases.CREATED,
    message: 'Fornecedor cadastrado com sucesso',
    data: supplier,
  });
};

export const modifySupplierController = async (req: Request, res: Response) => {
  const supplierId = req.params['id'];
  const convertedId = Number(supplierId);
  const supplierData = req.body;

  if (Number.isNaN(convertedId)) {
    throw new BadRequest(
      `O fornecedor com o ID ${supplierId} não está correto`,
    );
  }

  const modifiedSupplier = await modifySupplier(convertedId, supplierData);

  res.status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: 'Fornecedor alterado com sucesso!',
    data: modifiedSupplier,
  });
};

export const getPaginatedSuppliersController = async (
  _req: Request,
  res: Response,
) => {
  const query = res.locals.query;

  const { total, data, totalPages, hasPrevious, hasNext } =
    await getPaginatedSuppliers(query);

  res.status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: 'Fornecedores resgatados com sucesso',
    meta: {
      totalSuppliers: total,
      totalPages: totalPages,
      hasPrevious: hasPrevious,
      hasNext: hasNext,
    },
    data: data,
  });
};

export const getSupplierController = async (_req: Request, res: Response) => {
  const id = res.locals.params.id;

  const data = await getSupplier(id);

  res.status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: 'Fornecedor resgatado com sucesso',
    data: data,
  });
};
