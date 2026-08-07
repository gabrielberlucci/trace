import { importXMLQueueService } from '@/queue';
import { getPaginatedData } from '@/repositories/paginated.repositorhy';
import type { Prisma } from '../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import { Axiom } from '@axiomhq/js';
import type { AxiomData, UploadXMLQueryParamsFilters } from '@/types';

export const uploadXMLService = async (filePath: string, fileName: string) => {
  await importXMLQueueService(filePath, fileName);
};

export const getPaginatedNfeLogs = async (
  queryFilters: UploadXMLQueryParamsFilters,
) => {
  const where: Prisma.NfeUploadControlWhereInput = {
    nfeAccessKey: queryFilters.nfeKey
      ? { contains: queryFilters.nfeKey, mode: 'insensitive' }
      : undefined,
    numNf: queryFilters.numnf,
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

export const getAxiomNfeLogs = async (
  cursor?: string,
): Promise<{ minCursor: string; maxCursor: string; data: AxiomData[] }> => {
  const axiom = new Axiom({
    token: process.env.AXIOM_QUERY_TOKEN,
  });

  const res = await axiom.query(
    `['trace'] | where level == 'error' and isnotempty(jobName) | limit 50`,
    {
      cursor: cursor || '',
    },
  );
  const minCursor = res.status.minCursor;
  const maxCursor = res.status.maxCursor;

  const data: AxiomData[] = [];

  if (!res.tables?.length) {
    return { minCursor, maxCursor, data };
  }

  const table = res.tables[0];
  const columns = table?.columns;

  if (!columns || columns.length < 7) {
    return { minCursor, maxCursor, data };
  }

  const totalLogs = columns[0]?.length ?? 0;

  const formatter = new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'medium',
    timeZone: 'America/Sao_Paulo',
  });

  const timeIndex = table.fields.findIndex((a) => a.name === '_time');
  const jobMessageIndex = table.fields.findIndex(
    (a) => a.name === 'jobErrorMessage',
  );
  const jobNameIndex = table.fields.findIndex((a) => a.name === 'jobName');

  for (let i = 0; i < totalLogs; i++) {
    data.push({
      time: formatter.format(new Date(columns[timeIndex]?.[i])),
      jobMessage: columns[jobMessageIndex]?.[i],
      jobName: columns[jobNameIndex]?.[i],
    });
  }

  return { minCursor, maxCursor, data };
};
