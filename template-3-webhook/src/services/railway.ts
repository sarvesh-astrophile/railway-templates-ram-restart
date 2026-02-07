import { createFetcher } from 'gqtx';
import { env } from '../config/env.js';
import { RAILWAY_GRAPHQL_ENDPOINT } from '../config/constants.js';

const fetcher = createFetcher({
  url: RAILWAY_GRAPHQL_ENDPOINT,
  headers: {
    Authorization: `Bearer ${env.RAILWAY_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

export async function restartDeployment(deploymentId: string): Promise<string> {
  const mutation = `
    mutation deploymentRestart($id: String!) {
      deploymentRestart(id: $id)
    }
  `;

  const result = await fetcher({
    query: mutation,
    variables: { id: deploymentId },
  });

  return result.data.deploymentRestart;
}
