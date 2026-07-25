import { commonSchema } from './common.schema';

export const companySchema = commonSchema.omit({
  typePerson: true,
});

export const modifyCompanySchema = companySchema
  .omit({
    document: true,
  })
  .partial();
