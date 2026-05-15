import { getCitiesInformation } from '@/clients';
import type { Prisma } from '../generated/prisma/client';
import { prisma } from '../lib/prisma';

const populateCity = async () => {
  const mapped = await getCitiesInformation();

  await prisma.city.createMany({
    data: mapped,
  });
};

populateCity();
