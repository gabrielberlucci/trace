import { NotFound } from '@/error';
import { createUser, loginUser } from '@/services';
import type { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const registerUserController = async (req: Request, res: Response) => {
  const userData = req.body;

  delete userData.confirmedPassword;

  const user = await createUser(userData);

  res.status(StatusCodes.CREATED).send({
    status: ReasonPhrases.CREATED,
    message: 'Usuário criado com sucesso',
    data: user,
  });
};

export const loginUserController = async (req: Request, res: Response) => {
  const userData = req.body;

  const loggedUser = await loginUser(userData);

  res.cookie('access_token', loggedUser).status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: 'Login feito com sucesso',
  });
};
