import { BadRequest } from '@/error';
import {
  createUser,
  getPaginatedUsers,
  loginUser,
  modifyUser,
} from '@/services';
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

export const getUsersController = async (_req: Request, res: Response) => {
  const query = res.locals.query;

  const { totalUsers, paginatedUsers, totalPages, hasPrevious, hasNext } =
    await getPaginatedUsers(query);

  res.status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: 'Usuários resgatados com sucesso',
    meta: {
      totalUsers: totalUsers,
      totalPages: totalPages,
      hasPrevious: hasPrevious,
      hasNext: hasNext,
    },
    data: {
      userData: paginatedUsers,
    },
  });
};

export const modifyUserController = async (req: Request, res: Response) => {
  const userId = req.params['id'];
  const convertedId = Number(userId);
  const userData = req.body;

  delete userData.confirmedPassword;

  if (Number.isNaN(convertedId)) throw new BadRequest('ID do usuário inválido');

  const user = await modifyUser(convertedId, userData);

  res.status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: 'Usuário alterado com sucesso',
    data: user,
  });
};
