import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { PlatformSettingsDto } from '@romalearn/contracts';
import { Repository } from 'typeorm';
import { AppConfig } from '../config/configuration';
import { PlatformSetting, SETTING_KEYS } from './entities/platform-setting.entity';

/**
 * Configurações institucionais.
 *
 * O padrão vem do ambiente; o painel administrativo pode sobrescrever cada
 * chave sem alterar código nem reiniciar a aplicação.
 */
@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(PlatformSetting)
    private readonly settings: Repository<PlatformSetting>,
    private readonly configService: ConfigService<AppConfig, true>,
  ) {}

  async getAll(): Promise<PlatformSettingsDto> {
    const platform = this.configService.get('platform', { infer: true });
    const legal = this.configService.get('legal', { infer: true });
    const stored = await this.settings.find();
    const map = new Map(stored.map((setting) => [setting.key, setting.value]));

    const read = <T>(key: string, fallback: T): T =>
      map.has(key) ? (map.get(key) as T) : fallback;

    return {
      platformName: read(SETTING_KEYS.PLATFORM_NAME, platform.name),
      legalName: read(SETTING_KEYS.LEGAL_NAME, platform.legalName),
      supportEmail: read(SETTING_KEYS.SUPPORT_EMAIL, platform.supportEmail),
      certificateIssuer: read(SETTING_KEYS.CERTIFICATE_ISSUER, platform.certificateIssuer),
      termsVersion: read(SETTING_KEYS.TERMS_VERSION, legal.termsVersion),
      privacyVersion: read(SETTING_KEYS.PRIVACY_VERSION, legal.privacyVersion),
      // Depoimentos ficam desligados até existirem depoimentos reais.
      testimonialsEnabled: read(SETTING_KEYS.TESTIMONIALS_ENABLED, false),
    };
  }

  async update(patch: Partial<PlatformSettingsDto>): Promise<PlatformSettingsDto> {
    const keyByField: Record<keyof PlatformSettingsDto, string> = {
      platformName: SETTING_KEYS.PLATFORM_NAME,
      legalName: SETTING_KEYS.LEGAL_NAME,
      supportEmail: SETTING_KEYS.SUPPORT_EMAIL,
      certificateIssuer: SETTING_KEYS.CERTIFICATE_ISSUER,
      termsVersion: SETTING_KEYS.TERMS_VERSION,
      privacyVersion: SETTING_KEYS.PRIVACY_VERSION,
      testimonialsEnabled: SETTING_KEYS.TESTIMONIALS_ENABLED,
    };

    for (const [field, value] of Object.entries(patch)) {
      if (value === undefined) continue;
      const key = keyByField[field as keyof PlatformSettingsDto];
      if (!key) continue;

      const existing = await this.settings.findOne({ where: { key } });
      if (existing) {
        existing.value = value;
        await this.settings.save(existing);
      } else {
        await this.settings.save(this.settings.create({ key, value }));
      }
    }

    return this.getAll();
  }

  /** Nome do emissor gravado no certificado no momento da emissão. */
  async certificateIssuer(): Promise<{ issuerName: string; issuerLegalName: string }> {
    const settings = await this.getAll();
    return { issuerName: settings.certificateIssuer, issuerLegalName: settings.legalName };
  }
}
