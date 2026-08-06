import { upload } from '@/config';
import {
  uploadXMLController,
  getPaginatedNfeLogsController,
} from '@/controllers';
import { Router } from 'express';
import { authMiddleware, validateQuery } from '@/middlewares';
import { queryFilterSchema } from '@app/shared';

const uploadXMLRouter: Router = Router();

uploadXMLRouter.post('/', upload.single('file'), uploadXMLController);

uploadXMLRouter.get(
  '/logs',
  authMiddleware,
  validateQuery(queryFilterSchema),
  getPaginatedNfeLogsController,
);

export { uploadXMLRouter };
