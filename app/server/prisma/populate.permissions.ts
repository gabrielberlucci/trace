import { prisma } from '../lib/prisma';
import permissions from './permissions.json' with { type: 'json' };

/**
 * this could be better planned, but admin has all permissions
 * so we will only inherit from it
 */
const populatePermissions = async () => {
  await prisma.permission.createMany({
    data: permissions.admin.map((permission) => ({
      name: permission,
    })),
    skipDuplicates: true,
  });
};

await populatePermissions()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
