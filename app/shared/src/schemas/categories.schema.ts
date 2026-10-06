import { z } from './config';

export const categorySchema = z.object({
  name: z
    .string({ error: 'Insira um nome' })
    .min(1, { error: 'Nome deve conter no minímo 1 caractere' })
    .max(100, { error: 'Nome deve conter no máximo 100 caracteres.' })
    .toUpperCase(),
});

export const categoryQuerySchema = z.object({
  name: z.string(),
});

export const updateCategorySchema = categorySchema.partial();

export type CreateCategoryDto = z.infer<typeof categorySchema>;
export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;
