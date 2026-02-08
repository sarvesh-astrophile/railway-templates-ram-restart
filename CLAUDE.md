# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This repository contains two Railway templates for monitoring service memory usage and automatically restarting services. All templates are built with **Bun** and **TypeScript**.

- **Template 1** (`template-1-cron/`): Headless cron-based monitor
- **Template 2** (`template-2-hybrid/`): Cron + HTTP API with Hono

## Development Commands

All templates use Bun as the runtime and package manager:

```bash
# Navigate to a template directory first
cd template-1-cron  # or template-2-hybrid

# Install dependencies
bun install

# Run in development mode (hot reload)
bun run dev

# Run in production mode
bun run start

# Type check without emitting
bun run typecheck
```

## Architecture

### Circuit Breaker Pattern

All templates implement a circuit breaker in `src/utils/circuit-breaker.ts` to prevent overwhelming Railway's GraphQL API:

- **CLOSED**: Normal operation, requests pass through
- **OPEN**: After 3 failures, blocks requests for 60 seconds
- **HALF_OPEN**: After cooldown, allows one test request

State transitions are logged. The circuit breaker wraps all Railway API calls.

### GraphQL Client (gqtx)

Templates use `gqtx` for type-safe GraphQL operations against Railway's API (`https://backboard.railway.app/graphql/v2`):

```typescript
// Pattern: Define types with t.objectType(), then queries/mutations
const fetcher = createFetcher({
  url: RAILWAY_GRAPHQL_ENDPOINT,
  headers: { Authorization: `Bearer ${env.RAILWAY_API_TOKEN}` },
});
```

Key operations:
- `getEnvironments()`: List project environments
- `getService(id)`: Get service details
- `getMetrics(...)`: Fetch memory usage metrics
- `restartDeployment(id)`: Trigger deployment restart

### Environment Validation

All templates use Zod for runtime validation in `src/config/env.ts`:

- `RAILWAY_API_TOKEN`: Must start with `railway_`
- `RAILWAY_PROJECT_ID`, `RAILWAY_ENVIRONMENT_ID`: Required project/environment IDs
- `TARGET_SERVICE_NAME`: Service to monitor
- Template-specific variables (cron intervals, API keys, etc.)

Validation runs at startup and throws if required variables are missing/invalid.

### Template-Specific Patterns

**Template 1 (Cron-Only)**:
- Uses `Bun.cron()` for scheduling
- No HTTP server, minimal footprint
- State stored in module-level variables

**Template 2 (Hybrid)**:
- Hono HTTP server alongside cron jobs
- API key middleware in `src/api/middleware/auth.ts`
- Routes: `/health`, `/status`, `/trigger`
- Circuit breaker state exposed via `/status`

## File Structure

Each template follows this structure:

```
src/
├── index.ts              # Entry point
├── config/
│   ├── env.ts           # Zod environment validation
│   └── constants.ts     # API endpoints, config values
├── services/
│   ├── railway.ts       # GraphQL client (all templates)
│   ├── metrics.ts       # RAM checking (all templates)
│   ├── restart.ts       # Restart logic
│   └── cron.ts          # Cron job setup
├── api/                 # HTTP server (template 2)
│   ├── server.ts
│   ├── middleware/
│   └── routes/
├── utils/
│   ├── circuit-breaker.ts
│   └── logger.ts        # Structured console logging
└── types/
    └── index.ts
```

## Railway Configuration

Each template includes a `railway.json` with deployment settings:

```json
{
  "$schema": "https://schema.up.railway.app/railway.schema.json",
  "deploy": {
    "startCommand": "bun run src/index.ts",
    "sleepApplication": false,
    "restartPolicyType": "ON_FAILURE",
    "healthcheckPath": "/health"  // null for template 1
  }
}
```

## Testing Endpoints (Template 2)

```bash
# Template 2
curl http://localhost:3000/health
curl http://localhost:3000/status
curl -X POST -H "X-API-Key: $API_KEY" http://localhost:3000/trigger
```

## Common Tasks

**Add a new GraphQL query**:
1. Define types in `src/services/railway.ts` using `t.objectType()`
2. Create query with `t.query()`
3. Export function that calls `query.resolve()`

**Modify cron schedule**:
- Update `MAX_RAM_CRON_INTERVAL_CHECK` or `CRON_INTERVAL_RESTART` env vars
- Uses standard cron syntax (e.g., `*/1 * * * *` for every minute)

**Add HTTP endpoint (Template 2)**:
1. Create route handler in `src/api/routes/`
2. Register in `src/api/server.ts`
3. Add middleware if needed in `src/api/middleware/`

**Change circuit breaker thresholds**:
- Edit `CIRCUIT_BREAKER_CONFIG` in `src/config/constants.ts`
- Default: 3 failures, 30s timeout, 60s reset

## Dependencies

- **Bun**: Runtime (>=1.1.0)
- **gqtx**: Type-safe GraphQL client
- **hono**: HTTP framework (template 2)
- **zod**: Environment validation
- **@types/bun**: TypeScript types

## References

- `spec.md`: Detailed technical specification with code examples
- `example/railway-ram-restart-main/`: Original Node.js implementation
