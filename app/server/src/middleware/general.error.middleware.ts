import { BadRequest, UnprocessableEntity } from '@/error';
import { Prisma } from '../../generated/prisma/client';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { formatPrismaError } from '@/utils';
import type { NextFunction, Request, Response } from 'express';
import z, { ZodError } from 'zod';

export const validateError = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  // console.log(error);
  if (error instanceof ZodError) {
    const flattenError = z.flattenError(error);

    return res.status(StatusCodes.BAD_REQUEST).send({
      errorName: ReasonPhrases.BAD_REQUEST,
      formErrors: flattenError.formErrors,
      fieldErrors: flattenError.fieldErrors,
    });
  }

  if (error instanceof BadRequest) {
    return res.status(error.statusCode).send({
      errorName: error.name,
      message: error.message,
    });
  }

  if (error instanceof UnprocessableEntity) {
    return res.status(error.statusCode).send({
      errorName: error.name,
      message: error.message,
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      return res.status(StatusCodes.CONFLICT).send({
        errorName: ReasonPhrases.CONFLICT,
        message: `O campo ${formatPrismaError(error).firstMessage} já existe para o ${formatPrismaError(error).modelName}`,
      });
    }

    if (error.code === 'P2025') {
      return res.status(StatusCodes.NOT_FOUND).send({
        errorName: ReasonPhrases.NOT_FOUND,
        message: `Não foi possível encontrar o ${formatPrismaError(error)}`,
      });
    }
  }

  console.error(error);
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
    error: ReasonPhrases.INTERNAL_SERVER_ERROR,
  });
};
