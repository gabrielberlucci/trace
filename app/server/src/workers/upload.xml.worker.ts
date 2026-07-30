import { Job, Worker } from 'bullmq';
import fs from 'node:fs/promises';
import path from 'node:path';

export const uploadXMLWorker = new Worker(
  'upload-xml',
  async (job: Job) => {
    console.log(
      `[Worker-File]: XML: ${job.data.name} has started to be processed at:
[Worker-Time]: ${new Date()}`,
    );

    const filePath = path.join(job.data.path, job.data.name);

    try {
      const data = await fs.readFile(filePath, { encoding: 'utf8' });

      // console.log(data);
    } catch (error) {
      console.log(error);
    }
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
    'uploads',
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
