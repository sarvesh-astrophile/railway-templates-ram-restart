import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { createDefaultCircuitBreaker } from './utils/circuit-breaker.js';
import { createServer } from './api/server.js';

logger.info('Starting Railway RAM Monitor (Webhook-Driven)');
logger.info('Configuration', {
  projectId: env.RAILWAY_PROJECT_ID,
  environmentId: env.RAILWAY_ENVIRONMENT_ID,
  targetService: env.TARGET_SERVICE_NAME,
  autoRestart: env.AUTO_RESTART,
});

const circuitBreaker = createDefaultCircuitBreaker();

// Create and start HTTP server
const app = createServer(circuitBreaker);

Bun.serve({
  fetch: app.fetch,
  port: env.PORT,
});

logger.info(`HTTP server running on port ${env.PORT}`);
logger.info('Ready to receive webhooks. Configure webhook URL in Railway project settings.');
