# Environment Variables Guide

This guide covers all environment variables required for the Railway RAM Restart Cron template.

## Required Variables

### `RAILWAY_API_TOKEN`
**Type:** `string`
**Example:** `railway_xxxxxxxxxxxxxxxxxxxxxxxx`

Your Railway API token. Must start with `railway_`.

**How to get it:**
1. Go to [Railway Dashboard](https://railway.app/account/tokens)
2. Click "New Token"
3. Copy the generated token

---

### `RAILWAY_PROJECT_ID`
**Type:** `string`

The ID of your Railway project.

**How to find it:**
1. Open your project in Railway dashboard
2. Look at the URL: `https://railway.app/project/<PROJECT_ID>`
3. Copy the project ID from the URL

---

https://railway.com/project/<PROJECT_ID>/service/<SERVICE_ID>?environmentId=<ENVIRONMENT_ID>

### `RAILWAY_ENVIRONMENT_ID`
**Type:** `string`

The ID of the environment to monitor (e.g., production).

**How to find it:**
1. Open your Railway project
2. Select the environment you want to monitor
3. The environment ID is in the URL or can be found in environment settings

---

### `RAILWAY_ENVIRONMENT_NAME`
**Type:** `string`
**Example:** `production`, `staging`, `development`

The name of the environment. Used for logging and identification.

---

### `TARGET_SERVICE_NAME`
**Type:** `string`

The name of the service to monitor for memory usage.

**How to find it:**
1. Open your Railway project
2. Look at the service card/tile name
3. Use the exact service name as shown in the dashboard

---

## Optional Variables

### `MAX_RAM_GB`
**Type:** `number` (positive)
**Default:** None (required if using `MAX_RAM_CRON_INTERVAL_CHECK`)
**Example:** `2`, `4`, `8`

The memory threshold in gigabytes. When the service exceeds this RAM usage, it will be restarted (if monitoring is enabled).

---

### `MAX_RAM_CRON_INTERVAL_CHECK`
**Type:** `string` (cron expression)
**Example:** `*/1 * * * *` (every minute)

Cron schedule for checking memory usage. When set, the monitor will periodically check if the service exceeds `MAX_RAM_GB` and restart it if necessary.

**Common patterns:**
| Expression | Description |
|------------|-------------|
| `*/1 * * * *` | Every minute |
| `*/5 * * * *` | Every 5 minutes |
| `0 */1 * * *` | Every hour |
| `0 */6 * * *` | Every 6 hours |

---

### `CRON_INTERVAL_RESTART`
**Type:** `string` (cron expression)
**Example:** `0 4 * * *` (daily at 4 AM)

Cron schedule for scheduled restarts. Use this for periodic restarts regardless of memory usage.

**Common patterns:**
| Expression | Description |
|------------|-------------|
| `0 4 * * *` | Daily at 4:00 AM |
| `0 */12 * * *` | Every 12 hours |
| `0 0 * * 0` | Weekly on Sunday at midnight |

---

## Validation Rules

At startup, the application validates your environment variables:

1. **At least one cron interval must be set** - Either `MAX_RAM_CRON_INTERVAL_CHECK` or `CRON_INTERVAL_RESTART` (or both)
2. **MAX_RAM_GB is required when using memory monitoring** - If `MAX_RAM_CRON_INTERVAL_CHECK` is set, you must also set `MAX_RAM_GB`

## Example Configurations

### Memory-Based Restart Only
```env
RAILWAY_API_TOKEN="railway_xxxxxxxx"
RAILWAY_PROJECT_ID="your-project-id"
RAILWAY_ENVIRONMENT_NAME="production"
RAILWAY_ENVIRONMENT_ID="your-env-id"
TARGET_SERVICE_NAME="my-api-service"
MAX_RAM_GB="2"
MAX_RAM_CRON_INTERVAL_CHECK="*/5 * * * *"
```

### Scheduled Restart Only
```env
RAILWAY_API_TOKEN="railway_xxxxxxxx"
RAILWAY_PROJECT_ID="your-project-id"
RAILWAY_ENVIRONMENT_NAME="production"
RAILWAY_ENVIRONMENT_ID="your-env-id"
TARGET_SERVICE_NAME="my-api-service"
CRON_INTERVAL_RESTART="0 4 * * *"
```

### Both (Memory + Scheduled)
```env
RAILWAY_API_TOKEN="railway_xxxxxxxx"
RAILWAY_PROJECT_ID="your-project-id"
RAILWAY_ENVIRONMENT_NAME="production"
RAILWAY_ENVIRONMENT_ID="your-env-id"
TARGET_SERVICE_NAME="my-api-service"
MAX_RAM_GB="2"
MAX_RAM_CRON_INTERVAL_CHECK="*/5 * * * *"
CRON_INTERVAL_RESTART="0 4 * * *"
```

## Setting Variables in Railway

1. Go to your service in Railway dashboard
2. Click "Variables" tab
3. Add each variable from the list above
4. Redeploy the service

## Troubleshooting

### "At least one cron interval must be set"
You need to set either `MAX_RAM_CRON_INTERVAL_CHECK` or `CRON_INTERVAL_RESTART` (or both).

### "MAX_RAM_GB is required when MAX_RAM_CRON_INTERVAL_CHECK is set"
When using memory-based monitoring, you must specify the threshold in gigabytes.

### Invalid Railway API Token
Ensure your token starts with `railway_` and hasn't expired. Generate a new token if needed.

### Service not found
Double-check `TARGET_SERVICE_NAME` matches exactly (case-sensitive) with the service name in Railway dashboard.
