import { UnprocessableEntity } from '@/error/index';
import { loggerStorage } from '@/logger/storage';
import {
  createCustomer,
  getPaginatedCustomers,
  modifyCustomer,
} from '@/services/customer.service';
import type { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const createCustomerController = async (req: Request, res: Response) => {
  const customerData = req.body;
  const customer = await createCustomer(customerData);

  res.status(StatusCodes.CREATED).send({
    status: ReasonPhrases.CREATED,
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

export const getCustomerController = async (_req: Request, res: Response) => {
  const query = res.locals.query;

  const {
    totalCustomers,
    paginatedCustomers,
    hasPrevious,
    hasNext,
    totalPages,
  } = await getPaginatedCustomers(query);

  res.status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: 'Clientes resgatados com sucesso',
    meta: {
      totalCustomers: totalCustomers,
      hasPrevious: hasPrevious,
      hasNext: hasNext,
      totalPages: totalPages,
    },
    data: paginatedCustomers,
  });
};
