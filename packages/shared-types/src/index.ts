export type HealthCheck = {
  service: string;
  status: 'ok' | 'error';
  timestamp: string;
};
