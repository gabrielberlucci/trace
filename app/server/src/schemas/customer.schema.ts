import { commonSchema } from '@/schemas/common.schema';

export const createCustomerSchema = commonSchema;
/*
 * we don't want that the user can modify CPF/CNPJ
 * it can cause problems
 */
export const modifyCustomerSchema = commonSchema
  .partial()
  .omit({ document: true });
