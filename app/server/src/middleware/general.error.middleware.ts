import { BadRequest } from '@/error/BadRequest';
import { NotFound } from '@/error/NotFound';
import { UniqueConstraint } from '@/error/UniqueConstraint';
import type { NextFunction, Request, Response } from 'express';
import { Prisma } from '../../generated/prisma/client';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { formatPrismaError } from '@/utils/formatPrismaError';

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
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send({
    error: ReasonPhrases.INTERNAL_SERVER_ERROR,
  });
};
