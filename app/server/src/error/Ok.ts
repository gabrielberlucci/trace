import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export class Ok extends Error {
  public readonly statusCode: number;

  constructor(
    message: string,
    statusCode = StatusCodes.OK,
    reasonPhrases = ReasonPhrases.OK,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.name = reasonPhrases;
  }
}
