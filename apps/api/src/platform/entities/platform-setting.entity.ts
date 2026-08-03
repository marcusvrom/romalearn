import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../database/base.entity';

/**
 * Configurações institucionais editáveis pelo painel administrativo.
 * O valor padrão vem das variáveis de ambiente; o que estiver aqui prevalece.
 */
@Entity('platform_settings')
export class PlatformSetting extends BaseEntity {
  @Index('idx_platform_settings_key', { unique: true })
  @Column({ type: 'varchar', length: 80 })
  key: string;

  @Column({ type: 'jsonb' })
  value: unknown;

  @Column({ type: 'varchar', length: 255, default: '' })
  description: string;
}

export const SETTING_KEYS = {
  PLATFORM_NAME: 'platform.name',
  LEGAL_NAME: 'platform.legalName',
  SUPPORT_EMAIL: 'platform.supportEmail',
  CERTIFICATE_ISSUER: 'platform.certificateIssuer',
  TERMS_VERSION: 'legal.termsVersion',
  PRIVACY_VERSION: 'legal.privacyVersion',
  /** Depoimentos só aparecem no site quando forem reais e habilitados aqui. */
  TESTIMONIALS_ENABLED: 'landing.testimonialsEnabled',
} as const;
