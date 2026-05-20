import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export class Forbidden extends Error {
  public readonly statusCode: number;

  constructor(
    message: string,
    statusCode = StatusCodes.FORBIDDEN,
    reasonPhrases = ReasonPhrases.FORBIDDEN,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.name = reasonPhrases;
  }
}
