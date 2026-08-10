import { Job, Worker, UnrecoverableError } from 'bullmq';
import fs from 'node:fs/promises';
import path from 'node:path';
import { getXMLInfo, updateInfoFromXML, validateXML } from './services';
import { logger } from '@/logger';
import { Prisma } from '../../generated/prisma/client';

export const uploadXMLWorker = new Worker(
  'upload-xml',
  async (job: Job) => {
    logger.info(
      {
        jobName: job.data.name,
        jobData: new Date(),
      },
      'Iniciando o processo de importação',
    );

    const { res, docDOM } = await validateXML(job);

    if (!res) {
      throw new UnrecoverableError(
        'Assinatura do XML inválida ou arquivo corrompido!',
      );
    }

    const { emitCNPJ, destCNPJ, nfeKey, numnf, serienf, products } =
      getXMLInfo(docDOM);

    await job.updateData({
      ...job.data,
      numnf: numnf,
      serienf: serienf,
      nfeKey: nfeKey,
    });

    try {
      await updateInfoFromXML(
        emitCNPJ,
        destCNPJ,
        nfeKey,
        numnf,
        serienf,
        products,
      );
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new UnrecoverableError('XML já importado');
        }
      }
      throw error;
    }

    // // DEBUG:
    // console.log('Resultado:', res);
    // console.log('Erros do Validador:', (sig as any).validationErrors);
    // console.log(
    //   'Referências Checadas:',
    //   JSON.stringify((sig as any).references, null, 2),
    // );
  },
  {
    connection: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
  },
);

uploadXMLWorker.on('completed', async (job: Job) => {
  const filePath = path.join(job.data.path, job.data.name);
  const processedDir = path.join(
    process.cwd(),
    'uploads-xml',
    'processed',
    job.data.name,
  );

  await fs.mkdir(path.dirname(processedDir), { recursive: true });

  await fs.rename(filePath, processedDir);

  logger.info(
    {
      jobName: job.data.name,
      processedAt: new Date(job.finishedOn!),
      nfeKey: job.data.nfeKey,
      numnf: job.data.numnf,
      serienf: job.data.serienf,
    },
    'o XML foi processado com sucesso',
  );
});

uploadXMLWorker.on('failed', async (job: Job | undefined, error: Error) => {
  const filePath = path.join(job?.data.path, job?.data.name);
  const errorDir = path.join(
    process.cwd(),
    'uploads-xml',
    'error',
    job?.data.name,
  );

  const maxAttempts = job?.opts.attempts || 5;

  if (
    error instanceof UnrecoverableError ||
    job?.attemptsMade === maxAttempts
  ) {
    await fs.mkdir(path.dirname(errorDir), { recursive: true });
    await fs.rename(filePath, errorDir);
  }

  logger.error(
    {
      jobName: job?.data.name,
      jobErrorMessage: error.message,
      nfeKey: job?.data.nfeKey,
      numnf: job?.data.numnf,
      serienf: job?.data.serienf,
    },
    'Erro ao importar XML',
  );
});
