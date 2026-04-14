import { ReasonPhrases, StatusCodes } from 'http-status-codes';

export class BadRequest extends Error {
  public readonly statusCode: number;

  constructor(
    message: string,
    statusCode = StatusCodes.BAD_REQUEST,
    reasonPhrases = ReasonPhrases.BAD_REQUEST,
  ) {
    super(message);
    this.statusCode = statusCode;
    this.name = reasonPhrases;
  }
}
