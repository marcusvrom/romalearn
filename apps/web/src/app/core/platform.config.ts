import { InjectionToken } from '@angular/core';

/**
 * Identidade e endereços da plataforma em um único lugar.
 *
 * Nenhum componente escreve o nome da marca, cores ou URLs diretamente:
 * tudo vem daqui (e, em produção, das variáveis de ambiente injetadas no
 * build). Trocar de marca é trocar este arquivo.
 */
export interface PlatformConfig {
  name: string;
  legalName: string;
  tagline: string;
  supportEmail: string;
  apiBaseUrl: string;
  siteUrl: string;
  social: { label: string; url: string }[];
}

export const PLATFORM_CONFIG = new InjectionToken<PlatformConfig>('PLATFORM_CONFIG');

/** Porta da API em desenvolvimento (`API_PORT` no `.env`). */
const DEV_API_PORT = '3333';

/**
 * Endereço da API visto pelo navegador.
 *
 * Em produção o site e a API compartilham a origem, atrás de um reverse
 * proxy: `/api` basta. Em desenvolvimento cada um tem sua porta. O proxy do
 * `ng serve` cobre isso, mas ele é lido só na inicialização — um servidor já
 * em execução não o carrega. Falar direto com a API remove essa armadilha;
 * `localhost` é o mesmo site nas duas portas, então os cookies de sessão
 * continuam válidos, e o CORS da API já autoriza a origem do site.
 */
export function resolveApiBaseUrl(origin: string, devMode: boolean): string {
  if (!devMode || !origin) return '/api';

  try {
    const { protocol, hostname, port } = new URL(origin);
    // Já servido pela própria API (ou por um proxy na frente dela).
    if (port === DEV_API_PORT) return '/api';
    return `${protocol}//${hostname}:${DEV_API_PORT}/api`;
  } catch {
    return '/api';
  }
}

export const defaultPlatformConfig: PlatformConfig = {
  name: 'RomaLearn',
  legalName: 'RomaLearn Educação',
  tagline: 'Cursos e e-books profissionalizantes',
  supportEmail: 'suporte@romalearn.local',
  apiBaseUrl: '/api',
  siteUrl: 'http://localhost:4200',
  // Sem perfis oficiais confirmados, a lista fica vazia em vez de inventada.
  social: [],
};
