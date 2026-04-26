import type { Prisma } from '../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import bcrypt from 'bcrypt';

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

export const loginUser = async (userData: Prisma.UserUpdateInput) => {};
