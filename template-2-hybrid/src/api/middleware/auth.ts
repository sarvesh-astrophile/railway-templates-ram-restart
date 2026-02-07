import type { Context, Next } from 'hono';
import { env } from '../../config/env.js';

export async function authMiddleware(c: Context, next: Next): Promise<Response | void> {
  if (!env.API_KEY) {
    return await next();
  }

  const providedKey = c.req.header('X-API-Key');
  if (providedKey !== env.API_KEY) {
    return c.json({ error: 'Unauthorized', message: 'Invalid or missing API key' }, 401);
  }

  await next();
}
