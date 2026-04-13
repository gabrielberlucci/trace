import { UniqueConstraint } from '@/error/UniqueConstraint';
import {
  activeCustomer,
  createCustomer,
  inactiveCustomer,
  modifyCustomer,
} from '@/services/customer.service';
import type { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const createCustomerController = async (req: Request, res: Response) => {
  try {
    const customerData = req.body;

    const customer = await createCustomer(customerData);

    res.status(StatusCodes.OK).send({
      status: ReasonPhrases.OK,
      message: 'Cliente cadastrado com sucesso',
      data: customer,
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

export const modifyCustomerController = async (req: Request, res: Response) => {
  try {
    const customerData = req.body;
    const customerId = req.params;

    const modifiedCustomer = await modifyCustomer(
      customerData,
      parseInt(String(customerId.id), 10),
    );

    res.status(StatusCodes.OK).send({
      status: ReasonPhrases.OK,
      message: 'Cliente modificado com sucesso',
      data: modifiedCustomer,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};

export const inactiveCustomerController = async (
  req: Request,
  res: Response,
) => {
  try {
    const customerId = req.params;

    const disabledCustomer = await inactiveCustomer(
      parseInt(String(customerId.id), 10),
    );

    res.status(StatusCodes.OK).send({
      status: ReasonPhrases.OK,
      message: 'Cliente desabilitado com sucesso',
      data: disabledCustomer,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};

export const activeCustomerController = async (req: Request, res: Response) => {
  try {
    const customerId = req.params;

    const activatedCustomer = await activeCustomer(
      parseInt(String(customerId.id), 10),
    );

    res.status(StatusCodes.OK).send({
      status: ReasonPhrases.OK,
      message: 'Cliente habilitado com sucesso',
      data: activatedCustomer,
    });
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
      error: ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
  }
};
