import { prisma } from "../../lib/prisma";

export const getUniqueStates = async () => {
  /* i prefer send the states raw, rather than consulting the database,
 because it will be a little bit faster, and it will save uncesessary querys in db
and it's a constant data */
  const states = {
    AC: "Acre",
    AL: "Alagoas",
    AM: "Amazonas",
    AP: "Amapá",
    BA: "Bahia",
    CE: "Ceará",
    DF: "Distrito Federal",
    ES: "Espírito Santo",
    GO: "Goiás",
    MA: "Maranhão",
    MG: "Minas Gerais",
    MS: "Mato Grosso do Sul",
    MT: "Mato Grosso",
    PA: "Pará",
    PB: "Paraíba",
    PE: "Pernambuco",
    PI: "Piauí",
    PR: "Paraná",
    RJ: "Rio de Janeiro",
    RN: "Rio Grande do Norte",
    RO: "Rondônia",
    RR: "Roraima",
    RS: "Rio Grande do Sul",
    SC: "Santa Catarina",
    SE: "Sergipe",
    SP: "São Paulo",
    TO: "Tocantins",
  };

  return states;
};
