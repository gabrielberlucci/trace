import { commonSchema } from './common.schema';

export const companySchema = commonSchema.omit({
  typePerson: true,
});
