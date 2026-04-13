import { StatusCodes } from 'http-status-codes';

export class NotFound extends Error {
  public readonly statusCode: number;

  constructor(message: string, statusCode = StatusCodes.NOT_FOUND) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'NotFound';
  }
}
