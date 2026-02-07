export interface RailwayResource {
  id: string;
  name: string;
}

export interface RailwayEnvironment {
  id: string;
  name: string;
  isEphemeral: boolean;
}

export interface RailwayService {
  id: string;
  name: string;
}

export interface RailwayDeployment {
  id: string;
}

export interface WebhookResource {
  workspace: RailwayResource;
  project: RailwayResource;
  environment: RailwayEnvironment;
  service: RailwayService;
  deployment: RailwayDeployment;
}

export interface ResourceAlertDetails {
  id: string;
  threshold: number;
  currentValue: number;
  unit: 'GB' | 'percent';
}

export type WebhookEventType = 'Resource.memory' | 'Resource.cpu' | 'Resource.disk';
export type WebhookSeverity = 'WARNING' | 'CRITICAL' | 'INFO';

export interface RailwayWebhookPayload {
  type: WebhookEventType;
  details: ResourceAlertDetails;
  resource: WebhookResource;
  severity: WebhookSeverity;
  timestamp: string;
}

export interface StoredEvent {
  id: string;
  type: WebhookEventType;
  serviceName: string;
  serviceId: string;
  deploymentId: string;
  severity: WebhookSeverity;
  currentValue: number;
  threshold: number;
  unit: string;
  actionTaken: 'restart_triggered' | 'logged_only' | 'ignored';
  timestamp: string;
  receivedAt: string;
}

export interface HealthStatus {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  uptime: number;
  eventsReceived: number;
  restartsTriggered: number;
}
