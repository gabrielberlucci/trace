import { UnprocessableEntity } from '@/error/index';
import {
  activeCustomer,
  createCustomer,
  inactiveCustomer,
  modifyCustomer,
} from '@/services/customer.service';
import type { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const createCustomerController = async (req: Request, res: Response) => {
  const customerData = req.body;
  const customer = await createCustomer(customerData);

  res.status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: 'Cliente cadastrado com sucesso',
    data: customer,
  });
};

export const modifyCustomerController = async (req: Request, res: Response) => {
  const customerData = req.body;
  const customerId = req.params['id'];
  const convertedId = Number(customerId);

  if (Number.isNaN(convertedId)) {
    throw new UnprocessableEntity(
      `O cliente com o ID ${customerId} não está correto`,
    );
  }
  const modifiedCustomer = await modifyCustomer(customerData, convertedId);

  res.status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: 'Cliente modificado com sucesso',
    data: modifiedCustomer,
  });
};

export const inactiveCustomerController = async (
  req: Request,
  res: Response,
) => {
  const customerId = req.params['id'];
  const convertedId = Number(customerId);

  if (Number.isNaN(convertedId)) {
    throw new UnprocessableEntity(
      `O cliente com o ID ${customerId} não está correto`,
    );
  }

  const disabledCustomer = await inactiveCustomer(convertedId);

  res.status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: 'Cliente desabilitado com sucesso',
    data: disabledCustomer,
  });
};

export const activeCustomerController = async (req: Request, res: Response) => {
  try {
    const customerId = req.params['id'];
    const convertedId = Number(customerId);

    if (Number.isNaN(convertedId)) {
      throw new UnprocessableEntity(
        `O cliente com o ID ${customerId} não está correto`,
      );
    }

    const activatedCustomer = await activeCustomer(convertedId);

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
