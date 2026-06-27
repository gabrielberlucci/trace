import { prisma } from '../../lib/prisma';

/* a will not use a paginated role because it only has 4 roles
  if the roles grow in size, i will use paginated repository
  to get all the roles from database
*/
export const getRoles = async () => {
  const roles = await prisma.role.findMany({
    omit: {
      level: true,
    },
  });

  return roles;
};
