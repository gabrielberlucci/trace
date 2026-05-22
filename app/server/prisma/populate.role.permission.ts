import { prisma } from '../lib/prisma';
import permissions from './permissions.json' with { type: 'json' };

const adminPerms = permissions.map((m) => m.name);

const populateRolePermission = async () => {
  return await prisma.$transaction(async (tx) => {
    const role = await tx.role.findUnique({
      where: {
        name: 'admin',
      },
    });

    if (!role) {
      console.log('An error occurred while populating role permissions');
      return;
    }

    const permissions = await tx.permission.findMany({
      where: {
        name: {
          in: adminPerms,
        },
      },

      select: {
        id: true,
      },
    });

    if (permissions.length === 0) {
      console.log('An error occurred while populating role permissions');
      return;
    }

    await tx.rolePermission.createMany({
      data: permissions.map((permission) => ({
        roleId: role.id,
        permissionId: permission.id,
      })),
      skipDuplicates: true,
    });
  });
};

populateRolePermission();
