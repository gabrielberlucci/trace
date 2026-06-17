import { commonSchema } from '@/schemas/common.schema';

export const createSupplierSchema = commonSchema;
export const modifySupplierSchema = commonSchema.partial();
