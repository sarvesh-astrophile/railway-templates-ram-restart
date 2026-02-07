# Railway RAM Monitor Templates

A suite of three Railway templates for monitoring service memory usage and automatically restarting services when thresholds are exceeded. Built with **Hono** and **Bun** for maximum performance and minimal resource footprint.

## Overview

These templates replicate and extend the functionality of the original [Railway RAM Restart](https://github.com/dClimate/railway-ram-restart) service, modernizing it with:

- **Bun Runtime**: Native TypeScript support, faster cold starts (~100ms vs ~500ms)
- **Type Safety**: Full TypeScript with Zod runtime validation
- **Modern Stack**: Hono for HTTP APIs, gqtx for type-safe GraphQL
- **Resilience**: Circuit breaker pattern prevents Railway API overload
- **Multiple Architectures**: Choose the pattern that fits your use case

## Templates

| Template | Architecture | Use Case | Resource Usage |
|----------|-------------|----------|----------------|
| **[Template 1](./template-1-cron/)** | Cron-only (headless) | Background monitoring, minimal footprint | ~20MB RAM |
| **[Template 2](./template-2-hybrid/)** | Hybrid (Cron + HTTP API) | Operational visibility, manual controls | ~25MB RAM |
| **[Template 3](./template-3-webhook/)** | Webhook-driven | Reactive monitoring, event-driven | ~20MB RAM |

## Quick Comparison

| Feature | Template 1 | Template 2 | Template 3 |
|---------|------------|------------|------------|
| HTTP Server | ❌ | ✅ | ✅ |
| Cron Jobs | ✅ | ✅ | ❌ |
| Manual Restart | ❌ | ✅ | ❌ |
| Health Endpoint | ❌ | ✅ | ✅ |
| Event History | ❌ | Last check only | Last 100 events |
| API Key Auth | ❌ | ✅ | ❌ |
| Webhook Receiver | ❌ | ❌ | ✅ |
| Reactive Alerts | ❌ | ❌ | ✅ |

## Repository Structure

```
.
├── docs/                          # Railway documentation reference
│   ├── railway-templates/
│   └── railway-webhooks.md
├── example/                       # Original Node.js implementation
│   └── railway-ram-restart-main/
├── spec.md                        # Detailed technical specification
├── template-1-cron/               # Headless cron monitor
├── template-2-hybrid/             # Cron + HTTP API
├── template-3-webhook/            # Webhook-driven monitor
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) 1.1.0 or later
- Railway account with API token
- Target service deployed on Railway

### Choose Your Template

#### Template 1: Cron-Only
Use when you want:
- Minimal resource usage
- Set-and-forget monitoring
- No external access needed

```bash
cd template-1-cron
bun install
# Configure .env
bun run dev
```

#### Template 2: Hybrid
Use when you want:
- Health checks for Railway
- Manual restart capability
- Operational visibility

```bash
cd template-2-hybrid
bun install
# Configure .env
bun run dev
```

**Test the API:**
```bash
curl http://localhost:3000/health
curl -X POST -H "X-API-Key: your-key" http://localhost:3000/trigger
```

#### Template 3: Webhook-Driven
Use when you want:
- Real-time resource alerts
- Event audit trail
- Reactive rather than polling

```bash
cd template-3-webhook
bun install
# Configure .env
bun run dev
```

**Configure Webhook:**
1. Deploy to Railway
2. Copy service URL
3. Go to Railway Project → Settings → Webhooks
4. Add webhook URL: `https://your-service.up.railway.app/webhook`
5. Select events: `Resource.memory`

## Configuration

All templates require these environment variables:

| Variable | Description |
|----------|-------------|
| `RAILWAY_API_TOKEN` | Railway API token (starts with `railway_`) |
| `RAILWAY_PROJECT_ID` | Target project ID |
| `RAILWAY_ENVIRONMENT_ID` | Target environment ID |
| `TARGET_SERVICE_NAME` | Name of service to monitor |

### Template-Specific Variables

**Template 1 & 2:**
- `MAX_RAM_GB` - RAM threshold in GB
- `MAX_RAM_CRON_INTERVAL_CHECK` - Cron pattern for RAM checks
- `CRON_INTERVAL_RESTART` - Cron pattern for forced restarts

**Template 2:**
- `API_KEY` - Optional API key for `/trigger` endpoint
- `PORT` - HTTP server port (default: 3000)

**Template 3:**
- `AUTO_RESTART` - Enable auto-restart on alerts (default: true)
- `WEBHOOK_SECRET` - Optional webhook signature verification
- `PORT` - HTTP server port (default: 3000)

## Architecture

### Circuit Breaker Pattern

All templates implement a circuit breaker to prevent overwhelming Railway's API:

```
CLOSED (normal operation)
  │
  │ 3 failures
  ▼
OPEN (blocked for 60s)
  │
  │ after timeout
  ▼
HALF_OPEN (test request)
  │
  ├─ success ──► CLOSED
  └─ failure ──► OPEN
```

- **Failure Threshold**: 3 consecutive failures
- **Timeout**: 30 seconds per request
- **Reset Timeout**: 60 seconds cooldown

## Deployment

### Railway Template (Recommended)

Click the Deploy button in each template's README for one-click deployment.

### Manual Deployment

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and setup
railway login
railway init

# Deploy
cd template-X-<name>
railway up

# Configure variables
railway variables set RAILWAY_API_TOKEN=xxx RAILWAY_PROJECT_ID=xxx ...
```

## Monitoring

### Template 1
Check logs in Railway dashboard:
```
[2024-01-15T10:30:00.000Z] INFO: Current RAM usage: 1.2GB (threshold: 2.5GB)
```

### Template 2
```bash
# Health check
curl https://<service>.up.railway.app/health

# Full status
curl https://<service>.up.railway.app/status
```

### Template 3
```bash
# Health and stats
curl https://<service>.up.railway.app/health

# Recent events
curl https://<service>.up.railway.app/events?limit=10
```

## Development

### Project Structure

Each template follows this structure:

```
template-X-<name>/
├── src/
│   ├── config/          # Environment and constants
│   ├── services/        # Business logic
│   ├── utils/           # Utilities (logger, circuit breaker)
│   ├── types/           # TypeScript interfaces
│   └── index.ts         # Entry point
├── railway.json         # Railway configuration
├── package.json
├── tsconfig.json
└── README.md
```

### Running Tests

```bash
# Type checking
bun run typecheck

# Development with hot reload
bun run dev
```

## Security Considerations

1. **API Tokens**: Never commit `RAILWAY_API_TOKEN`. Use Railway's variable system.
2. **API Keys**: Template 2 supports optional API key authentication for the `/trigger` endpoint.
3. **Webhook Secrets**: Template 3 can verify webhook signatures (implementation stub provided).
4. **Private Networking**: Use Railway's private domains for internal communication.
5. **Circuit Breaker**: Prevents accidental API abuse during misconfigurations.

## Troubleshooting

### Common Issues

**Circuit Breaker Opens**
- Check `RAILWAY_API_TOKEN` is valid
- Verify `RAILWAY_PROJECT_ID` and `RAILWAY_ENVIRONMENT_ID` are correct
- Ensure target service exists

**No Metrics Available**
- Service may be newly deployed (wait a few minutes)
- Check service is in the target environment

**Webhook Not Receiving Events (Template 3)**
- Verify webhook URL is correct in Railway settings
- Check service is publicly accessible (or use Railway's networking)
- Ensure correct events are selected (Resource.memory)

### Debug Mode

Set environment variable for verbose logging:
```bash
DEBUG=true bun run dev
```

## Original Reference

This project modernizes the [dClimate Railway RAM Restart](https://github.com/dClimate/railway-ram-restart) service with:

| Aspect | Original | These Templates |
|--------|----------|-----------------|
| Runtime | Node.js 18 | Bun 1.1+ |
| Language | JavaScript | TypeScript |
| Cron | croner | Bun.cron() |
| HTTP | None | Hono |
| Validation | None | Zod |
| GraphQL | graphql-request | gqtx |
| Error Handling | console.log | Circuit breaker |
| Memory | ~50MB | ~20MB |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Submit a pull request

## License

MIT

## Acknowledgments

- Original implementation by [dClimate](https://github.com/dClimate)
- Railway for the excellent platform and documentation
- Bun team for the fast JavaScript runtime
