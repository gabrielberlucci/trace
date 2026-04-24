import axios from 'axios';

interface City {
  id: number;
  nome: string;
  microrregiao?: Microrregiao;
}

interface Microrregiao {
  mesorregiao?: Mesorregiao;
}

interface Mesorregiao {
  UF?: UF;
}

interface UF {
  sigla?: string;
}

export const getCitiesInformation = async () => {
  const { data } = await axios.get<City[]>(
    'https://servicodados.ibge.gov.br/api/v1/localidades/municipios',
  );

  return data.map((city) => ({
    id: city.id,
    name: city.nome,
    state: city?.microrregiao?.mesorregiao?.UF?.sigla,
  }));
};
