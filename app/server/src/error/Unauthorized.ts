import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export class Unauthorized extends Error {
  public readonly statusCode: number;

  constructor(
    message: string,
    statusCode = StatusCodes.UNAUTHORIZED,
    reasonPhrases = ReasonPhrases.UNAUTHORIZED,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.name = reasonPhrases;
  }
}
