import { z } from './config';

export const serviceOrderSchema = z.object({
  date: z.date({ error: 'Insira a uma data' }),
  document: z
    .string({ error: 'Insira o documento do cliente' })
    .min(11, { error: 'O documento deve conter pelo menos 11 dígitos' })
    .max(14, { error: 'O documento deve conter no máximo 14 dígitos' }),
  items: z.array(
    z.object({
      data: z.date({ error: 'Insira a uma data' }),
      description: z
        .string({ error: 'Insira uma descrição' })
        .min(1, { error: 'A descrição deve conter pelo menos 1 caracteres' })
        .max(100, {
          error: 'A descrição deve conter no máximo 100 caracteres',
        }),
      hours: z
        .number()
        .check(z.gt(0, { error: 'As horas devem ser maiores que 0' })),
      hourlyRate: z
        .number()
        .check(z.gte(0, { error: 'As horas devem ser igual ou maior que 0' })),
    }),
  ),
});
