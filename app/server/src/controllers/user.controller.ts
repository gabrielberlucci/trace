import { BadRequest } from '@/error';
import {
  createUser,
  getMe,
  getPaginatedUsers,
  getUser,
  loginUser,
  modifyUser,
} from '@/services';
import type { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export const registerUserController = async (req: Request, res: Response) => {
  const userData = req.body;

  /**
   * TODO: refactor this obj, to not delete and only
   * pick up the necessary data
   */
  delete userData.confirmedPassword;

  const roleId = userData.roleId;
  const cityId = userData.cityId;
  const currentUserId = res.locals.user.id;

  const user = await createUser(userData, roleId, cityId, currentUserId);

  res.status(StatusCodes.CREATED).send({
    status: ReasonPhrases.CREATED,
    message: 'Usuário criado com sucesso',
    data: user,
  });
};

export const loginUserController = async (req: Request, res: Response) => {
  const userData = req.body;

  const loggedUser = await loginUser(userData);

  res
    .cookie('access_token', loggedUser, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 1000,
    })
    .status(StatusCodes.OK)
    .send({
      status: ReasonPhrases.OK,
      message: 'Login feito com sucesso',
    });
};

export const getPaginatedUsersController = async (
  _req: Request,
  res: Response,
) => {
  const query = res.locals.query;

  const { total, data, totalPages, hasPrevious, hasNext } =
    await getPaginatedUsers(query);

  res.status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: 'Usuários resgatados com sucesso',
    meta: {
      totalUsers: total,
      totalPages: totalPages,
      hasPrevious: hasPrevious,
      hasNext: hasNext,
    },
    data: {
      userData: data,
    },
  });
};

export const modifyUserController = async (req: Request, res: Response) => {
  const id = res.locals.params.id;
  const userData = req.body;

  delete userData.confirmedPassword;

  const user = await modifyUser(id, userData);

  res.status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: 'Usuário alterado com sucesso',
    data: user,
  });
};

export const getUserController = async (req: Request, res: Response) => {
  const id = res.locals.params.id;

  const data = await getUser(id);

  res.status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: 'Usuário resgatado com sucesso',
    data: data,
  });
};

export const meController = async (req: Request, res: Response) => {
  const userId = res.locals.user.id;

  console.log(userId);

  const data = await getMe(userId);

  res.status(StatusCodes.OK).send({
    status: ReasonPhrases.OK,
    message: 'Usuário autenticado',
    data: data,
  });
};
