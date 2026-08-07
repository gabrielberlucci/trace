import type { XMLProducts } from '@/types';
import { uploadXMLWorkerPrisma } from '../lib/worker.prisma';

export const updateInfoFromXML = async (
  emitCNPJ: string,
  destCNPJ: string,
  nfeKey: string,
  numnf: string,
  serienf: string,
  products: XMLProducts[],
) => {
  await uploadXMLWorkerPrisma.$transaction(async (tx) => {
    const supplier = await tx.supplier.findUnique({
      where: {
        document: emitCNPJ,
      },
      select: {
        document: true,
        id: true,
        active: true,
      },
    });

    if (!supplier)
      throw new Error(
        `Fornecedor com o CNPJ: ${emitCNPJ} não foi encontrado. Realize o cadastro para importar o XML`,
      );

    if (supplier.active === false)
      throw new Error(
        `Fornecedor com o CNPJ: ${emitCNPJ} está inativo. Ative o fornecedor para importar o XML`,
      );

    const company = await tx.company.findUnique({
      where: {
        document: destCNPJ,
      },
      select: {
        document: true,
        active: true,
      },
    });

    if (!company)
      throw new Error(
        `Empresa com o CNPJ: ${destCNPJ} não foi encontrado. Realize o cadastro para importar o XML`,
      );

    if (company.active === false)
      throw new Error(
        `Empresa com o CNPJ: ${destCNPJ} está inativo. Ative a empresa para importar o XML`,
      );

    const prd = await tx.product.findMany({
      where: {
        barcode: { in: products.map((product) => product.cProd) },
      },
      select: {
        barcode: true,
        id: true,
      },
    });

    if (prd.length !== products.length) {
      const foundBarcodes = new Set(prd.map((p) => p.barcode));
      const missing = products.filter((item) => !foundBarcodes.has(item.cProd));

      throw new Error(
        `Os produtos ${missing.map((item) => item.cProd).join(', ')} não foram encontrados.`,
      );
    }

    await Promise.all(
      products.map((item) =>
        tx.product.update({
          where: {
            barcode: item.cProd,
          },
          data: {
            currentStock: {
              increment: Number(item.qCom),
            },

            movement: {
              create: {
                quantity: Number(item.qCom),
                typeMovement: 'IMPORTACAO',
              },
            },
          },
        }),
      ),
    );

    await tx.nfeUploadControl.create({
      data: {
        nfeAccessKey: nfeKey,
        processedAt: new Date(),
        numNf: numnf,
        serieNf: serienf,
      },
    });
  });
};
