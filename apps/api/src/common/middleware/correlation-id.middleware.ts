import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { requestContext } from '../context/request-context';

export const CORRELATION_ID_HEADER = 'x-correlation-id';

/** Cria (ou reaproveita) o correlation id e o devolve na resposta. */
@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const incoming = req.headers[CORRELATION_ID_HEADER];
    const correlationId =
      typeof incoming === 'string' && incoming.length <= 64 ? incoming : randomUUID();

    res.setHeader(CORRELATION_ID_HEADER, correlationId);
    requestContext.run({ correlationId, ip: req.ip }, () => next());
  }
}
