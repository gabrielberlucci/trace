import { importXMLQueueService } from '@/queue';

export const uploadXMLService = async (filePath: string, fileName: string) => {
  await importXMLQueueService(filePath, fileName);
};
