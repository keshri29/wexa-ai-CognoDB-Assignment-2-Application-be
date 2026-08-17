import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/AppError';
import { logger } from '../utils/logger';

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof AppError) {
    if (!err.isOperational) {
      logger.error('Non-operational error', err);
    }
    res.status(err.statusCode).json({ error: err.message });
    return;
  }

  logger.error('Unhandled error', err);
  res.status(500).json({ error: 'Something went wrong. Please try again in a moment.' });
}
