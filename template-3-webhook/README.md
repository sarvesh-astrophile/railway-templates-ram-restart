# Railway RAM Monitor - Webhook-Driven Template

A webhook-driven service that receives Railway resource alerts and automatically restarts services when memory thresholds are exceeded.

## Features

- **Webhook-Driven**: Receives real-time resource alerts from Railway
- **Reactive Restarts**: Triggers restarts immediately on threshold breach
- **Event Store**: In-memory ring buffer (last 100 events)
- **Event History**: Query recent webhook events via API
- **Auto-Restart**: Configurable automatic restart on alerts
- **Circuit Breaker**: Prevents restart loops

## Quick Start

### Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.com/new/template/TEMPLATE_ID)

### Manual Setup

```bash
# Clone and setup
git clone <repo>
cd template-3-webhook
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
| `RAILWAY_ENVIRONMENT_ID` | Yes | | Target environment ID |
| `TARGET_SERVICE_NAME` | Yes | | Service name to monitor |
| `WEBHOOK_SECRET` | No | | For webhook signature verification |
| `AUTO_RESTART` | No | true | Automatically restart on resource alerts |
| `PORT` | No | 3000 | HTTP server port |

## Webhook Configuration

After deploying, configure the webhook in your Railway project:

1. Go to your **Railway Project**
2. Click **Settings** → **Webhooks**
3. Add a new webhook:
   - **URL**: `https://<your-service>.up.railway.app/webhook`
   - **Events**: Select `Resource.memory` (and optionally `Resource.cpu`)
4. Save the webhook

## API Endpoints

### GET /health
Health check with event statistics.

```bash
curl https://<service>.up.railway.app/health
```

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "eventsReceived": 42,
  "restartsTriggered": 5
}
```

### GET /events
Query recent webhook events.

```bash
# Get last 20 events
curl https://<service>.up.railway.app/events

# Filter by type
curl https://<service>.up.railway.app/events?type=Resource.memory

# Filter by service
curl https://<service>.up.railway.app/events?service=my-app

# Limit results
curl https://<service>.up.railway.app/events?limit=10
```

**Response:**
```json
{
  "events": [
    {
      "id": "uuid",
      "type": "Resource.memory",
      "serviceName": "my-app",
      "serviceId": "uuid",
      "deploymentId": "uuid",
      "severity": "WARNING",
      "currentValue": 2.8,
      "threshold": 2.5,
      "unit": "GB",
      "actionTaken": "restart_triggered",
      "timestamp": "2024-01-15T10:30:00.000Z",
      "receivedAt": "2024-01-15T10:30:01.000Z"
    }
  ],
  "total": 1
}
```

### POST /webhook
Receives Railway webhook events.

**Railway sends events to this endpoint.**

**Response (200):**
```json
{
  "received": true,
  "eventId": "uuid",
  "action": "restart_triggered"
}
```

**Response (400):**
```json
{
  "error": "Invalid webhook payload",
  "message": "..."
}
```

## Webhook Payload

Railway sends the following payload structure:

```json
{
  "type": "Resource.memory",
  "details": {
    "id": "uuid",
    "threshold": 2.5,
    "currentValue": 2.8,
    "unit": "GB"
  },
  "resource": {
    "workspace": { "id": "...", "name": "..." },
    "project": { "id": "...", "name": "..." },
    "environment": { "id": "...", "name": "...", "isEphemeral": false },
    "service": { "id": "...", "name": "my-app" },
    "deployment": { "id": "..." }
  },
  "severity": "WARNING",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

## Architecture

```
┌─────────────────────────────────────────┐
│           Railway Platform              │
│         (Monitors Resources)            │
└─────────────┬───────────────────────────┘
              │ Webhook
              ▼
┌─────────────────────────────────────────┐
│        POST /webhook                    │
│           Hono HTTP Server              │
│  ┌─────────────────────────────────┐   │
│  │ Parse & Validate Payload        │   │
│  │ Store Event                     │   │
│  │ Check Target Service            │   │
│  │ ├─ Match? → Trigger Restart     │   │
│  │ └─ No?    → Log Only            │   │
│  └─────────────────────────────────┘   │
│              │                          │
│    ┌─────────▼─────────┐                │
│    │ Circuit Breaker   │                │
│    └─────────┬─────────┘                │
│              │                          │
│    ┌─────────▼─────────┐                │
│    │ Railway GraphQL   │                │
│    │ deploymentRestart │                │
│    └───────────────────┘                │
└─────────────────────────────────────────┘
              │
    ┌─────────┴──────────┐
    ▼                    ▼
┌─────────┐       ┌──────────┐
│ /health │       │ /events  │
└─────────┘       └──────────┘
```

## Action Types

| Action | Description |
|--------|-------------|
| `restart_triggered` | Memory alert for target service triggered a restart |
| `logged_only` | Event logged but no action taken (e.g., CPU alert) |
| `ignored` | Event from non-target service or environment |

## Preventing Restart Loops

The service includes protections against restart loops:

1. **Circuit Breaker**: Opens after 3 consecutive failures
2. **AUTO_RESTART**: Can be disabled via environment variable
3. **Environment Filtering**: Only restarts services in the target environment

## License

MIT
