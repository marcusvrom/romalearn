/**
 * Ambiente dos testes de integração/e2e.
 *
 * Carregado antes de qualquer módulo da aplicação para garantir que a API
 * suba apontando para o banco de testes e para provedores locais.
 */
import * as dotenv from 'dotenv';
import * as path from 'node:path';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

process.env.NODE_ENV = 'test';
// Nunca envia e-mail de verdade durante os testes.
process.env.MAIL_DRIVER = 'console';
// Evita depender de MinIO/S3 na suíte automatizada.
process.env.STORAGE_DRIVER = 'local';
process.env.STORAGE_LOCAL_DIR = path.resolve(__dirname, '../.tmp-test-storage');
process.env.PAYMENT_GATEWAY = 'fake';
process.env.PAYMENT_FAKE_WEBHOOK_SECRET = 'test-webhook-secret';
process.env.JWT_ACCESS_SECRET = 'test-access-secret';
process.env.JWT_REFRESH_SECRET = 'test-refresh-secret';
process.env.SWAGGER_ENABLED = 'false';
process.env.LOG_LEVEL = 'error';
// Limites altos para que o rate limit não interfira nos testes de fluxo.
process.env.RATE_LIMIT_LIMIT = '10000';
process.env.RATE_LIMIT_AUTH_LIMIT = '10000';
process.env.POSTGRES_TEST_DB = process.env.POSTGRES_TEST_DB ?? 'romalearn_test';
