import { NotFound } from '@/error/NotFound';
import { UniqueConstraint } from '@/error/UniqueConstraint';
import { createSupplier, modifySupplier } from '@/services/supplier.service';
import type { Request, Response } from 'express';
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

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
