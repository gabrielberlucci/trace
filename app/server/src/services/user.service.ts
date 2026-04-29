import type { UserLogin, UserQueryParamsFilters } from '@/types';
import type { Prisma } from '../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { NotFound, Unauthorized } from '@/error';
import 'dotenv/config';
import { getPaginatedData } from '@/repositories/paginated.repositorhy';
import { hashPassword, verifyPassword } from '@/utils';

export const createUser = async (userData: Prisma.UserCreateInput) => {
  userData.password = await hashPassword(userData.password);

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

  const validatedPassword = await verifyPassword(
    userData.password,
    result.password,
  );

  if (validatedPassword) {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return token;
  }

  throw new Unauthorized('Username ou senha inválidos');
};

export const getPaginatedUsers = async (
  queryFilters: UserQueryParamsFilters,
) => {
  const where: Prisma.UserWhereInput = {
    ...(queryFilters.username && { username: queryFilters.username }),
  };

  const omit: Prisma.UserSelect = {
    password: true,
  };

  const {
    totalGenerics: totalUsers,
    paginatedGenerics: paginatedUsers,
    totalPages,
    hasPrevious,
    hasNext,
  } = await getPaginatedData(
    prisma,
    prisma.user,
    where,
    queryFilters.page,
    omit,
  );

  return {
    totalUsers,
    paginatedUsers,
    totalPages,
    hasPrevious,
    hasNext,
  };
};

export const modifyUser = async (
  userId: number,
  userData: Prisma.UserUpdateInput,
) => {
  if (userData.password) {
    userData.password = await hashPassword(userData.password.toString());
  }

  const result = await prisma.$transaction(async (tx) => {
    const exits = await tx.user.findUnique({
      where: { id: userId },
    });

    if (!exits) throw new NotFound('Usuário não encontrado');

    return await tx.user.update({
      where: { id: userId },
      data: userData,

      omit: {
        password: true,
      },
    });
  });

  return result;
};
