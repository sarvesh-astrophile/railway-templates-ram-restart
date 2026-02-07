import type { Context } from 'hono';
import { CircuitBreaker } from '../../utils/circuit-breaker.js';
import type { HealthStatus } from '../../types/index.js';

const startTime = Date.now();

export function createHealthHandler(circuitBreaker: CircuitBreaker) {
  return (c: Context): Response => {
    const status: HealthStatus = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: Math.floor((Date.now() - startTime) / 1000),
      circuitBreakerState: circuitBreaker.getState(),
    };

    return c.json(status);
  };
}
