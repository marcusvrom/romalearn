import { Global, Module } from '@nestjs/common';
import { MetricsService } from '../common/metrics/metrics.service';
import { HealthController } from './health.controller';

@Global()
@Module({
  controllers: [HealthController],
  providers: [MetricsService],
  exports: [MetricsService],
})
export class HealthModule {}
