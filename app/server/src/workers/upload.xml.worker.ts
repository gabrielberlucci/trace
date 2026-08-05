import { Job, Worker } from 'bullmq';
import fs from 'node:fs/promises';
import path from 'node:path';
import { uploadXMLWorkerPrisma } from './lib/worker.prisma';
import { getXMLInfo, updateInfoFromXML, validateXML } from './services';
import { logger, loggerStorage } from '@/logger';

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
      throw new Error('Assinatura do XML inválida ou arquivo corrompido!');
    }

    const { emitCNPJ, destCNPJ, nfeKey, products } = getXMLInfo(docDOM);

    await updateInfoFromXML(emitCNPJ, destCNPJ, nfeKey, products);

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

  if (!job) throw new Error('Job search failed');

  await fs.mkdir(path.dirname(errorDir), { recursive: true });

  await fs.rename(filePath, errorDir);

  logger.error(
    { jobName: job.data.name, jobErrorMessage: error.message },
    'Erro ao importar XML',
  );
});
