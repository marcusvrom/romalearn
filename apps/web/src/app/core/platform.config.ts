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
