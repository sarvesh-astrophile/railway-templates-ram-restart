import { restartDeployment } from './railway.js';

export async function restartService(serviceId: string, deploymentId: string): Promise<{ deploymentId: string }> {
  await restartDeployment(deploymentId);
  return { deploymentId };
}
