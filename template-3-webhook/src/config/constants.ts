export const RAILWAY_GRAPHQL_ENDPOINT = 'https://backboard.railway.app/graphql/v2';

export const CIRCUIT_BREAKER_CONFIG = {
  failureThreshold: 3,
  timeoutDuration: 30000,
  resetTimeout: 60000,
} as const;

export const EVENT_STORE_SIZE = 100;
