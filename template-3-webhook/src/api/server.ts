import { Hono } from 'hono';
import { logger as honoLogger } from 'hono/logger';
import { errorHandler } from './middleware/error.js';
import { healthHandler } from './routes/health.js';
import { eventsHandler } from './routes/events.js';
import { createWebhookHandler } from './routes/webhook.js';
import { CircuitBreaker } from '../utils/circuit-breaker.js';

export function createServer(circuitBreaker: CircuitBreaker): Hono {
  const app = new Hono();

  app.use(honoLogger());
  app.onError(errorHandler);

  // Routes
  app.get('/health', healthHandler);
  app.get('/events', eventsHandler);
  app.post('/webhook', createWebhookHandler(circuitBreaker));

  return app;
}
