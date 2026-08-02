import { Job, Worker } from 'bullmq';
import fs from 'node:fs/promises';
import path from 'node:path';
import { XMLParser } from 'fast-xml-parser';
import { SyntaxValidator } from 'fast-xml-validator';
import { SignedXml } from 'xml-crypto';
import { DOMParser, XMLSerializer } from '@xmldom/xmldom';
import { getNFe } from './utils';

export const uploadXMLWorker = new Worker(
  'upload-xml',
  async (job: Job) => {
    console.log(
      `[Worker-File]: XML: ${job.data.name} has started to be processed at:
[Worker-Time]: ${new Date()}`,
    );

    const filePath = path.join(job.data.path, job.data.name);

    const xmlData = await fs.readFile(filePath, { encoding: 'utf8' });
    if (!xmlData) throw new Error('Falha ao ler o arquivo XML');

    const isValid = SyntaxValidator.validate(xmlData);
    if (isValid !== true) throw new Error();

    const docDOM = new DOMParser().parseFromString(xmlData, 'application/xml');
    if (!docDOM)
      throw new Error('Não foi possível parsear o XML usando o DOM Parser');

    const key = docDOM.getElementsByTagName('X509Certificate')[0]?.textContent;
    if (!key)
      throw new Error(
        'Chave da assinatura(X509Certificate) não foi encontrada',
      );

    const signature = docDOM.getElementsByTagName('Signature')[0];
    if (!signature)
      throw new Error(
        'Não foi possível encontrar a TAG de assinature(Signature) do XML',
      );

    const nfe = getNFe(xmlData);
    if (!nfe) throw new Error('Não foi possível capturar a TAG <NFe/> do XML');

    const pem = `-----BEGIN CERTIFICATE-----\n${key}\n-----END CERTIFICATE-----`;
    const sig = new SignedXml({ publicCert: pem });
    sig.loadSignature(signature as unknown as Node);

    const res = sig.checkSignature(nfe);
    if (!res) {
      throw new Error('Assinatura do XML inválida ou arquivo corrompido!');
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

uploadXMLWorker.on('failed', async (job: Job | undefined, error: Error) => {
  const filePath = path.join(job?.data.path, job?.data.name);
  const errorDir = path.join(process.cwd(), 'uploads', 'error', job?.data.name);

  await fs.mkdir(path.dirname(errorDir), { recursive: true });

  await fs.rename(filePath, errorDir);

  console.error(`[Worker-Error]: O Job ${job?.data.name} falhou!`);
  console.error('Job Error message: ' + error.message);
});
