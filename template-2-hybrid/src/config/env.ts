import { z } from 'zod';

const envSchema = z.object({
  RAILWAY_API_TOKEN: z.string().min(1).refine(
    (val) => val.startsWith('railway_'),
    { message: 'RAILWAY_API_TOKEN must start with "railway_"' }
  ),
  RAILWAY_PROJECT_ID: z.string().min(1),
  RAILWAY_ENVIRONMENT_NAME: z.string().min(1),
  RAILWAY_ENVIRONMENT_ID: z.string().min(1),
  TARGET_SERVICE_NAME: z.string().min(1),
  MAX_RAM_GB: z.coerce.number().positive().optional(),
  MAX_RAM_CRON_INTERVAL_CHECK: z.string().optional(),
  CRON_INTERVAL_RESTART: z.string().optional(),
  API_KEY: z.string().optional(),
  PORT: z.coerce.number().default(3000),
}).refine(
  (data) => data.MAX_RAM_CRON_INTERVAL_CHECK || data.CRON_INTERVAL_RESTART,
  { message: 'At least one cron interval must be set (MAX_RAM_CRON_INTERVAL_CHECK or CRON_INTERVAL_RESTART)' }
).refine(
  (data) => !data.MAX_RAM_CRON_INTERVAL_CHECK || data.MAX_RAM_GB,
  { message: 'MAX_RAM_GB is required when MAX_RAM_CRON_INTERVAL_CHECK is set' }
);

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
