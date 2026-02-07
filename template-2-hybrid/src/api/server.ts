import { Hono } from 'hono';
import { logger as honoLogger } from 'hono/logger';
import { authMiddleware } from './middleware/auth.js';
import { errorHandler } from './middleware/error.js';
import { createHealthHandler } from './routes/health.js';
import { createStatusHandler } from './routes/status.js';
import { createTriggerHandler } from './routes/trigger.js';
import { CircuitBreaker } from '../utils/circuit-breaker.js';

export function createServer(circuitBreaker: CircuitBreaker): Hono {
  const app = new Hono();

  app.use(honoLogger());
  app.use('*', authMiddleware);
  app.onError(errorHandler);

  // Routes
  app.get('/health', createHealthHandler(circuitBreaker));
  app.get('/status', createStatusHandler(circuitBreaker));
  app.post('/trigger', createTriggerHandler(circuitBreaker));

  return app;
}
