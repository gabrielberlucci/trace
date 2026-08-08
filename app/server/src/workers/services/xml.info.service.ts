import type { Document as XMLDomDocument } from '@xmldom/xmldom';

export const getXMLInfo = (docDOM: XMLDomDocument) => {
  const emitCNPJ = docDOM
    .getElementsByTagName('emit')[0]
    ?.getElementsByTagName('CNPJ')[0]?.textContent!;
  const destCNPJ = docDOM
    .getElementsByTagName('dest')[0]
    ?.getElementsByTagName('CNPJ')[0]?.textContent!;
  const det = docDOM.getElementsByTagName('det');
  const nfeKey = docDOM
    .getElementsByTagName('infNFe')[0]
    ?.getAttribute('Id')
    ?.replace('NFe', '')!;
  const numnf = docDOM.getElementsByTagName('nNF')[0]?.textContent!;
  const serienf = docDOM.getElementsByTagName('serie')[0]?.textContent!;

  let products = [];

  for (let i = 0; i < det.length; i++) {
    let currentProduct = {
      cProd: det[i]
        ?.getElementsByTagName('prod')[0]
        ?.getElementsByTagName('cProd')[0]?.textContent!,
      qCom: det[i]
        ?.getElementsByTagName('prod')[0]
        ?.getElementsByTagName('qCom')[0]?.textContent!,
    };

    products.push(currentProduct);
  }

  return { emitCNPJ, destCNPJ, nfeKey, numnf, serienf, products };
};
