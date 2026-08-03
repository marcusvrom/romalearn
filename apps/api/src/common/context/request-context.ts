import { AsyncLocalStorage } from 'node:async_hooks';

export interface RequestContextStore {
  correlationId: string;
  userId?: string;
  ip?: string;
}

/**
 * Contexto por requisição. Permite que logs e auditoria enxerguem o
 * correlation id sem precisar passá-lo por todas as camadas.
 */
export const requestContext = new AsyncLocalStorage<RequestContextStore>();

export function currentCorrelationId(): string | undefined {
  return requestContext.getStore()?.correlationId;
}
