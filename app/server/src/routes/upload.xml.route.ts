import { upload } from '@/config';
import {
  uploadXMLController,
  getPaginatedNfeLogsController,
  getAxiomNfeLogsController,
} from '@/controllers';
import { Router } from 'express';
import { authMiddleware, validateQuery } from '@/middlewares';
import { queryFilterSchema } from '@app/shared';

const uploadXMLRouter: Router = Router();

uploadXMLRouter.post(
  '/',
  authMiddleware,
  upload.single('file'),
  uploadXMLController,
);

uploadXMLRouter.get(
  '/logs/imports',
  authMiddleware,
  validateQuery(queryFilterSchema),
  getPaginatedNfeLogsController,
);

uploadXMLRouter.get(
  '/logs/imports/errors',
  authMiddleware,
  getAxiomNfeLogsController,
);

export { uploadXMLRouter };
