import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { createHmac } from 'node:crypto';
import { FAKE_SIGNATURE_HEADER } from '../../src/commerce/gateways/fake.gateway';

const PREFIX = '/api';

export interface Session {
  accessToken: string;
  refreshToken: string;
  userId: string;
  email: string;
}

/** Envolve o supertest com o prefixo e o cabeçalho de autenticação. */
export class ApiClient {
  constructor(private readonly app: INestApplication) {}

  private get server() {
    return this.app.getHttpServer();
  }

  get(path: string, session?: Session) {
    return this.auth(request(this.server).get(`${PREFIX}${path}`), session);
  }

  post(path: string, body?: unknown, session?: Session) {
    return this.auth(
      request(this.server)
        .post(`${PREFIX}${path}`)
        .send(body ?? {}),
      session,
    );
  }

  patch(path: string, body?: unknown, session?: Session) {
    return this.auth(
      request(this.server)
        .patch(`${PREFIX}${path}`)
        .send(body ?? {}),
      session,
    );
  }

  put(path: string, body?: unknown, session?: Session) {
    return this.auth(
      request(this.server)
        .put(`${PREFIX}${path}`)
        .send(body ?? {}),
      session,
    );
  }

  delete(path: string, session?: Session) {
    return this.auth(request(this.server).delete(`${PREFIX}${path}`), session);
  }

  /** Envia um webhook do gateway falso já assinado corretamente. */
  webhook(payload: Record<string, unknown>, secret = 'test-webhook-secret') {
    const rawBody = JSON.stringify(payload);
    const signature = createHmac('sha256', secret).update(rawBody).digest('hex');

    return request(this.server)
      .post(`${PREFIX}/commerce/webhooks/fake`)
      .set('Content-Type', 'application/json')
      .set(FAKE_SIGNATURE_HEADER, signature)
      .send(rawBody);
  }

  /** Webhook com assinatura propositalmente inválida. */
  webhookUnsigned(payload: Record<string, unknown>) {
    return request(this.server)
      .post(`${PREFIX}/commerce/webhooks/fake`)
      .set('Content-Type', 'application/json')
      .set(FAKE_SIGNATURE_HEADER, 'f'.repeat(64))
      .send(JSON.stringify(payload));
  }

  async register(email: string, password = 'SenhaSegura2026'): Promise<Session> {
    const response = await this.post('/auth/register', {
      name: 'Aluno de Teste',
      email,
      password,
      acceptedTerms: true,
    }).expect(201);

    return {
      accessToken: response.body.accessToken,
      refreshToken: response.body.refreshToken,
      userId: response.body.user.id,
      email: response.body.user.email,
    };
  }

  async login(email: string, password: string): Promise<Session> {
    const response = await this.post('/auth/login', { email, password }).expect(200);

    return {
      accessToken: response.body.accessToken,
      refreshToken: response.body.refreshToken,
      userId: response.body.user.id,
      email: response.body.user.email,
    };
  }

  private auth(req: request.Test, session?: Session): request.Test {
    return session ? req.set('Authorization', `Bearer ${session.accessToken}`) : req;
  }
}

export const FREE_COURSE_SLUG = 'carreira-digital-e-destaque-profissional';
export const PAID_COURSE_SLUG = 'introducao-a-computacao-e-windows';
export const SANDBOX_OFFER_SLUG = 'oferta-sandbox-trilha-completa';
