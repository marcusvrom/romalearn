export interface StoredObject {
  key: string;
  sizeBytes: number;
  contentType: string;
}

export interface PutObjectInput {
  key: string;
  body: Buffer;
  contentType: string;
  /** Objetos públicos ficam sob o prefixo `public/` e dispensam assinatura. */
  isPublic?: boolean;
}

/**
 * Contrato de armazenamento. O adapter S3 atende MinIO local, AWS S3 e
 * qualquer serviço compatível; o adapter local existe para desenvolvimento
 * sem contêineres.
 */
export interface StorageAdapter {
  readonly name: string;
  put(input: PutObjectInput): Promise<StoredObject>;
  get(key: string): Promise<Buffer>;
  delete(key: string): Promise<void>;
  exists(key: string): Promise<boolean>;
  /** URL temporária para arquivos privados. */
  signedUrl(key: string, expiresInSeconds: number): Promise<string>;
  publicUrl(key: string): string;
}

export const STORAGE_ADAPTER = Symbol('STORAGE_ADAPTER');
