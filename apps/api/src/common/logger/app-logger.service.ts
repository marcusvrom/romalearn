import { ConsoleLogger, Injectable, LoggerService, Scope } from '@nestjs/common';
import { requestContext } from '../context/request-context';

const LEVELS = ['debug', 'verbose', 'log', 'warn', 'error'] as const;
type Level = (typeof LEVELS)[number];

/**
 * Logger em JSON com correlation id.
 *
 * Regra de privacidade: nunca registre senha, hash, token, cookie ou payload
 * de cartão. Use `redact()` antes de logar objetos vindos de requisições.
 */
@Injectable({ scope: Scope.DEFAULT })
export class AppLogger extends ConsoleLogger implements LoggerService {
  private readonly minLevelIndex: number;
  private readonly pretty: boolean;

  constructor(minLevel: string = 'info', pretty = false) {
    super();
    const normalized = minLevel === 'info' ? 'log' : minLevel;
    const index = LEVELS.indexOf(normalized as Level);
    this.minLevelIndex = index === -1 ? LEVELS.indexOf('log') : index;
    this.pretty = pretty;
  }

  override log(message: unknown, context?: string) {
    this.write('log', message, context);
  }

  override error(message: unknown, stack?: string, context?: string) {
    this.write('error', message, context, stack);
  }

  override warn(message: unknown, context?: string) {
    this.write('warn', message, context);
  }

  override debug(message: unknown, context?: string) {
    this.write('debug', message, context);
  }

  override verbose(message: unknown, context?: string) {
    this.write('verbose', message, context);
  }

  private write(level: Level, message: unknown, context?: string, stack?: string) {
    if (LEVELS.indexOf(level) < this.minLevelIndex) return;

    const store = requestContext.getStore();
    const entry: Record<string, unknown> = {
      timestamp: new Date().toISOString(),
      level,
      context: context ?? this.context,
      correlationId: store?.correlationId,
      userId: store?.userId,
      ...(typeof message === 'object' && message !== null
        ? (message as Record<string, unknown>)
        : { message }),
    };
    if (stack) entry.stack = stack;

    const line = this.pretty
      ? `${entry.timestamp} ${level.toUpperCase()} [${entry.context ?? '-'}] ${
          typeof message === 'string' ? message : JSON.stringify(message)
        }${stack ? `\n${stack}` : ''}`
      : JSON.stringify(entry);

    if (level === 'error') process.stderr.write(`${line}\n`);
    else process.stdout.write(`${line}\n`);
  }
}

const SENSITIVE_KEYS = [
  'password',
  'currentpassword',
  'newpassword',
  'passwordconfirmation',
  'passwordhash',
  'token',
  'accesstoken',
  'refreshtoken',
  'tokenhash',
  'authorization',
  'cookie',
  'secret',
  'apikey',
  'accesskey',
  'secretkey',
  'cardnumber',
  'cvv',
  'cpf',
];

/** Substitui valores sensíveis por `[REDACTED]` antes de qualquer log. */
export function redact<T>(value: T): T {
  if (Array.isArray(value)) return value.map((item) => redact(item)) as unknown as T;
  if (value === null || typeof value !== 'object') return value;

  const result: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
    result[key] = SENSITIVE_KEYS.includes(key.toLowerCase()) ? '[REDACTED]' : redact(item);
  }
  return result as T;
}
