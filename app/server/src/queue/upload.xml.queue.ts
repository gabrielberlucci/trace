import { Queue } from 'bullmq';

const importXMLQueue = new Queue('upload-xml', {
  connection: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
});

export const importXMLQueueService = async (
  xmlPathLocation: string,
  xmlFilename: string,
) => {
  await importXMLQueue.add('upload-xml', {
    path: xmlPathLocation,
    name: xmlFilename,
  });
};
