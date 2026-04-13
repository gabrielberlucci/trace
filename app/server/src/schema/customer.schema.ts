import { defaultSchema } from './general.schema';

export const createCustomerSchema = defaultSchema;

export const modifyCustomerSchema = defaultSchema
  .partial()
  .omit({ document: true });
