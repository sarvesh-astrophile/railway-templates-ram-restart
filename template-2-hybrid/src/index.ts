import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { createDefaultCircuitBreaker } from './utils/circuit-breaker.js';
import { setupCronJobs } from './services/cron.js';
import { createServer } from './api/server.js';

logger.info('Starting Railway RAM Monitor (Hybrid)');
logger.info('Configuration', {
  projectId: env.RAILWAY_PROJECT_ID,
  environmentName: env.RAILWAY_ENVIRONMENT_NAME,
  targetService: env.TARGET_SERVICE_NAME,
  maxRamGB: env.MAX_RAM_GB,
  ramCheckInterval: env.MAX_RAM_CRON_INTERVAL_CHECK,
  forcedRestartInterval: env.CRON_INTERVAL_RESTART,
  apiKeyConfigured: !!env.API_KEY,
});

const circuitBreaker = createDefaultCircuitBreaker();

// Setup cron jobs
setupCronJobs(circuitBreaker);

// Create and start HTTP server
const app = createServer(circuitBreaker);

Bun.serve({
  fetch: app.fetch,
  port: env.PORT,
});

logger.info(`HTTP server running on port ${env.PORT}`);
logger.info('Cron jobs initialized. Monitor is running...');
