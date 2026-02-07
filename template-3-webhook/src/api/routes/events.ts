import type { Context } from 'hono';
import { eventStore } from '../../store/event-store.js';
import type { WebhookEventType } from '../../types/webhook.js';

export function eventsHandler(c: Context): Response {
  const query = c.req.query();

  const limit = query.limit ? parseInt(query.limit, 10) : 20;
  const type = query.type as WebhookEventType | undefined;
  const service = query.service;

  const events = eventStore.query({ limit, type, service });

  return c.json({
    events,
    total: events.length,
  });
}
