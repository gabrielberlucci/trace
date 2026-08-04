import type { Job } from 'bullmq';
import { SyntaxValidator } from 'fast-xml-validator';
import { SignedXml } from 'xml-crypto';
import { Document, DOMParser } from '@xmldom/xmldom';
import { getNFe } from '../utils/index';
import fs from 'node:fs/promises';
import path from 'node:path';

export const validateXML = async (
  job: Job,
): Promise<{ res: boolean; docDOM: Document }> => {
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
    throw new Error('Chave da assinatura(X509Certificate) não foi encontrada');

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

  return { res, docDOM };
};
