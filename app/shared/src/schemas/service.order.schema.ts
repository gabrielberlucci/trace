import { z } from './config';

export const serviceOrderSchema = z.object({
  date: z
    .string({ error: 'Insira a uma data' })
    .datetime({ message: 'Data inválida' }),
  document: z
    .string({ error: 'Insira o documento do cliente' })
    .min(11, { error: 'O documento deve conter pelo menos 11 dígitos' })
    .max(14, { error: 'O documento deve conter no máximo 14 dígitos' }),
  items: z
    .array(
      z.object({
        date: z
          .string({ error: 'Insira a uma data' })
          .datetime({ message: 'Data inválida' }),
        description: z
          .string({ error: 'Insira uma descrição' })
          .min(1, { error: 'A descrição deve conter pelo menos 1 caracteres' })
          .max(1000, {
            error: 'A descrição deve conter no máximo 1000 caracteres',
          }),
        hours: z
          .number({ error: 'Insira a quantia de horas' })
          .gt(0, { error: 'As horas devem ser maiores que 0' }),
        hourlyRate: z
          .number({ error: 'Insira o valor hora' })
          .gte(0, { error: 'O valor hora deve ser igual ou maior que 0' }),
        note: z
          .union([
            z
              .string()
              .min(1, {
                error: 'Observação muito curta. Insira pelo menos 1 caractere',
              })
              .max(50, {
                error: 'Observação muito longa. Insira no máximo 50 caracteres',
              }),
            z.literal(''),
            z.undefined(),
          ])
          .optional(),
      }),
    )
    .min(1, { error: 'A ordem de serviço deve conter pelo menos 1 item' }),
});
