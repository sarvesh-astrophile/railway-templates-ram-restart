# Railway RAM Monitor - Hybrid Template

A hybrid cron + HTTP API service that monitors Railway service memory usage with operational endpoints for health checks, status queries, and manual restarts.

## Features

- **Cron + HTTP API**: Background monitoring with REST endpoints
- **API Key Authentication**: Optional X-API-Key header protection
- **Health Endpoint**: `/health` for Railway health probes
- **Status Endpoint**: `/status` for operational visibility
- **Trigger Endpoint**: `/trigger` for manual restarts
- **Bun Native**: Uses Bun 1.1+ native cron API
- **Circuit Breaker**: Automatic failure handling
- **Zod Validation**: Runtime environment variable validation

## Quick Start

### Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.com/new/template/TEMPLATE_ID)

### Manual Setup

```bash
# Clone and setup
git clone <repo>
cd template-2-hybrid
bun install

# Configure environment variables
cp .env.example .env
# Edit .env with your Railway credentials

# Run locally
bun run dev
```

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `RAILWAY_API_TOKEN` | Yes | | Railway API token (starts with `railway_`) |
| `RAILWAY_PROJECT_ID` | Yes | | Target project ID |
| `RAILWAY_ENVIRONMENT_NAME` | Yes | | Target environment name |
| `RAILWAY_ENVIRONMENT_ID` | Yes | | Target environment ID |
| `TARGET_SERVICE_NAME` | Yes | | Service name to monitor |
| `MAX_RAM_GB` | Conditional | | RAM threshold in GB |
| `MAX_RAM_CRON_INTERVAL_CHECK` | No | | Cron pattern for RAM checks |
| `CRON_INTERVAL_RESTART` | No | | Cron pattern for forced restarts |
| `API_KEY` | No | | API key for `/trigger` endpoint |
| `PORT` | No | 3000 | HTTP server port |

## API Endpoints

### GET /health
Simple liveness check.

```bash
curl https://<service>.up.railway.app/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "circuitBreakerState": "CLOSED"
}
```

### GET /status
Operational status and configuration.

```bash
curl https://<service>.up.railway.app/status
```

**Response:**
```json
{
  "config": {
    "targetService": "my-app",
    "environmentName": "production",
    "ramThreshold": 2.5,
    "ramCheckInterval": "*/1 * * * *",
    "forcedRestartInterval": "0 4 * * *"
  },
  "circuitBreaker": {
    "state": "CLOSED",
    "failures": 0
  },
  "lastCheck": {
    "timestamp": "2024-01-15T10:29:00.000Z",
    "ramUsageGB": 1.2,
    "thresholdExceeded": false
  },
  "lastRestart": {
    "timestamp": "2024-01-15T04:00:00.000Z",
    "reason": "scheduled",
    "deploymentId": "uuid"
  }
}
```

### POST /trigger
Manually trigger service restart.

```bash
curl -X POST \
  -H "X-API-Key: your-api-key" \
  https://<service>.up.railway.app/trigger
```

**Response (200):**
```json
{
  "success": true,
  "deploymentId": "uuid",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Response (401):**
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing API key"
}
```

**Response (503):**
```json
{
  "error": "Service Unavailable",
  "message": "Circuit breaker is OPEN - too many failures"
}
```

## Architecture

```
┌─────────────────────────────────────────┐
│           Bun Cron Jobs                 │
│  ┌─────────────┐    ┌─────────────┐    │
│  │ RAM Check   │    │ Scheduled   │    │
│  │ (optional)  │    │ Restart     │    │
│  └──────┬──────┘    │ (optional)  │    │
│         │           └─────────────┘    │
│         │                               │
│    ┌────▼────┐                          │
│    │Circuit  │                          │
│    │Breaker  │                          │
│    └────┬────┘                          │
│         │                               │
├─────────┼───────────────────────────────┤
│         │        Hono HTTP Server       │
│    ┌────▼────┐                          │
│    │/health  │ ── Health probe          │
│    │/status  │ ── Operational status    │
│    │/trigger │ ── Manual restart        │
│    └─────────┘                          │
└─────────────────────────────────────────┘
```

## License

MIT
