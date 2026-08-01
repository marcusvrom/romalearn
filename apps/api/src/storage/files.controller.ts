import { Controller, Get, Inject, Param, Query, Res } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Response } from 'express';
import { Public } from '../common/decorators/public.decorator';
import { DomainErrors } from '../common/errors/domain-error';
import { LocalStorageAdapter } from './adapters/local.adapter';
import { STORAGE_ADAPTER, StorageAdapter } from './storage.types';

/**
 * Serve arquivos do adapter local. Só existe no modo `STORAGE_DRIVER=local`;
 * com S3/MinIO os arquivos são entregues pelo próprio storage.
 */
@ApiExcludeController()
@Controller('files')
export class FilesController {
  constructor(@Inject(STORAGE_ADAPTER) private readonly adapter: StorageAdapter) {}

  private get local(): LocalStorageAdapter {
    if (!(this.adapter instanceof LocalStorageAdapter)) {
      throw DomainErrors.notFound('Rota disponível apenas com armazenamento local.');
    }
    return this.adapter;
  }

  /** Download privado — exige assinatura HMAC válida e não expirada. */
  @Public()
  @Get()
  async signed(
    @Query('key') key: string,
    @Query('expires') expires: string,
    @Query('signature') signature: string,
    @Res() response: Response,
  ): Promise<void> {
    const local = this.local;

    if (!key || !expires || !signature || !local.verify(key, Number(expires), signature)) {
      throw DomainErrors.forbidden('Link expirado ou inválido. Recarregue a página.');
    }

    await this.stream(key, response);
  }

  /** Objetos sob `public/` são abertos por definição (capas, imagens). */
  @Public()
  @Get('public/*path')
  async publicFile(@Param('path') segments: string[] | string, @Res() response: Response) {
    const relative = Array.isArray(segments) ? segments.join('/') : segments;
    await this.stream(`public/${relative}`, response);
  }

  private async stream(key: string, response: Response): Promise<void> {
    const local = this.local;

    if (!(await local.exists(key))) {
      throw DomainErrors.notFound('Arquivo não encontrado.');
    }

    const buffer = await local.get(key);
    response.setHeader('Content-Type', await local.contentType(key));
    response.setHeader('Content-Length', buffer.length);
    response.setHeader('X-Content-Type-Options', 'nosniff');
    response.send(buffer);
  }
}
