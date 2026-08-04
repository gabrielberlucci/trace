import { Job, Worker } from 'bullmq';
import fs from 'node:fs/promises';
import path from 'node:path';
import { uploadXMLWorkerPrisma } from './lib/worker.prisma';
import { getXMLInfo, updateInfoFromXML, validateXML } from './services';

export const uploadXMLWorker = new Worker(
  'upload-xml',
  async (job: Job) => {
    console.log(
      `[Worker-File]: XML: ${job.data.name} has started to be processed at:
[Worker-Time]: ${new Date()}`,
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

  console.log(
    `[Worker-File]: XML: ${job.data.name} has been processed at:
[Worker-Time]: ${new Date(job.finishedOn!)}`,
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

  await fs.mkdir(path.dirname(errorDir), { recursive: true });

  await fs.rename(filePath, errorDir);

  console.error(`[Worker-Error]: O Job ${job?.data.name} falhou!`);
  console.error('Job Error message: ' + error.message);
});
