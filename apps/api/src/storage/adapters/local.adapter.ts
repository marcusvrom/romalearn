import { createHmac } from 'node:crypto';
import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { PutObjectInput, StorageAdapter, StoredObject } from '../storage.types';

export interface LocalAdapterOptions {
  directory: string;
  /** Base para montar as URLs (a API serve os arquivos em /api/files). */
  baseUrl: string;
  signingSecret: string;
}

/**
 * Armazenamento em disco para desenvolvimento sem MinIO.
 *
 * As "URLs assinadas" carregam um HMAC com expiração, verificado pelo
 * controller de arquivos — mesmo modelo de segurança do S3, em escala local.
 */
export class LocalStorageAdapter implements StorageAdapter {
  readonly name = 'local';

  constructor(private readonly options: LocalAdapterOptions) {}

  private resolve(key: string): string {
    // Impede que uma chave manipulada escape do diretório do storage.
    const normalized = path
      .normalize(key)
      .replace(/^(\.\.(\/|\\|$))+/, '')
      .replace(/^[/\\]+/, '');
    const full = path.resolve(this.options.directory, normalized);
    const root = path.resolve(this.options.directory);
    if (!full.startsWith(root + path.sep) && full !== root) {
      throw new Error('Caminho de arquivo inválido.');
    }
    return full;
  }

  async put(input: PutObjectInput): Promise<StoredObject> {
    const target = this.resolve(input.key);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, input.body);
    await fs.writeFile(`${target}.meta`, JSON.stringify({ contentType: input.contentType }));

    return { key: input.key, sizeBytes: input.body.length, contentType: input.contentType };
  }

  get(key: string): Promise<Buffer> {
    return fs.readFile(this.resolve(key));
  }

  async delete(key: string): Promise<void> {
    await fs.rm(this.resolve(key), { force: true });
    await fs.rm(`${this.resolve(key)}.meta`, { force: true });
  }

  async exists(key: string): Promise<boolean> {
    try {
      await fs.access(this.resolve(key));
      return true;
    } catch {
      return false;
    }
  }

  async contentType(key: string): Promise<string> {
    try {
      const raw = await fs.readFile(`${this.resolve(key)}.meta`, 'utf8');
      return (
        (JSON.parse(raw) as { contentType?: string }).contentType ?? 'application/octet-stream'
      );
    } catch {
      return 'application/octet-stream';
    }
  }

  async signedUrl(key: string, expiresInSeconds: number): Promise<string> {
    const expiresAt = Math.floor(Date.now() / 1000) + expiresInSeconds;
    const signature = this.sign(key, expiresAt);
    const query = new URLSearchParams({ key, expires: String(expiresAt), signature });
    return `${this.options.baseUrl.replace(/\/$/, '')}/files?${query.toString()}`;
  }

  publicUrl(key: string): string {
    return `${this.options.baseUrl.replace(/\/$/, '')}/files/public/${key}`;
  }

  sign(key: string, expiresAt: number): string {
    return createHmac('sha256', this.options.signingSecret)
      .update(`${key}:${expiresAt}`)
      .digest('hex');
  }

  verify(key: string, expiresAt: number, signature: string): boolean {
    if (!Number.isFinite(expiresAt) || expiresAt * 1000 < Date.now()) return false;
    const expected = this.sign(key, expiresAt);
    return expected.length === signature.length && expected === signature;
  }
}
