import type { Context } from 'hono';
import { env } from '../../config/env.js';
import { CircuitBreaker } from '../../utils/circuit-breaker.js';
import { getRestartState } from '../../services/cron.js';

export function createStatusHandler(circuitBreaker: CircuitBreaker) {
  return (c: Context): Response => {
    const restartState = getRestartState();

    const status = {
      config: {
        targetService: env.TARGET_SERVICE_NAME,
        environmentName: env.RAILWAY_ENVIRONMENT_NAME,
        ramThreshold: env.MAX_RAM_GB,
        ramCheckInterval: env.MAX_RAM_CRON_INTERVAL_CHECK,
        forcedRestartInterval: env.CRON_INTERVAL_RESTART,
      },
      circuitBreaker: {
        state: circuitBreaker.getState(),
        failures: circuitBreaker.getFailures(),
      },
      lastCheck: restartState.lastCheck,
      lastRestart: restartState.lastRestart,
    };

    return c.json(status);
  };
}
