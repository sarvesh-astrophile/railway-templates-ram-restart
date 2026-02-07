import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';
import { CircuitBreaker } from '../utils/circuit-breaker.js';
import { getCurrentRamUsage } from './metrics.js';
import { restartService } from './restart.js';
import type { RestartState } from '../types/index.js';

const restartState: RestartState = {
  lastCheck: null,
  lastRestart: null,
};

export function setupCronJobs(circuitBreaker: CircuitBreaker): void {
  // RAM-based restart
  if (env.MAX_RAM_CRON_INTERVAL_CHECK) {
    logger.info(`Setting up RAM check cron: ${env.MAX_RAM_CRON_INTERVAL_CHECK}`);

    Bun.cron(env.MAX_RAM_CRON_INTERVAL_CHECK, async () => {
      logger.info('Checking RAM usage...');

      try {
        const currentRam = await circuitBreaker.execute(() => getCurrentRamUsage());
        const thresholdExceeded = currentRam >= env.MAX_RAM_GB!;

        restartState.lastCheck = {
          timestamp: new Date().toISOString(),
          ramUsageGB: currentRam,
          thresholdExceeded,
        };

        logger.info(`Current RAM usage: ${currentRam}GB (threshold: ${env.MAX_RAM_GB}GB)`);

        if (thresholdExceeded) {
          logger.warn(`RAM threshold exceeded! Restarting service...`);
          const result = await circuitBreaker.execute(() => restartService());

          restartState.lastRestart = {
            timestamp: new Date().toISOString(),
            reason: 'threshold',
            deploymentId: result.deploymentId,
          };

          logger.info('Service restarted due to RAM threshold', { deploymentId: result.deploymentId });
        }
      } catch (error) {
        logger.error('RAM check failed', error);
      }
    });
  }

  // Forced periodic restart
  if (env.CRON_INTERVAL_RESTART) {
    logger.info(`Setting up forced restart cron: ${env.CRON_INTERVAL_RESTART}`);

    Bun.cron(env.CRON_INTERVAL_RESTART, async () => {
      logger.info('Executing scheduled restart...');

      try {
        const result = await circuitBreaker.execute(() => restartService());

        restartState.lastRestart = {
          timestamp: new Date().toISOString(),
          reason: 'scheduled',
          deploymentId: result.deploymentId,
        };

        logger.info('Scheduled restart completed', { deploymentId: result.deploymentId });
      } catch (error) {
        logger.error('Scheduled restart failed', error);
      }
    });
  }
}

export function getRestartState(): RestartState {
  return restartState;
}
