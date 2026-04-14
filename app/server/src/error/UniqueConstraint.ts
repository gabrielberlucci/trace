import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export class UniqueConstraint extends Error {
  public readonly statusCode: number;

  constructor(
    message: string,
    statusCode = StatusCodes.CONFLICT,
    reasonPhrases = ReasonPhrases.CONFLICT,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.name = reasonPhrases;
  }
}
