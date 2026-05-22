import { prisma } from '../lib/prisma';
import permissions from './permissions.json' with { type: 'json' };

const populatePermissions = async () => {
  await prisma.permission.createMany({
    data: permissions,
    skipDuplicates: true,
  });
};

await populatePermissions();
