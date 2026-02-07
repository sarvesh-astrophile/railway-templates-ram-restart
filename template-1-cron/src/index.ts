import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { createDefaultCircuitBreaker } from './utils/circuit-breaker.js';
import { setupCronJobs } from './services/cron.js';

logger.info('Starting Railway RAM Monitor (Cron-Only)');
logger.info('Configuration', {
  projectId: env.RAILWAY_PROJECT_ID,
  environmentName: env.RAILWAY_ENVIRONMENT_NAME,
  targetService: env.TARGET_SERVICE_NAME,
  maxRamGB: env.MAX_RAM_GB,
  ramCheckInterval: env.MAX_RAM_CRON_INTERVAL_CHECK,
  forcedRestartInterval: env.CRON_INTERVAL_RESTART,
});

const circuitBreaker = createDefaultCircuitBreaker();

setupCronJobs(circuitBreaker);

logger.info('Cron jobs initialized. Monitor is running...');

// Keep the process alive
setInterval(() => {
  // Heartbeat to keep process alive
}, 60000);
