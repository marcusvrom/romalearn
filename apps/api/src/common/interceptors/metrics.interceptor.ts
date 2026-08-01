import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, tap } from 'rxjs';
import { MetricsService } from '../metrics/metrics.service';

/** Registra duração e status de cada requisição (log + métricas em memória). */
@Injectable()
export class MetricsInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  constructor(private readonly metrics: MetricsService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') return next.handle();

    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();
    const startedAt = process.hrtime.bigint();

    const record = (status: number) => {
      const durationMs = Number(process.hrtime.bigint() - startedAt) / 1_000_000;
      // Usa o padrão da rota (ex.: /courses/:slug) para não explodir a cardinalidade.
      const route = (request.route as { path?: string } | undefined)?.path ?? request.path;
      this.metrics.recordRequest(request.method, route, status, durationMs);
      this.logger.log({
        message: 'requisição concluída',
        method: request.method,
        route,
        status,
        durationMs: Math.round(durationMs * 100) / 100,
      });
    };

    return next.handle().pipe(
      tap({
        next: () => record(response.statusCode),
        error: (error: { status?: number }) => record(error?.status ?? 500),
      }),
    );
  }
}
