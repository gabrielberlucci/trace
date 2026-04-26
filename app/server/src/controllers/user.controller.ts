import { createUser } from '@/services';
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
