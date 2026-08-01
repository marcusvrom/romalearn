import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as path from 'node:path';
import { AppConfig } from '../config/configuration';
import { LocalStorageAdapter } from './adapters/local.adapter';
import { S3StorageAdapter } from './adapters/s3.adapter';
import { FilesController } from './files.controller';
import { StorageService } from './storage.service';
import { STORAGE_ADAPTER, StorageAdapter } from './storage.types';

@Global()
@Module({
  controllers: [FilesController],
  providers: [
    {
      provide: STORAGE_ADAPTER,
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig, true>): StorageAdapter => {
        const storage = configService.get('storage', { infer: true });
        const app = configService.get('app', { infer: true });
        const auth = configService.get('auth', { infer: true });

        if (storage.driver === 's3') {
          return new S3StorageAdapter({
            endpoint: storage.endpoint,
            region: storage.region,
            bucket: storage.bucket,
            accessKey: storage.accessKey,
            secretKey: storage.secretKey,
            forcePathStyle: storage.forcePathStyle,
            publicUrl: storage.publicUrl,
          });
        }

        return new LocalStorageAdapter({
          directory: path.resolve(process.cwd(), storage.localDirectory),
          baseUrl: `${app.apiPublicUrl}/${app.globalPrefix}`,
          // Reaproveita o segredo de acesso para assinar as URLs locais.
          signingSecret: auth.accessSecret,
        });
      },
    },
    StorageService,
  ],
  exports: [StorageService, STORAGE_ADAPTER],
})
export class StorageModule {}
