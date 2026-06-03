import type { UserLogin, UserQueryParamsFilters } from '@/types';
import type { Prisma } from '../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import jwt from 'jsonwebtoken';
import { Forbidden, NotFound, Unauthorized } from '@/error';
import 'dotenv/config';
import { getPaginatedData } from '@/repositories/paginated.repositorhy';
import { hashPassword, verifyPassword } from '@/utils';
import { loggerStorage } from '@/logger';

export const createUser = async (
  userData: Prisma.UserCreateInput,
  roleId: number,
  cityId: number,
  currentUserId: number,
) => {
  userData.password = await hashPassword(userData.password);

  return await prisma.$transaction(async (tx) => {
    const role = await tx.role.findUnique({
      where: {
        id: roleId,
      },

      select: {
        id: true,
        level: true,
      },
    });

    if (!role)
      throw new NotFound(`Não foi encontrado o cargo com o ID ${roleId}`);

    const city = await tx.city.findUnique({
      where: {
        id: cityId,
      },

      select: {
        id: true,
      },
    });

    if (!city)
      throw new NotFound(
        `Não foi possível encontrar a cidade com o ID ${cityId}`,
      );

    const currentUser = await tx.user.findUnique({
      where: {
        id: currentUserId,
      },

      select: {
        role: {
          select: {
            level: true,
          },
        },
      },
    });

    if (!currentUser) throw new Forbidden(`Usuário loggado não encontrado`);

    if (currentUser.role.level > role.level)
      throw new Forbidden(
        `Usuário sem permissões suficiente para criar um usuário com essa função`,
      );

    const user = await tx.user.create({
      data: userData,
      omit: {
        password: true,
      },
    });

    return user;
  });
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
  if (!result) throw new Unauthorized('Usuário ou senha inválidos');

  const payload = {
    id: result.id,
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

  throw new Unauthorized('Usuário ou senha inválidos');
};

export const getPaginatedUsers = async (
  queryFilters: UserQueryParamsFilters,
) => {
  const where: Prisma.UserWhereInput = {
    active: queryFilters.active,
    username: queryFilters.username,
  };

  const select: Prisma.UserSelect = {
    id: true,
    name: true,
    role: true,
    username: true,
  };

  const { total, data, totalPages, hasPrevious, hasNext } =
    await getPaginatedData(
      prisma,
      prisma.user,
      where,
      queryFilters.page,
      'User',
      null,
      null,
      undefined,
      select,
    );

  return {
    total,
    data,
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

export const getUser = async (userId: number) => {
  const result = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });

  if (!result)
    throw new NotFound(`Usuário com o ID ${userId} não foi encontrado`);

  return result;
};
