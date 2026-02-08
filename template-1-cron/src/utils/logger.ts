export const logger = {
  info: (message: string, meta?: Record<string, unknown>): void => {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    console.log(`[${timestamp}] INFO: ${message}${metaStr}`);
  },

  error: (message: string, error?: unknown): void => {
    const timestamp = new Date().toISOString();
    let errorStr = '';
    if (error) {
      if (error instanceof Error) {
        errorStr = ` ${error.message}${error.cause ? ` (cause: ${error.cause})` : ''}`;
      } else {
        errorStr = ` ${JSON.stringify(error)}`;
      }
    }
    console.error(`[${timestamp}] ERROR: ${message}${errorStr}`);
  },

  warn: (message: string, meta?: Record<string, unknown>): void => {
    const timestamp = new Date().toISOString();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    console.warn(`[${timestamp}] WARN: ${message}${metaStr}`);
  }
};
