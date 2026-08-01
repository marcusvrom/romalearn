import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { NestExpressApplication } from '@nestjs/platform-express';
import cookieParser from 'cookie-parser';
import { DataSource } from 'typeorm';
import { AppModule } from '../../src/app.module';
import { AllExceptionsFilter } from '../../src/common/filters/all-exceptions.filter';
import { SeedService } from '../../src/database/seeds/seed.service';

export interface TestContext {
  app: INestApplication;
  dataSource: DataSource;
  /** Prefixo das rotas, igual ao da aplicação real. */
  prefix: string;
}

/**
 * Sobe a aplicação real (mesmos guards, pipes e filtros) contra o banco de
 * testes, aplicando as migrations em um schema limpo.
 */
export async function createTestApp(options: { seed?: boolean } = {}): Promise<TestContext> {
  const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();

  const app = moduleRef.createNestApplication<NestExpressApplication>({ rawBody: true });
  app.use(cookieParser());
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      stopAtFirstError: true,
    }),
  );
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.init();

  const dataSource = app.get(DataSource);
  await resetDatabase(dataSource);

  if (options.seed !== false) {
    await new SeedService(dataSource).run({
      adminEmail: 'admin@teste.local',
      adminPassword: 'AdminTeste@123',
      adminName: 'Administrador de Teste',
      demoStudent: false,
      demoStudentEmail: 'aluno@teste.local',
      demoStudentPassword: 'AlunoTeste@123',
      isProduction: false,
    });
  }

  return { app, dataSource, prefix: '/api' };
}

/** Zera o schema e reaplica as migrations — garante testes independentes. */
export async function resetDatabase(dataSource: DataSource): Promise<void> {
  await dataSource.query('DROP SCHEMA IF EXISTS public CASCADE');
  await dataSource.query('CREATE SCHEMA public');
  await dataSource.runMigrations();
}

export async function closeTestApp(context: TestContext): Promise<void> {
  await context.app.close();
}
