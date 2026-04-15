import { BadRequest, NotFound, UniqueConstraint } from '@/error/index';
import { Prisma } from '../../generated/prisma/client';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { formatPrismaError } from '@/utils/index';
import type { NextFunction, Request, Response } from 'express';

export const validateError = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (error instanceof NotFound) {
    return res.status(error.statusCode).send({
      errorName: error.name,
      message: error.message,
    });
  }

  if (error instanceof UniqueConstraint) {
    return res.status(error.statusCode).send({
      errorName: error.name,
      message: error.message,
    });
  }

  if (error instanceof BadRequest) {
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

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
    error: ReasonPhrases.INTERNAL_SERVER_ERROR,
  });
};
