import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';
import { currentCorrelationId } from '../context/request-context';
import { DomainError } from '../errors/domain-error';

/**
 * Tratamento centralizado de erros.
 *
 * Sempre devolve o mesmo formato (`ApiErrorResponse`) com mensagem em
 * português. Detalhes internos (SQL, stack) ficam apenas no log.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const correlationId = currentCorrelationId();

    const { status, error, message, details } = this.describe(exception);

    if (status >= HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error({
        message: 'Erro não tratado',
        path: request.url,
        method: request.method,
        status,
        detail: exception instanceof Error ? exception.message : String(exception),
        stack: exception instanceof Error ? exception.stack : undefined,
      });
    } else {
      this.logger.warn({
        message: 'Requisição recusada',
        path: request.url,
        method: request.method,
        status,
        error,
      });
    }

    response.status(status).json({
      statusCode: status,
      error,
      message,
      correlationId,
      ...(details ? { details } : {}),
    });
  }

  private describe(exception: unknown): {
    status: number;
    error: string;
    message: string;
    details?: Record<string, string[]>;
  } {
    if (exception instanceof DomainError) {
      return { status: exception.status, error: exception.code, message: exception.message };
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const payload = exception.getResponse();

      if (typeof payload === 'string') {
        return { status, error: exception.name, message: payload };
      }

      const body = payload as Record<string, unknown>;
      const rawMessage = body.message;

      // Erros do ValidationPipe chegam como lista de mensagens.
      if (Array.isArray(rawMessage)) {
        return {
          status,
          error: 'VALIDATION_ERROR',
          message: 'Confira os campos destacados e tente novamente.',
          details: { _: rawMessage.map(String) },
        };
      }

      return {
        status,
        error: typeof body.error === 'string' ? body.error : exception.name,
        message: typeof rawMessage === 'string' ? rawMessage : 'Não foi possível concluir a ação.',
      };
    }

    // Violação de unicidade no banco — não vaza a query nem o nome do índice.
    if (
      exception instanceof QueryFailedError &&
      (exception as { code?: string }).code === '23505'
    ) {
      return {
        status: HttpStatus.CONFLICT,
        error: 'ALREADY_EXISTS',
        message: 'Este registro já existe.',
      };
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'INTERNAL_ERROR',
      message: 'Ocorreu um erro inesperado. Tente novamente em alguns instantes.',
    };
  }
}
