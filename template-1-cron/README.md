# Railway RAM Monitor - Cron-Only Template

A headless background service that monitors Railway service memory usage and automatically restarts services when thresholds are exceeded.

## Features

- **Pure Cron-Based**: No HTTP server, minimal resource footprint
- **Bun Native**: Uses Bun 1.1+ native cron API (`Bun.cron()`)
- **Type-Safe GraphQL**: Built with gqtx for type-safe Railway API calls
- **Circuit Breaker**: Automatic failure handling with exponential backoff
- **Zod Validation**: Runtime environment variable validation

## Quick Start

### Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.com/new/template/TEMPLATE_ID)

### Manual Setup

```bash
# Clone and setup
git clone <repo>
cd template-1-cron
bun install

# Configure environment variables
cp .env.example .env
# Edit .env with your Railway credentials

# Run locally
bun run dev
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `RAILWAY_API_TOKEN` | Yes | Railway API token (starts with `railway_`) |
| `RAILWAY_PROJECT_ID` | Yes | Target project ID |
| `RAILWAY_ENVIRONMENT_NAME` | Yes | Target environment name |
| `RAILWAY_ENVIRONMENT_ID` | Yes | Target environment ID |
| `TARGET_SERVICE_NAME` | Yes | Service name to monitor |
| `MAX_RAM_GB` | Conditional | RAM threshold in GB (required with MAX_RAM_CRON_INTERVAL_CHECK) |
| `MAX_RAM_CRON_INTERVAL_CHECK` | No | Cron pattern for RAM checks (e.g., `*/1 * * * *`) |
| `CRON_INTERVAL_RESTART` | No | Cron pattern for forced restarts (e.g., `0 4 * * *`) |

**Note:** At least one of `MAX_RAM_CRON_INTERVAL_CHECK` or `CRON_INTERVAL_RESTART` must be set.

## How It Works

1. **RAM Monitoring**: Checks current memory usage at specified intervals
2. **Threshold Check**: Compares against `MAX_RAM_GB`
3. **Auto-Restart**: Triggers deployment restart when threshold exceeded
4. **Scheduled Restart**: Optional periodic restarts regardless of RAM usage
5. **Circuit Breaker**: Prevents overwhelming Railway API on failures

## Architecture

```
┌─────────────────────────────────────────┐
│           Bun Cron Jobs                 │
│  ┌─────────────┐    ┌─────────────┐    │
│  │ RAM Check   │    │ Scheduled   │    │
│  │ (optional)  │    │ Restart     │    │
│  └──────┬──────┘    │ (optional)  │    │
│         │           └──────┬──────┘    │
│         │                  │           │
│         └──────┬───────────┘           │
│                │                       │
│         ┌──────▼──────┐                │
│         │ Circuit     │                │
│         │ Breaker     │                │
│         └──────┬──────┘                │
│                │                       │
│         ┌──────▼──────┐                │
│         │ Railway     │                │
│         │ GraphQL API │                │
│         └─────────────┘                │
└─────────────────────────────────────────┘
```

## Logs

```
[2024-01-15T10:30:00.000Z] INFO: Starting Railway RAM Monitor (Cron-Only)
[2024-01-15T10:30:00.000Z] INFO: Configuration {...}
[2024-01-15T10:30:00.000Z] INFO: Cron jobs initialized. Monitor is running...
[2024-01-15T10:31:00.000Z] INFO: Checking RAM usage...
[2024-01-15T10:31:00.000Z] INFO: Current RAM usage: 1.2GB (threshold: 2.5GB)
```

## License

MIT
