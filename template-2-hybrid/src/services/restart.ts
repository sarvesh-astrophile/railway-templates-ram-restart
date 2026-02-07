import { getEnvironments, getService, restartDeployment } from './railway.js';
import { env } from '../config/env.js';
import type { Environment } from '../types/index.js';

export async function restartService(): Promise<{ deploymentId: string }> {
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
      const deployment = service.deployments.edges.find(
        (edge) => edge.node.environmentId === env.RAILWAY_ENVIRONMENT_ID
      );

      if (!deployment) {
        throw new Error(`No deployment found for environment "${env.RAILWAY_ENVIRONMENT_ID}"`);
      }

      await restartDeployment(deployment.node.id);
      return { deploymentId: deployment.node.id };
    }
  }

  throw new Error(`Service "${env.TARGET_SERVICE_NAME}" not found in environment`);
}
