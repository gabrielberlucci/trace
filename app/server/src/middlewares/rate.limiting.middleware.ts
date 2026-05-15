import type { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

const requestCounts = new Map();
const CLEANING_TIME = 5 * 60000;
const COUNTER_LIMIT = 5;
const FIXED_WINDOW = 10000;

/**
 * clears keys that are expired after 5 minutes
 */
setInterval(() => {
  requestCounts.forEach((value, key) => {
    if (Date.now() - value.windowStart >= FIXED_WINDOW) {
      requestCounts.delete(key);
    }
  });
}, CLEANING_TIME);

export const rateLimiting = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const ip = req.ip;

  if (!requestCounts.has(ip)) {
    requestCounts.set(ip, { counter: 1, windowStart: Date.now() });
  } else {
    const record = requestCounts.get(ip);

    // expired
    if (Date.now() - record.windowStart >= FIXED_WINDOW) {
      record.counter = 1;
      record.windowStart = Date.now();
    }
    // not expired
    else {
      record.counter++;
      if (record.counter > COUNTER_LIMIT) {
        return res.status(StatusCodes.TOO_MANY_REQUESTS).send({
          status: ReasonPhrases.TOO_MANY_REQUESTS,
          message: 'Tente novamente mais tarde',
        });
      }
    }
  }

  next();
};
