import { Prisma } from '../../generated/prisma/client';

export const formatPrismaError = (
  error: Prisma.PrismaClientKnownRequestError,
) => {
  const jsonError = JSON.parse(JSON.stringify(error.meta));
  const modelName = jsonError.modelName;
  const prismaErrorMessage = jsonError.driverAdapterError.cause.originalMessage;

  const match = prismaErrorMessage?.match(/\"(.*?)\"/);
  const errorMessageFinal = match[1].match(/\_(.*?)\_/);
  const firstMessage = errorMessageFinal[1];

  return { firstMessage, modelName };
};
