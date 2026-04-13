import type { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';

export const validateData =
  (schema: z.ZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.strict().parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const zodErrorMessage = z.flattenError(error);

        return res.status(StatusCodes.BAD_REQUEST).send({
          error: getReasonPhrase(StatusCodes.BAD_REQUEST),
          details: zodErrorMessage.fieldErrors,
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
          error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR),
        });
      }
    }
  };
