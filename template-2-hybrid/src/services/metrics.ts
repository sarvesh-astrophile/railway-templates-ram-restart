import { getEnvironments, getService, getMetrics } from './railway.js';
import { env } from '../config/env.js';
import type { Environment } from '../types/index.js';

export async function getCurrentRamUsage(): Promise<number> {
  const environments = await getEnvironments();

  const targetEnvironment = environments.find(
    (env: Environment) => env.name === env.RAILWAY_ENVIRONMENT_NAME
  );

  if (!targetEnvironment) {
    throw new Error(`Environment "${env.RAILWAY_ENVIRONMENT_NAME}" not found`);
  }

  for (const serviceInstanceEdge of targetEnvironment.serviceInstances.edges) {
    const serviceInstance = serviceInstanceEdge.node;
    const service = await getService(serviceInstance.serviceId);

    if (service.name === env.TARGET_SERVICE_NAME) {
      const metrics = await getMetrics(
        env.RAILWAY_PROJECT_ID,
        serviceInstance.serviceId,
        env.RAILWAY_ENVIRONMENT_ID
      );

      if (metrics.values.length === 0) {
        throw new Error('No metrics available');
      }

      const latestMetric = metrics.values[0];
      return latestMetric.value;
    }
  }

  throw new Error(`Service "${env.TARGET_SERVICE_NAME}" not found in environment`);
}
