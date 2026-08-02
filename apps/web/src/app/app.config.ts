import { provideHttpClient, withFetch } from '@angular/common/http';
import { ApplicationConfig, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling, withRouterConfig } from '@angular/router';
import { routes } from './app.routes';
import { PLATFORM_CONFIG, defaultPlatformConfig, resolveApiBaseUrl } from './core/platform.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      // Ao trocar de página, volta ao topo; âncoras continuam funcionando.
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' }),
      withRouterConfig({ paramsInheritanceStrategy: 'always' }),
    ),
    provideHttpClient(withFetch()),
    provideClientHydration(withEventReplay()),
    {
      provide: PLATFORM_CONFIG,
      // No SSR esta configuração é substituída por `app.config.server.ts`,
      // que usa a URL interna da API.
      useFactory: () => ({
        ...defaultPlatformConfig,
        apiBaseUrl: resolveApiBaseUrl(
          typeof location === 'undefined' ? '' : location.origin,
          isDevMode(),
        ),
      }),
    },
  ],
};
