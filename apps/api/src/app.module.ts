import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as path from 'node:path';
import { AssessmentModule } from './assessment/assessment.module';
import { AdminModule } from './admin/admin.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RolesGuard } from './auth/guards/roles.guard';
import { CatalogModule } from './catalog/catalog.module';
import { CertificatesModule } from './certificates/certificates.module';
import { CommerceModule } from './commerce/commerce.module';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { MetricsInterceptor } from './common/interceptors/metrics.interceptor';
import { CorrelationIdMiddleware } from './common/middleware/correlation-id.middleware';
import { AppConfig, configuration } from './config/configuration';
import { ENTITIES } from './database/entities';
import { MIGRATIONS } from './database/migrations';
import { HealthModule } from './health/health.module';
import { LearningModule } from './learning/learning.module';
import { MailModule } from './mail/mail.module';
import { PlatformModule } from './platform/platform.module';
import { StorageModule } from './storage/storage.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      // O .env fica na raiz do monorepo e vale para API e web.
      envFilePath: [path.resolve(process.cwd(), '../../.env'), path.resolve(process.cwd(), '.env')],
      cache: true,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig, true>) => {
        const database = configService.get('database', { infer: true });
        return {
          type: 'postgres' as const,
          host: database.host,
          port: database.port,
          username: database.username,
          password: database.password,
          database: database.database,
          ssl: database.ssl ? { rejectUnauthorized: false } : false,
          entities: ENTITIES,
          migrations: MIGRATIONS,
          // Schema só muda por migration versionada.
          synchronize: false,
          autoLoadEntities: false,
          logging: ['error'],
        };
      },
    }),
    ThrottlerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig, true>) => {
        const rateLimit = configService.get('rateLimit', { infer: true });
        return {
          // Limitador global. As rotas de credenciais aplicam um teto menor
          // por meio de @Throttle (ver auth.controller.ts).
          throttlers: [
            { name: 'default', ttl: rateLimit.ttlSeconds * 1000, limit: rateLimit.limit },
          ],
        };
      },
    }),
    HealthModule,
    PlatformModule,
    MailModule,
    StorageModule,
    UsersModule,
    AuthModule,
    CatalogModule,
    LearningModule,
    AssessmentModule,
    CommerceModule,
    CertificatesModule,
    AdminModule,
  ],
  providers: [
    // A ordem importa: autentica, aplica limite, então autoriza por papel.
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: RolesGuard },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
    { provide: APP_INTERCEPTOR, useClass: MetricsInterceptor },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CorrelationIdMiddleware).forRoutes('*');
  }
}
