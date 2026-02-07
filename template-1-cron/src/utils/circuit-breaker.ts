import { logger } from './logger.js';

type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

interface CircuitBreakerConfig {
  failureThreshold: number;
  timeoutDuration: number;
  resetTimeout: number;
  onStateChange?: (state: CircuitState) => void;
}

export class CircuitBreaker {
  private state: CircuitState = 'CLOSED';
  private failures = 0;
  private nextAttempt = 0;

  constructor(private config: CircuitBreakerConfig) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() < this.nextAttempt) {
        throw new Error('Circuit breaker is OPEN');
      }
      this.state = 'HALF_OPEN';
      logger.info(`Circuit breaker state changed to: HALF_OPEN`);
      this.config.onStateChange?.('HALF_OPEN');
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  getState(): CircuitState {
    return this.state;
  }

  private onSuccess(): void {
    this.failures = 0;
    if (this.state === 'HALF_OPEN') {
      this.state = 'CLOSED';
      logger.info(`Circuit breaker state changed to: CLOSED`);
      this.config.onStateChange?.('CLOSED');
    }
  }

  private onFailure(): void {
    this.failures++;
    if (this.failures >= this.config.failureThreshold) {
      this.state = 'OPEN';
      this.nextAttempt = Date.now() + this.config.resetTimeout;
      logger.warn(`Circuit breaker state changed to: OPEN (failures: ${this.failures})`);
      this.config.onStateChange?.('OPEN');
    }
  }
}

export const createDefaultCircuitBreaker = (): CircuitBreaker => {
  return new CircuitBreaker({
    failureThreshold: 3,
    timeoutDuration: 30000,
    resetTimeout: 60000,
  });
};
