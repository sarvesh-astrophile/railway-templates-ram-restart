import type { StoredEvent, WebhookEventType } from '../types/webhook.js';
import { EVENT_STORE_SIZE } from '../config/constants.js';

export class EventRingBuffer {
  private buffer: StoredEvent[] = [];
  private maxSize = EVENT_STORE_SIZE;
  private restartsTriggered = 0;

  push(event: StoredEvent): void {
    this.buffer.push(event);
    if (this.buffer.length > this.maxSize) {
      this.buffer.shift();
    }

    if (event.actionTaken === 'restart_triggered') {
      this.restartsTriggered++;
    }
  }

  query(options: {
    limit?: number;
    type?: WebhookEventType;
    service?: string;
  } = {}): StoredEvent[] {
    let results = [...this.buffer];

    if (options.type) {
      results = results.filter((e) => e.type === options.type);
    }

    if (options.service) {
      results = results.filter((e) => e.serviceName === options.service);
    }

    const limit = Math.min(options.limit ?? 20, 100);
    return results.slice(-limit).reverse();
  }

  getStats(): { totalEvents: number; restartsTriggered: number } {
    return {
      totalEvents: this.buffer.length,
      restartsTriggered: this.restartsTriggered,
    };
  }
}

export const eventStore = new EventRingBuffer();
