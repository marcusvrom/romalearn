import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { AppLogger } from './common/logger/app-logger.service';
import { AppConfig } from './config/configuration';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
    // Necessário para conferir a assinatura dos webhooks sobre o corpo bruto.
    rawBody: true,
  });

  const configService = app.get(ConfigService<AppConfig, true>);
  const appConfig = configService.get('app', { infer: true });
  const isProduction = configService.get('isProduction', { infer: true });
  const platform = configService.get('platform', { infer: true });

  app.useLogger(new AppLogger(appConfig.logLevel, !isProduction));

  // Confia no proxy reverso para obter o IP real (rate limit e auditoria).
  app.set('trust proxy', 1);

  app.use(cookieParser());
  app.use(
    helmet({
      // A API não serve HTML; a CSP relevante é a do front-end.
      contentSecurityPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      hsts: isProduction ? { maxAge: 31_536_000, includeSubDomains: true } : false,
    }),
  );

  // CORS restritivo: apenas as origens declaradas, com credenciais.
  app.enableCors({
    origin: appConfig.corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Correlation-Id'],
    exposedHeaders: ['X-Correlation-Id'],
    maxAge: 86_400,
  });

  app.setGlobalPrefix(appConfig.globalPrefix);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: false },
      // Detalhes de validação viram mensagens amigáveis no filtro de erros.
      stopAtFirstError: true,
    }),
  );

  app.enableShutdownHooks();

  if (appConfig.swaggerEnabled) {
    const document = SwaggerModule.createDocument(
      app,
      new DocumentBuilder()
        .setTitle(`${platform.name} API`)
        .setDescription(
          'API da plataforma de cursos: autenticação, catálogo, matrículas, ' +
            'progresso, questionários, pagamentos e certificados.',
        )
        .setVersion('0.1.0')
        .addCookieAuth('romalearn_at')
        .addBearerAuth()
        .build(),
    );
    SwaggerModule.setup(`${appConfig.globalPrefix}/docs`, app, document, {
      swaggerOptions: { persistAuthorization: true },
    });
  }

  await app.listen(appConfig.port, '0.0.0.0');

  // eslint-disable-next-line no-console
  console.log(
    JSON.stringify({
      message: `${platform.name} API no ar`,
      url: `http://localhost:${appConfig.port}/${appConfig.globalPrefix}`,
      docs: appConfig.swaggerEnabled
        ? `http://localhost:${appConfig.port}/${appConfig.globalPrefix}/docs`
        : 'desabilitado',
    }),
  );
}

void bootstrap();
