import type { Context } from 'hono';
import { env } from '../../config/env.js';
import { eventStore } from '../../store/event-store.js';
import { CircuitBreaker } from '../../utils/circuit-breaker.js';
import { restartService } from '../../services/restart.js';
import { logger } from '../../utils/logger.js';
import type { RailwayWebhookPayload, StoredEvent } from '../../types/webhook.js';

export function createWebhookHandler(circuitBreaker: CircuitBreaker) {
  return async (c: Context): Promise<Response> => {
    try {
      const payload = await c.req.json() as RailwayWebhookPayload;

      logger.info('Webhook received', {
        type: payload.type,
        service: payload.resource.service.name,
        severity: payload.severity,
      });

      // Determine action to take
      let actionTaken: StoredEvent['actionTaken'] = 'logged_only';

      // Only process memory alerts for the target service
      const isMemoryAlert = payload.type === 'Resource.memory';
      const isTargetService = payload.resource.service.name === env.TARGET_SERVICE_NAME;
      const isTargetEnvironment = payload.resource.environment.id === env.RAILWAY_ENVIRONMENT_ID;

      if (isMemoryAlert && isTargetService && isTargetEnvironment) {
        if (env.AUTO_RESTART) {
          logger.warn('Memory threshold exceeded for target service', {
            currentValue: payload.details.currentValue,
            threshold: payload.details.threshold,
            service: payload.resource.service.name,
          });

          // Trigger restart asynchronously (don't await)
          circuitBreaker
            .execute(() =>
              restartService(payload.resource.service.id, payload.resource.deployment.id)
            )
            .then(() => {
              logger.info('Service restarted due to webhook alert', {
                deploymentId: payload.resource.deployment.id,
              });
            })
            .catch((error) => {
              logger.error('Failed to restart service', error);
            });

          actionTaken = 'restart_triggered';
        }
      } else if (!isTargetService || !isTargetEnvironment) {
        actionTaken = 'ignored';
      }

      // Store event
      const storedEvent: StoredEvent = {
        id: crypto.randomUUID(),
        type: payload.type,
        serviceName: payload.resource.service.name,
        serviceId: payload.resource.service.id,
        deploymentId: payload.resource.deployment.id,
        severity: payload.severity,
        currentValue: payload.details.currentValue,
        threshold: payload.details.threshold,
        unit: payload.details.unit,
        actionTaken,
        timestamp: payload.timestamp,
        receivedAt: new Date().toISOString(),
      };

      eventStore.push(storedEvent);

      return c.json({
        received: true,
        eventId: storedEvent.id,
        action: actionTaken,
      }, 200);
    } catch (error) {
      logger.error('Webhook processing failed', error);
      return c.json({
        error: 'Invalid webhook payload',
        message: error instanceof Error ? error.message : 'Unknown error',
      }, 400);
    }
  };
}
