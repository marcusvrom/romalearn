import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { serverRoutes } from './app.routes.server';
import { appConfig } from './app.config';
import { PLATFORM_CONFIG, defaultPlatformConfig } from './core/platform.config';

/**
 * Configuração usada na renderização no servidor (SSR).
 *
 * No servidor, as chamadas à API precisam de URL absoluta — o navegador
 * resolve `/api` sozinho, o Node não.
 */
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    {
      provide: PLATFORM_CONFIG,
      useValue: {
        ...defaultPlatformConfig,
        apiBaseUrl: process.env['API_INTERNAL_URL'] ?? 'http://localhost:3333/api',
        siteUrl: process.env['WEB_PUBLIC_URL'] ?? defaultPlatformConfig.siteUrl,
        name: process.env['PLATFORM_NAME'] ?? defaultPlatformConfig.name,
        legalName: process.env['PLATFORM_LEGAL_NAME'] ?? defaultPlatformConfig.legalName,
        supportEmail: process.env['PLATFORM_SUPPORT_EMAIL'] ?? defaultPlatformConfig.supportEmail,
      },
    },
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
