import { commonSchema } from './common.schema';
import { z } from '@/config/zod.config';
import { queryFilterSchema } from './query.schema';

export const userSchema = commonSchema
  .omit({
    document: true,
    typePerson: true,
  })
  .extend({
    password: z
      .string({ error: 'Insira uma senha' })
      .trim()
      .min(8, {
        error: 'Senha muito curta. Deve conter pelo menos 8 caracteres',
      })
      .max(20, {
        error: 'Senha muito Longa. Deve conter no máximo 20 caracteres',
      }),

    confirmedPassword: z
      .string({ error: 'Confirme a senha' })
      .trim()
      .min(8, {
        error: 'Senha muito curta. Deve conter pelo menos 8 caracteres',
      })
      .max(20, {
        error: 'Senha muito Longa. Deve conter no máximo 20 caracteres',
      }),

    role: z.enum(['ADMIN', 'CAIXA']),

    username: z
      .string({ error: 'Insira um username' })
      .trim()
      .min(3, { error: 'Username muito curto. Use no minimo 3 caracteres' })
      .max(8, { error: 'Username muito longo. Use no maximo 8 caracteres' }),
  })
  .refine((data) => data.password === data.confirmedPassword, {
    error: 'As senhas não são iguais',
  });

export const userLoginSchema = z.object(userSchema.shape).pick({
  username: true,
  password: true,
});

export const userQueryFilterSchema = queryFilterSchema
  .pick({
    page: true,
  })
  .extend(
    z.object(userSchema.shape).pick({
      username: true,
    }),
  );
