import { GraphQLClient } from 'graphql-request';
import { env } from '../config/env.js';
import { RAILWAY_GRAPHQL_ENDPOINT } from '../config/constants.js';
import type { Environment, Service, MetricsResult } from '../types/index.js';

const client = new GraphQLClient(RAILWAY_GRAPHQL_ENDPOINT, {
  headers: {
    Authorization: `Bearer ${env.RAILWAY_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

interface EnvironmentsResponse {
  environments: {
    edges: Array<{
      node: Environment;
    }>;
  };
}

interface ServiceResponse {
  service: Service;
}

interface MetricsResponse {
  metrics: MetricsResult;
}

interface DeploymentRestartResponse {
  deploymentRestart: string;
}

export async function getEnvironments(): Promise<Environment[]> {
  const query = `
    query environments($projectId: String!) {
      environments(projectId: $projectId) {
        edges {
          node {
            id
            name
            deployments {
              edges {
                node {
                  id
                  status
                  environmentId
                }
              }
            }
            serviceInstances {
              edges {
                node {
                  id
                  serviceId
                  startCommand
                }
              }
            }
          }
        }
      }
    }
  `;

  const result = await client.request<EnvironmentsResponse>(query, {
    projectId: env.RAILWAY_PROJECT_ID,
  });

  return result.environments.edges.map((edge) => edge.node);
}

export async function getService(serviceId: string): Promise<Service> {
  const query = `
    query service($id: String!) {
      service(id: $id) {
        name
        deployments {
          edges {
            node {
              id
              status
              environmentId
            }
          }
        }
      }
    }
  `;

  const result = await client.request<ServiceResponse>(query, { id: serviceId });
  return result.service;
}

export async function getMetrics(
  projectId: string,
  serviceId: string,
  environmentId: string
): Promise<MetricsResult> {
  const query = `
    query metrics($startDate: DateTime!, $projectId: String!, $serviceId: String! = "", $environmentId: String = "") {
      metrics(
        projectId: $projectId
        measurements: MEMORY_USAGE_GB
        startDate: $startDate
        serviceId: $serviceId
        environmentId: $environmentId
      ) {
        values {
          ts
          value
        }
        measurement
      }
    }
  `;

  const startDate = new Date().toISOString();
  const result = await client.request<MetricsResponse>(query, {
    projectId,
    serviceId,
    environmentId,
    startDate,
  });

  // Railway returns metrics as an array, extract first element
  const metrics = Array.isArray(result.metrics) ? result.metrics[0] : result.metrics;
  return metrics;
}

export async function restartDeployment(deploymentId: string): Promise<string> {
  const mutation = `
    mutation deploymentRestart($id: String!) {
      deploymentRestart(id: $id)
    }
  `;

  const result = await client.request<DeploymentRestartResponse>(mutation, {
    id: deploymentId,
  });

  return result.deploymentRestart;
}
