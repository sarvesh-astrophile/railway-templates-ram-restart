export interface Environment {
  id: string;
  name: string;
  deployments: DeploymentConnection;
  serviceInstances: ServiceInstanceConnection;
}

export interface DeploymentConnection {
  edges: Array<{
    node: Deployment;
  }>;
}

export interface ServiceInstanceConnection {
  edges: Array<{
    node: ServiceInstance;
  }>;
}

export interface Deployment {
  id: string;
  status: string;
  environmentId: string;
}

export interface ServiceInstance {
  id: string;
  serviceId: string;
  startCommand: string | null;
  domains: {
    serviceDomains: Array<{
      domain: string;
    }>;
  };
}

export interface Service {
  name: string;
  deployments: DeploymentConnection;
}

export interface MetricsResult {
  measurement: string;
  values: Array<{
    ts: string;
    value: number;
  }>;
}

export interface RestartState {
  lastCheck: {
    timestamp: string;
    ramUsageGB: number;
    thresholdExceeded: boolean;
  } | null;
  lastRestart: {
    timestamp: string;
    reason: 'threshold' | 'scheduled';
    deploymentId: string;
  } | null;
}
