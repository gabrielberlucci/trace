import { importXMLQueueService } from '@/queue';
import { getPaginatedData } from '@/repositories/paginated.repositorhy';
import type { Prisma } from '../../generated/prisma/client';
import { prisma } from '../../lib/prisma';

export const uploadXMLService = async (filePath: string, fileName: string) => {
  await importXMLQueueService(filePath, fileName);
};

export const getPaginatedNfeLogs = async (queryFilters: { page: number; name?: string }) => {
  const where: Prisma.NfeUploadControlWhereInput = {
    nfeAccessKey: queryFilters.name // or a separate query parameter for NFe key if added to shared schemas, but using name/q is standard for simple search
      ? { contains: queryFilters.name, mode: 'insensitive' }
      : undefined,
  };

  const { total, data, totalPages, hasPrevious, hasNext } =
    await getPaginatedData(
      prisma,
      prisma.nfeUploadControl,
      where,
      queryFilters.page,
      'NfeUploadControl',
      undefined,
      undefined,
      undefined,
      undefined,
    );

  return { total, data, totalPages, hasPrevious, hasNext };
};
