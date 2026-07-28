import { upload } from '@/config';
import { uploadXMLController } from '@/controllers';
import { Router } from 'express';

const uploadXMLRouter: Router = Router();

uploadXMLRouter.post('/', upload.single('file'), uploadXMLController);

export { uploadXMLRouter };
