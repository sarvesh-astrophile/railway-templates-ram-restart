import type { Context } from 'hono';
import { eventStore } from '../../store/event-store.js';
import type { HealthStatus } from '../../types/webhook.js';

const startTime = Date.now();

export function healthHandler(c: Context): Response {
  const stats = eventStore.getStats();

  const status: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: Math.floor((Date.now() - startTime) / 1000),
    eventsReceived: stats.totalEvents,
    restartsTriggered: stats.restartsTriggered,
  };

  return c.json(status);
}
