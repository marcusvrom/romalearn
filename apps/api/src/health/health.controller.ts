import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Public } from '../common/decorators/public.decorator';
import { MetricsService } from '../common/metrics/metrics.service';

@ApiTags('Operação')
@Controller('health')
export class HealthController {
  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private readonly metrics: MetricsService,
  ) {}

  /** Liveness: o processo está de pé? Não toca em dependências externas. */
  @Public()
  @Get('live')
  @ApiOperation({ summary: 'Verifica se o processo está no ar.' })
  live() {
    return { status: 'ok', uptimeSeconds: Math.round(process.uptime()) };
  }

  /** Readiness: dá para receber tráfego? Confere o banco. */
  @Public()
  @Get('ready')
  @ApiOperation({ summary: 'Verifica se as dependências estão disponíveis.' })
  async ready() {
    const checks: Record<string, { status: 'ok' | 'error'; detail?: string }> = {};

    try {
      await this.dataSource.query('SELECT 1');
      checks.database = { status: 'ok' };
    } catch (error) {
      checks.database = {
        status: 'error',
        detail: error instanceof Error ? error.message : 'indisponível',
      };
    }

    const healthy = Object.values(checks).every((check) => check.status === 'ok');
    return { status: healthy ? 'ok' : 'degraded', checks };
  }

  @Public()
  @Get('metrics')
  @ApiOperation({ summary: 'Métricas básicas de requisição.' })
  metricsSnapshot() {
    return this.metrics.snapshot();
  }
}
