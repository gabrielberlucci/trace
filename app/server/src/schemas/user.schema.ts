import { commonSchema } from './common.schema';
import { z } from '@/config/zod.config';

export const userSchema = commonSchema
  .omit({
    document: true,
    typePerson: true,
  })
  .extend({
    password: z
      .string({ error: 'Insira uma senha' })
      .min(8, {
        error: 'Senha muito curta. Deve conter pelo menos 8 caracteres',
      })
      .max(20, {
        error: 'Senha muito Longa. Deve conter no máximo 20 caracteres',
      }),
    confirmedPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmedPassword, {
    error: 'As senhas não são iguais',
  });
