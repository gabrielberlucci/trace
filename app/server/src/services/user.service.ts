import type { UserLogin } from '@/types';
import type { Prisma } from '../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NotFound, Unauthorized } from '@/error';
import 'dotenv/config';

export const createUser = async (userData: Prisma.UserCreateInput) => {
  const saltRounds = 10;

  userData.password = await bcrypt.hash(userData.password, saltRounds);

  const user = await prisma.user.create({
    data: userData,
    omit: {
      password: true,
    },
  });

  return user;
};

export const loginUser = async (userData: UserLogin) => {
  const result = await prisma.user.findUnique({
    where: {
      username: userData.username,
    },
  });

  /**
   * i mean, returning 404 is not the best thing for this situation, because it can
   * lead hackers to keep trying usernames and passwords but,
   * this route will eventually have a rate-limit, so idk if it is a big problem
   */
  if (!result) throw new NotFound('Usuário não encontrado');

  const payload = {
    id: result.id,
    username: result.username,
    role: result.role,
  };

  const validatedPassword = await bcrypt.compare(
    userData.password,
    result!.password,
  );

  if (validatedPassword) {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return token;
  }

  throw new Unauthorized('Username ou senha inválidos');
};
