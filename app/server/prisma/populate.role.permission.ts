import { prisma } from '../lib/prisma';
import permissions from './permissions.json' with { type: 'json' };

const populateRolePermission = async () => {
  return await prisma.$transaction(async (tx) => {
    const roleNames = Object.keys(permissions);
    const permissionNames = Object.values(permissions).flat();

    const roles = await tx.role.findMany({
      where: { name: { in: roleNames } },
      select: { id: true, name: true },
    });

    const allPermissions = await tx.permission.findMany({
      where: { name: { in: permissionNames } },
      select: { id: true, name: true },
    });

    const roleMap = new Map(roles.map((r) => [r.name, r.id]));
    const permissionMap = new Map(allPermissions.map((p) => [p.name, p.id]));

    const data = Object.entries(permissions).flatMap(
      ([roleName, permNames]) => {
        const roleId = roleMap.get(roleName);
        if (!roleId) throw new Error(`Role "${roleName}" not found`);

        return permNames.map((permName) => {
          const permissionId = permissionMap.get(permName);
          if (!permissionId)
            throw new Error(`Permission "${permName}" not found`);
          return { roleId, permissionId };
        });
      },
    );

    await tx.rolePermission.createMany({ data, skipDuplicates: true });
  });
};

populateRolePermission()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
