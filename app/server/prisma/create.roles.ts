import type { UserRoleLevel } from '@/types';
import { prisma } from '../lib/prisma';

const roles: UserRoleLevel[] = [
  { name: 'admin', level: 0 },
  { name: 'gerente', level: 1 },
  { name: 'financeiro', level: 2 },
  { name: 'vendedor', level: 3 },
];

const createRole = async () => {
  await prisma.role.createMany({
    data: roles,
  });
};

createRole();
