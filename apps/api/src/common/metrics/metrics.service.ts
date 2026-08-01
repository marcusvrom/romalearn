import { Injectable } from '@nestjs/common';

interface RouteMetric {
  count: number;
  errors: number;
  totalDurationMs: number;
  maxDurationMs: number;
}

/**
 * Métricas básicas de requisição mantidas em memória e expostas em
 * `/health/metrics`. Suficiente para operar o MVP; um exportador Prometheus
 * pode substituir esta classe sem alterar os chamadores.
 */
@Injectable()
export class MetricsService {
  private readonly startedAt = Date.now();
  private readonly routes = new Map<string, RouteMetric>();

  recordRequest(method: string, route: string, status: number, durationMs: number): void {
    const key = `${method} ${route}`;
    const metric = this.routes.get(key) ?? {
      count: 0,
      errors: 0,
      totalDurationMs: 0,
      maxDurationMs: 0,
    };

    metric.count += 1;
    metric.totalDurationMs += durationMs;
    metric.maxDurationMs = Math.max(metric.maxDurationMs, durationMs);
    if (status >= 400) metric.errors += 1;

    this.routes.set(key, metric);
  }

  snapshot() {
    const routes = [...this.routes.entries()].map(([key, metric]) => ({
      route: key,
      count: metric.count,
      errors: metric.errors,
      avgDurationMs: Math.round((metric.totalDurationMs / metric.count) * 100) / 100,
      maxDurationMs: Math.round(metric.maxDurationMs * 100) / 100,
    }));

    return {
      uptimeSeconds: Math.round((Date.now() - this.startedAt) / 1000),
      totalRequests: routes.reduce((sum, route) => sum + route.count, 0),
      totalErrors: routes.reduce((sum, route) => sum + route.errors, 0),
      routes: routes.sort((a, b) => b.count - a.count),
    };
  }
}
