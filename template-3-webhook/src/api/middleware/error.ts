import type { Context, ErrorHandler } from 'hono';
import { logger } from '../../utils/logger.js';

export const errorHandler: ErrorHandler = (err: Error, c: Context): Response => {
  logger.error('Unhandled error', err.message);

  return c.json({
    error: 'Internal Server Error',
    message: err.message,
  }, 500);
};
