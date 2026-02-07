import type { Context } from 'hono';
import { CircuitBreaker } from '../../utils/circuit-breaker.js';
import { restartService } from '../../services/restart.js';
import { logger } from '../../utils/logger.js';

export function createTriggerHandler(circuitBreaker: CircuitBreaker) {
  return async (c: Context): Promise<Response> => {
    if (circuitBreaker.getState() === 'OPEN') {
      return c.json({
        error: 'Service Unavailable',
        message: 'Circuit breaker is OPEN - too many failures',
      }, 503);
    }

    try {
      logger.info('Manual restart triggered via API');
      const result = await circuitBreaker.execute(() => restartService());

      return c.json({
        success: true,
        deploymentId: result.deploymentId,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      logger.error('Manual restart failed', error);
      return c.json({
        error: 'Restart Failed',
        message: error instanceof Error ? error.message : 'Unknown error',
      }, 500);
    }
  };
}
