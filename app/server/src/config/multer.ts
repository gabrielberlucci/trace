import { BadRequest } from '@/error';
import multer from 'multer';
import path from 'path';

const uploadDir = path.join(process.cwd(), 'uploads-xml', 'pending');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '_' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(
      null,
      `${path.basename(file.originalname, '.xml')}_${file.fieldname}_${uniqueSuffix}${ext}`,
    );
  },
});

export const upload = multer({
  storage: storage,
  fileFilter: (_req, file, cb) => {
    // if (!file.originalname.startsWith('NFe_'))
    //   return cb(new BadRequest('Arquivo XML com nome inválido'));
    if (file.mimetype === 'text/xml' || file.mimetype === 'application/xml')
      cb(null, true);
    else {
      cb(new BadRequest(`Apenas arquivos XML's podem ser enviados.`));
    }
  },
});
