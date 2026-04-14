import { NotFound } from '@/error/NotFound';
import { UniqueConstraint } from '@/error/UniqueConstraint';
import {
  createSupplier,
  inactiveSupplier,
  modifySupplier,
} from '@/services/supplier.service';
import type { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const createSupplierController = async (req: Request, res: Response) => {
  try {
    const supplierData = req.body;

    const supplier = await createSupplier(supplierData);

    res.status(StatusCodes.OK).send({
      status: ReasonPhrases.OK,
      message: 'Fornecedor cadastrado com sucesso',
      data: supplier,
    });
  } catch (error) {
    if (error instanceof UniqueConstraint) {
      return res.status(error.statusCode).send({
        status: ReasonPhrases.CONFLICT,
        errorName: error.name,
        error: error.message,
      });
    }
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};

export const modifySupplierController = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const supplierData = req.body;

    const modifiedSupplier = await modifySupplier(
      parseInt(String(id), 10),
      supplierData,
    );

    res.status(StatusCodes.OK).send({
      status: ReasonPhrases.OK,
      message: 'Fornecedor alterado com sucesso!',
      data: modifiedSupplier,
    });
  } catch (error) {
    if (error instanceof NotFound) {
      return res.status(error.statusCode).send({
        error: ReasonPhrases.NOT_FOUND,
        errorName: error.name,
        message: error.message,
      });
    }

    if (error instanceof UniqueConstraint) {
      return res.status(error.statusCode).send({
        error: ReasonPhrases.CONFLICT,
        errorName: error.name,
        message: error.message,
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};

export const inactiveSupplierController = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const supplierId = req.params['id'];

    const convertedId = Number(supplierId);

    if (Number.isNaN(convertedId)) {
      return res.status(StatusCodes.BAD_REQUEST).send({
        error: ReasonPhrases.BAD_REQUEST,
        message: `ID ${supplierId} inválido`,
      });
    }
    const disabledSupplier = await inactiveSupplier(convertedId);

    res.status(StatusCodes.OK).send({
      status: StatusCodes.OK,
      message: 'Fornecedor inativado com sucesso',
      data: disabledSupplier,
    });
  } catch (error) {
    next(error);
  }
};
