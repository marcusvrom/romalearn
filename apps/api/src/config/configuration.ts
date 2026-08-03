/**
 * Toda a configuração da API vem de variáveis de ambiente e é lida aqui.
 * Nenhum outro arquivo deve acessar `process.env` diretamente.
 */

function str(key: string, fallback = ''): string {
  const value = process.env[key];
  return value === undefined || value === '' ? fallback : value;
}

function num(key: string, fallback: number): number {
  const parsed = Number(process.env[key]);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function bool(key: string, fallback: boolean): boolean {
  const value = process.env[key];
  if (value === undefined || value === '') return fallback;
  return ['1', 'true', 'yes', 'on'].includes(value.toLowerCase());
}

function list(key: string, fallback: string[] = []): string[] {
  const value = str(key);
  if (!value) return fallback;
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

export type AppConfig = ReturnType<typeof configuration>;

export const configuration = () => {
  const nodeEnv = str('NODE_ENV', 'development');
  const isProduction = nodeEnv === 'production';
  const isTest = nodeEnv === 'test';

  return {
    nodeEnv,
    isProduction,
    isTest,
    app: {
      port: num('API_PORT', 3333),
      globalPrefix: str('API_GLOBAL_PREFIX', 'api'),
      apiPublicUrl: str('API_PUBLIC_URL', 'http://localhost:3333'),
      webPublicUrl: str('WEB_PUBLIC_URL', 'http://localhost:4200'),
      corsOrigins: list('CORS_ORIGINS', ['http://localhost:4200']),
      logLevel: str('LOG_LEVEL', 'info'),
      swaggerEnabled: bool('SWAGGER_ENABLED', !isProduction),
    },
    platform: {
      name: str('PLATFORM_NAME', 'RomaLearn'),
      legalName: str('PLATFORM_LEGAL_NAME', 'RomaLearn Educação'),
      supportEmail: str('PLATFORM_SUPPORT_EMAIL', 'suporte@romalearn.local'),
      certificateIssuer: str('PLATFORM_CERTIFICATE_ISSUER', 'RomaLearn Educação'),
    },
    database: {
      host: str('POSTGRES_HOST', 'localhost'),
      port: num('POSTGRES_PORT', 5432),
      username: str('POSTGRES_USER', 'romalearn'),
      password: str('POSTGRES_PASSWORD', 'romalearn'),
      database: isTest
        ? str('POSTGRES_TEST_DB', 'romalearn_test')
        : str('POSTGRES_DB', 'romalearn'),
      ssl: bool('DATABASE_SSL', false),
    },
    auth: {
      accessSecret: str('JWT_ACCESS_SECRET', 'dev-only-access-secret-change-me'),
      refreshSecret: str('JWT_REFRESH_SECRET', 'dev-only-refresh-secret-change-me'),
      accessTtlSeconds: num('JWT_ACCESS_TTL', 900),
      refreshTtlSeconds: num('JWT_REFRESH_TTL', 2592000),
      cookieDomain: str('COOKIE_DOMAIN') || undefined,
      cookieSecure: bool('COOKIE_SECURE', isProduction),
      cookieSameSite: str('COOKIE_SAMESITE', 'lax') as 'lax' | 'strict' | 'none',
      /** Validade dos tokens de e-mail (confirmação/recuperação), em minutos. */
      emailTokenTtlMinutes: num('EMAIL_TOKEN_TTL_MINUTES', 60),
    },
    mail: {
      driver: str('MAIL_DRIVER', 'console') as 'console' | 'smtp',
      fromName: str('MAIL_FROM_NAME', 'RomaLearn'),
      fromAddress: str('MAIL_FROM_ADDRESS', 'nao-responda@romalearn.local'),
      smtp: {
        host: str('MAIL_SMTP_HOST', 'localhost'),
        port: num('MAIL_SMTP_PORT', 1025),
        secure: bool('MAIL_SMTP_SECURE', false),
        user: str('MAIL_SMTP_USER') || undefined,
        password: str('MAIL_SMTP_PASSWORD') || undefined,
      },
    },
    storage: {
      driver: str('STORAGE_DRIVER', 'local') as 's3' | 'local',
      endpoint: str('STORAGE_ENDPOINT', 'http://localhost:9000'),
      region: str('STORAGE_REGION', 'us-east-1'),
      bucket: str('STORAGE_BUCKET', 'romalearn'),
      accessKey: str('STORAGE_ACCESS_KEY', 'romalearn'),
      secretKey: str('STORAGE_SECRET_KEY', 'romalearn123'),
      forcePathStyle: bool('STORAGE_FORCE_PATH_STYLE', true),
      publicUrl: str('STORAGE_PUBLIC_URL', 'http://localhost:9000/romalearn'),
      signedUrlTtlSeconds: num('STORAGE_SIGNED_URL_TTL', 900),
      maxUploadBytes: num('STORAGE_MAX_UPLOAD_BYTES', 20 * 1024 * 1024),
      localDirectory: str('STORAGE_LOCAL_DIR', 'storage-local'),
    },
    payment: {
      gateway: str('PAYMENT_GATEWAY', 'fake') as 'fake' | 'mercadopago',
      currency: str('PAYMENT_CURRENCY', 'BRL'),
      fakeWebhookSecret: str('PAYMENT_FAKE_WEBHOOK_SECRET', 'dev-only-webhook-secret-change-me'),
      mercadopago: {
        accessToken: str('MERCADOPAGO_ACCESS_TOKEN'),
        publicKey: str('MERCADOPAGO_PUBLIC_KEY'),
        webhookSecret: str('MERCADOPAGO_WEBHOOK_SECRET'),
      },
      /** Minutos até um pagamento pendente expirar automaticamente. */
      expirationMinutes: num('PAYMENT_EXPIRATION_MINUTES', 60 * 24),
    },
    /**
     * Correção automática das atividades práticas.
     *
     * `rules` não faz chamada externa e não custa nada; `llm` usa um provedor
     * compatível com a API de chat da OpenAI — DeepSeek, por exemplo — sempre
     * com um teto de caracteres e de tokens por correção.
     */
    activityGrading: {
      driver: str('ACTIVITY_GRADER', 'rules') as 'rules' | 'llm',
      baseUrl: str('ACTIVITY_GRADER_BASE_URL', 'https://api.deepseek.com'),
      model: str('ACTIVITY_GRADER_MODEL', 'deepseek-chat'),
      apiKey: str('ACTIVITY_GRADER_API_KEY'),
      /** Corta o relato antes de enviar, para limitar o custo por correção. */
      maxInputChars: num('ACTIVITY_GRADER_MAX_INPUT_CHARS', 6000),
      maxOutputTokens: num('ACTIVITY_GRADER_MAX_OUTPUT_TOKENS', 900),
      timeoutMs: num('ACTIVITY_GRADER_TIMEOUT_MS', 30_000),
    },
    seed: {
      adminEmail: str('SEED_ADMIN_EMAIL', 'admin@romalearn.local'),
      adminPassword: str('SEED_ADMIN_PASSWORD', 'Admin@123456'),
      adminName: str('SEED_ADMIN_NAME', 'Administrador Local'),
      demoStudent: bool('SEED_DEMO_STUDENT', !isProduction),
      demoStudentEmail: str('SEED_DEMO_STUDENT_EMAIL', 'aluno@romalearn.local'),
      demoStudentPassword: str('SEED_DEMO_STUDENT_PASSWORD', 'Aluno@123456'),
    },
    rateLimit: {
      ttlSeconds: num('RATE_LIMIT_TTL', 60),
      limit: num('RATE_LIMIT_LIMIT', 120),
      authLimit: num('RATE_LIMIT_AUTH_LIMIT', 10),
    },
    legal: {
      termsVersion: str('TERMS_VERSION', '2026-01'),
      privacyVersion: str('PRIVACY_VERSION', '2026-01'),
    },
  };
};

/**
 * Limite estrito das rotas de credenciais.
 *
 * O decorador `@Throttle` recebe metadados estáticos, avaliados na importação
 * do controller — por isso o valor é lido aqui, e não pelo ConfigService.
 * Sobrescreve o limitador padrão apenas nas rotas anotadas.
 */
export function authThrottleOptions() {
  return {
    default: {
      limit: num('RATE_LIMIT_AUTH_LIMIT', 10),
      ttl: num('RATE_LIMIT_TTL', 60) * 1000,
    },
  };
}
