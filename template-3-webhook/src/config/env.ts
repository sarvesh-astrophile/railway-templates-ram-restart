import { z } from 'zod';

const envSchema = z.object({
  RAILWAY_API_TOKEN: z.string().min(1).refine(
    (val) => val.startsWith('railway_'),
    { message: 'RAILWAY_API_TOKEN must start with "railway_"' }
  ),
  RAILWAY_PROJECT_ID: z.string().min(1),
  RAILWAY_ENVIRONMENT_ID: z.string().min(1),
  TARGET_SERVICE_NAME: z.string().min(1),
  WEBHOOK_SECRET: z.string().optional(),
  AUTO_RESTART: z.coerce.boolean().default(true),
  PORT: z.coerce.number().default(3000),
});

export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;
