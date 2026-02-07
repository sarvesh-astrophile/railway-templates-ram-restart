import { createFetcher, createSchema } from 'gqtx';
import { env } from '../config/env.js';
import { RAILWAY_GRAPHQL_ENDPOINT } from '../config/constants.js';
import type { Environment, Service, MetricsResult } from '../types/index.js';

const fetcher = createFetcher({
  url: RAILWAY_GRAPHQL_ENDPOINT,
  headers: {
    Authorization: `Bearer ${env.RAILWAY_API_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

const t = createSchema();

// GraphQL Types
const EnvironmentNode = t.objectType({
  name: 'Environment',
  fields: () => [
    t.field({ name: 'id', type: t.NonNull(t.String) }),
    t.field({ name: 'name', type: t.NonNull(t.String) }),
    t.field({ name: 'deployments', type: DeploymentConnection }),
    t.field({ name: 'serviceInstances', type: ServiceInstanceConnection }),
  ],
});

const DeploymentConnection = t.objectType({
  name: 'DeploymentConnection',
  fields: () => [
    t.field({
      name: 'edges',
      type: t.NonNull(t.List(t.NonNull(DeploymentEdge))),
    }),
  ],
});

const DeploymentEdge = t.objectType({
  name: 'DeploymentEdge',
  fields: () => [
    t.field({ name: 'node', type: t.NonNull(DeploymentNode) }),
  ],
});

const DeploymentNode = t.objectType({
  name: 'Deployment',
  fields: () => [
    t.field({ name: 'id', type: t.NonNull(t.String) }),
    t.field({ name: 'status', type: t.NonNull(t.String) }),
    t.field({ name: 'environmentId', type: t.NonNull(t.String) }),
  ],
});

const ServiceInstanceConnection = t.objectType({
  name: 'ServiceInstanceConnection',
  fields: () => [
    t.field({
      name: 'edges',
      type: t.NonNull(t.List(t.NonNull(ServiceInstanceEdge))),
    }),
  ],
});

const ServiceInstanceEdge = t.objectType({
  name: 'ServiceInstanceEdge',
  fields: () => [
    t.field({ name: 'node', type: t.NonNull(ServiceInstanceNode) }),
  ],
});

const ServiceInstanceNode = t.objectType({
  name: 'ServiceInstance',
  fields: () => [
    t.field({ name: 'id', type: t.NonNull(t.String) }),
    t.field({ name: 'serviceId', type: t.NonNull(t.String) }),
    t.field({ name: 'startCommand', type: t.Nullable(t.String) }),
  ],
});

const ServiceNode = t.objectType({
  name: 'Service',
  fields: () => [
    t.field({ name: 'name', type: t.NonNull(t.String) }),
    t.field({ name: 'deployments', type: DeploymentConnection }),
  ],
});

const MetricsResultNode = t.objectType({
  name: 'MetricsResult',
  fields: () => [
    t.field({ name: 'measurement', type: t.NonNull(t.String) }),
    t.field({ name: 'values', type: t.NonNull(t.List(t.NonNull(MetricValue))) }),
  ],
});

const MetricValue = t.objectType({
  name: 'MetricValue',
  fields: () => [
    t.field({ name: 'ts', type: t.NonNull(t.String) }),
    t.field({ name: 'value', type: t.NonNull(t.Float) }),
  ],
});

// Queries
const environmentsQuery = t.query({
  name: 'environments',
  args: {
    projectId: t.arg.nonNull(t.String),
  },
  type: t.NonNull(t.List(t.NonNull(EnvironmentNode))),
  resolve: async (_args, { projectId }) => {
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

    const result = await fetcher({
      query,
      variables: { projectId },
    });

    return result.data.environments.edges.map((edge: { node: Environment }) => edge.node);
  },
});

const serviceQuery = t.query({
  name: 'service',
  args: {
    id: t.arg.nonNull(t.String),
  },
  type: ServiceNode,
  resolve: async (_args, { id }) => {
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

    const result = await fetcher({
      query,
      variables: { id },
    });

    return result.data.service;
  },
});

const metricsQuery = t.query({
  name: 'metrics',
  args: {
    projectId: t.arg.nonNull(t.String),
    serviceId: t.arg.nonNull(t.String),
    environmentId: t.arg.nonNull(t.String),
    startDate: t.arg.nonNull(t.String),
  },
  type: t.NonNull(MetricsResultNode),
  resolve: async (_args, { projectId, serviceId, environmentId, startDate }) => {
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

    const result = await fetcher({
      query,
      variables: { projectId, serviceId, environmentId, startDate },
    });

    return result.data.metrics;
  },
});

// Mutations
const deploymentRestartMutation = t.mutation({
  name: 'deploymentRestart',
  args: {
    id: t.arg.nonNull(t.String),
  },
  type: t.NonNull(t.String),
  resolve: async (_args, { id }) => {
    const mutation = `
      mutation deploymentRestart($id: String!) {
        deploymentRestart(id: $id)
      }
    `;

    const result = await fetcher({
      query: mutation,
      variables: { id },
    });

    return result.data.deploymentRestart;
  },
});

// Export functions
export async function getEnvironments(): Promise<Environment[]> {
  return await environmentsQuery.resolve({}, { projectId: env.RAILWAY_PROJECT_ID });
}

export async function getService(serviceId: string): Promise<Service> {
  return await serviceQuery.resolve({}, { id: serviceId });
}

export async function getMetrics(
  projectId: string,
  serviceId: string,
  environmentId: string
): Promise<MetricsResult> {
  const startDate = new Date().toISOString();
  return await metricsQuery.resolve({}, { projectId, serviceId, environmentId, startDate });
}

export async function restartDeployment(deploymentId: string): Promise<string> {
  return await deploymentRestartMutation.resolve({}, { id: deploymentId });
}
