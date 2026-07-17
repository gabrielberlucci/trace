import { commonSchema } from './common.schema';
import { z } from './config/index';
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

    roleId: z.int({ error: 'Insira um cargo para o usuário' }),

    username: z
      .string({ error: 'Insira um username' })
      .trim()
      .min(3, { error: 'Username muito curto. Use no minimo 3 caracteres' })
      .max(8, { error: 'Username muito longo. Use no maximo 8 caracteres' }),
  })
  .refine(
    (data: { password: string; confirmedPassword: string }) =>
      data.password === data.confirmedPassword,
    {
      error: 'As senhas não são iguais',
    },
  );

export const userLoginSchema = z.object(userSchema.shape).pick({
  username: true,
  password: true,
});

export const userQueryFilterSchema = z.object({
  ...queryFilterSchema.pick({ page: true }).shape,
  username: userSchema.shape.username.optional(),
});

export const modifyUserSchema = z
  .object(
    (userSchema as any).innerType
      ? (userSchema as any).innerType().shape
      : (userSchema as any).shape,
  )
  .partial()
  .refine(
    (data) => {
      if (data.password === undefined || data.password === '') return true;

      if (data.password !== undefined && data.password !== '') {
        return (
          data.confirmedPassword !== undefined && data.confirmedPassword !== ''
        );
      }
    },
    { error: 'Por favor, confirme a senha', path: ['confirmedPassword'] },
  )
  .refine(
    (data) => {
      if (data.password !== data.confirmedPassword) {
        return data.password === data.confirmedPassword;
      }
      return true;
    },
    {
      error: 'As senhas não são iguais',
      path: ['confirmedPassword'],
    },
  );
