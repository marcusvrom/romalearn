import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import * as path from 'node:path';
import { AppConfig } from '../config/configuration';
import { DomainErrors } from '../common/errors/domain-error';
import { STORAGE_ADAPTER, StorageAdapter, StoredObject } from './storage.types';

/** Tipos aceitos por área. Nada fora desta lista entra no storage. */
export const ALLOWED_UPLOAD_TYPES: Record<string, string[]> = {
  material: [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/csv',
    'application/zip',
  ],
  image: ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'],
};

const EXTENSION_BY_TYPE: Record<string, string> = {
  'application/pdf': '.pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': '.docx',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
  'text/csv': '.csv',
  'application/zip': '.zip',
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
  'image/svg+xml': '.svg',
};

export interface UploadRequest {
  buffer: Buffer;
  originalName: string;
  mimeType: string;
  /** Pasta lógica dentro do bucket (ex.: `materials`, `covers`). */
  folder: string;
  category: keyof typeof ALLOWED_UPLOAD_TYPES;
  isPublic?: boolean;
}

@Injectable()
export class StorageService {
  constructor(
    @Inject(STORAGE_ADAPTER) private readonly adapter: StorageAdapter,
    private readonly configService: ConfigService<AppConfig, true>,
  ) {}

  private get config() {
    return this.configService.get('storage', { infer: true });
  }

  get driverName(): string {
    return this.adapter.name;
  }

  /**
   * Valida tamanho e tipo antes de gravar e gera uma chave nova.
   *
   * O nome enviado pelo usuário nunca vira caminho: usamos um UUID e a
   * extensão derivada do MIME aceito.
   */
  async upload(request: UploadRequest): Promise<StoredObject> {
    const { maxUploadBytes } = this.config;

    if (request.buffer.length === 0) {
      throw DomainErrors.uploadRejected('O arquivo está vazio.');
    }
    if (request.buffer.length > maxUploadBytes) {
      const limitMb = Math.floor(maxUploadBytes / (1024 * 1024));
      throw DomainErrors.uploadRejected(`O arquivo passa do limite de ${limitMb} MB.`);
    }

    const allowed = ALLOWED_UPLOAD_TYPES[request.category] ?? [];
    if (!allowed.includes(request.mimeType)) {
      throw DomainErrors.uploadRejected('Este tipo de arquivo não é aceito.');
    }

    const extension =
      EXTENSION_BY_TYPE[request.mimeType] ??
      path.extname(request.originalName).toLowerCase().slice(0, 8);

    const prefix = request.isPublic ? 'public/' : '';
    const key = `${prefix}${request.folder}/${randomUUID()}${extension}`;

    return this.adapter.put({
      key,
      body: request.buffer,
      contentType: request.mimeType,
      isPublic: request.isPublic,
    });
  }

  /** Grava um arquivo gerado pelo sistema (ex.: PDF de certificado). */
  putGenerated(key: string, body: Buffer, contentType: string): Promise<StoredObject> {
    return this.adapter.put({ key, body, contentType });
  }

  get(key: string): Promise<Buffer> {
    return this.adapter.get(key);
  }

  exists(key: string): Promise<boolean> {
    return this.adapter.exists(key);
  }

  delete(key: string): Promise<void> {
    return this.adapter.delete(key);
  }

  /** URL temporária. Objetos sob `public/` recebem URL direta. */
  async urlFor(key: string): Promise<{ url: string; expiresAt: Date | null }> {
    if (key.startsWith('public/')) {
      return { url: this.adapter.publicUrl(key), expiresAt: null };
    }

    const ttl = this.config.signedUrlTtlSeconds;
    return {
      url: await this.adapter.signedUrl(key, ttl),
      expiresAt: new Date(Date.now() + ttl * 1000),
    };
  }
}
