export const getNFe = (xml: string) => {
  const nfe = xml.substring(
    xml.indexOf('<NFe'),
    xml.indexOf('</NFe>') + '</NFe>'.length,
  );

  return nfe;
};
