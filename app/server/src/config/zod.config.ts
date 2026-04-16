import * as z from 'zod';

z.config({
  customError: (iss) => {
    if (iss.code === 'unrecognized_keys') {
      return `A chave ${iss.keys.map((k) => `"${k}"`).join(', ')} não pode ser enviada`;
    }
    return undefined; // mantém mensagem padrão para o resto
  },
});

export { z };
