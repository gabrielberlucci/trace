import { z } from './config';

export const dashboardQueryFilterSchema = z
  .object({
    startDate: z.string(),
    endDate: z.string(),
  })
  .superRefine(({ startDate, endDate }, ctx) => {
    if (startDate > endDate) {
      ctx.addIssue({
        code: 'custom',
        message: 'Data inicial deve ser menor que a data final',
        path: ['startDate'],
      });
    }
  });
