import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export class UnprocessableEntity extends Error {
  public readonly statusCode: number;

  constructor(
    message: string,
    statusCode = StatusCodes.UNPROCESSABLE_ENTITY,
    reasonPhrases = ReasonPhrases.UNPROCESSABLE_ENTITY,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.name = reasonPhrases;
  }
}
