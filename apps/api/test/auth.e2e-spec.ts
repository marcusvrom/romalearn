import { Repository } from 'typeorm';
import { MAIL_TRANSPORT } from '../src/mail/mail.types';
import { ConsoleMailTransport } from '../src/mail/transports/console.transport';
import { User } from '../src/users/entities/user.entity';
import { UserRole, UserStatus } from '@romalearn/contracts';
import { ApiClient } from './helpers/api-client';
import { TestContext, closeTestApp, createTestApp } from './helpers/test-app';

describe('Autenticação e contas (e2e)', () => {
  let context: TestContext;
  let api: ApiClient;
  let mail: ConsoleMailTransport;
  let users: Repository<User>;

  beforeAll(async () => {
    context = await createTestApp();
    api = new ApiClient(context.app);
    mail = context.app.get(MAIL_TRANSPORT);
    users = context.dataSource.getRepository(User);
  });

  afterAll(async () => closeTestApp(context));

  describe('Cadastro', () => {
    it('cria a conta, registra o aceite dos termos e envia a confirmação', async () => {
      const before = mail.sent.length;

      const response = await api
        .post('/auth/register', {
          name: 'Maria Souza',
          email: 'Maria@Exemplo.com',
          password: 'SenhaSegura2026',
          acceptedTerms: true,
        })
        .expect(201);

      // E-mail normalizado para minúsculas.
      expect(response.body.user.email).toBe('maria@exemplo.com');
      expect(response.body.user.roles).toEqual([UserRole.STUDENT]);
      expect(response.body.user.status).toBe(UserStatus.PENDING_VERIFICATION);
      expect(response.body.user.termsAcceptedVersion).toBeTruthy();

      // A senha nunca aparece na resposta.
      expect(JSON.stringify(response.body)).not.toContain('SenhaSegura2026');
      expect(response.body.user.passwordHash).toBeUndefined();

      // Cookies HttpOnly de sessão.
      const cookies = response.headers['set-cookie'] as unknown as string[];
      expect(
        cookies.some((cookie) => cookie.startsWith('romalearn_at=') && cookie.includes('HttpOnly')),
      ).toBe(true);
      expect(
        cookies.some((cookie) => cookie.startsWith('romalearn_rt=') && cookie.includes('HttpOnly')),
      ).toBe(true);

      expect(mail.sent.length).toBe(before + 1);
      expect(mail.sent.at(-1)?.subject).toContain('Confirme');
    });

    it('recusa e-mail já cadastrado', async () => {
      const response = await api
        .post('/auth/register', {
          name: 'Outra Maria',
          email: 'maria@exemplo.com',
          password: 'OutraSenha2026',
          acceptedTerms: true,
        })
        .expect(409);

      expect(response.body.error).toBe('EMAIL_ALREADY_REGISTERED');
    });

    it('recusa senha fraca', async () => {
      const response = await api
        .post('/auth/register', {
          name: 'João',
          email: 'joao@exemplo.com',
          password: '123',
          acceptedTerms: true,
        })
        .expect(400);

      expect(response.body.error).toBe('VALIDATION_ERROR');
    });

    it('exige o aceite dos termos', async () => {
      await api
        .post('/auth/register', {
          name: 'Ana',
          email: 'ana@exemplo.com',
          password: 'SenhaSegura2026',
          acceptedTerms: false,
        })
        .expect(403);
    });
  });

  describe('Login', () => {
    it('autentica com as credenciais corretas', async () => {
      const response = await api
        .post('/auth/login', { email: 'maria@exemplo.com', password: 'SenhaSegura2026' })
        .expect(200);

      expect(response.body.user.email).toBe('maria@exemplo.com');
      expect(response.body.accessToken).toBeTruthy();
    });

    it('recusa senha incorreta sem revelar se o e-mail existe', async () => {
      const wrongPassword = await api
        .post('/auth/login', { email: 'maria@exemplo.com', password: 'SenhaErrada2026' })
        .expect(401);

      const unknownEmail = await api
        .post('/auth/login', { email: 'ninguem@exemplo.com', password: 'SenhaErrada2026' })
        .expect(401);

      // Mesma resposta nos dois casos: não vaza quais e-mails existem.
      expect(wrongPassword.body.error).toBe('INVALID_CREDENTIALS');
      expect(unknownEmail.body.error).toBe('INVALID_CREDENTIALS');
      expect(wrongPassword.body.message).toBe(unknownEmail.body.message);
    });

    it('bloqueia conta suspensa', async () => {
      await api.register('suspenso@exemplo.com');
      await users.update({ email: 'suspenso@exemplo.com' }, { status: UserStatus.SUSPENDED });

      const response = await api
        .post('/auth/login', { email: 'suspenso@exemplo.com', password: 'SenhaSegura2026' })
        .expect(403);

      expect(response.body.error).toBe('ACCOUNT_SUSPENDED');
    });
  });

  describe('Sessão', () => {
    it('exige autenticação em rotas privadas', async () => {
      const response = await api.get('/auth/me').expect(401);
      expect(response.body.error).toBe('SESSION_EXPIRED');
    });

    it('recusa token inválido', async () => {
      await api
        .get('/auth/me', { accessToken: 'token-invalido', refreshToken: '', userId: '', email: '' })
        .expect(401);
    });

    it('rotaciona o refresh token e invalida o anterior', async () => {
      const session = await api.login('maria@exemplo.com', 'SenhaSegura2026');

      const first = await api
        .post('/auth/refresh', { refreshToken: session.refreshToken })
        .expect(200);
      expect(first.body.refreshToken).not.toBe(session.refreshToken);

      // Reapresentar o token antigo é tratado como indício de roubo.
      await api.post('/auth/refresh', { refreshToken: session.refreshToken }).expect(401);

      // E a família inteira cai junto.
      await api.post('/auth/refresh', { refreshToken: first.body.refreshToken }).expect(401);
    });

    it('encerra a sessão no logout', async () => {
      const session = await api.login('maria@exemplo.com', 'SenhaSegura2026');

      await api.post('/auth/logout', { refreshToken: session.refreshToken }).expect(204);
      await api.post('/auth/refresh', { refreshToken: session.refreshToken }).expect(401);
    });
  });

  describe('Confirmação de e-mail', () => {
    it('confirma a conta com o token recebido', async () => {
      await api.register('confirma@exemplo.com');

      const link = mail.sent.at(-1)?.text ?? '';
      const token = new URL(link.match(/https?:\/\/\S+/)![0]).searchParams.get('token');

      const response = await api.post('/auth/verify-email', { token }).expect(200);
      expect(response.body.status).toBe(UserStatus.ACTIVE);
      expect(response.body.emailVerifiedAt).toBeTruthy();

      // Token de uso único.
      await api.post('/auth/verify-email', { token }).expect(400);
    });
  });

  describe('Recuperação de senha', () => {
    it('não revela se o e-mail existe', async () => {
      const existing = await api
        .post('/auth/forgot-password', { email: 'maria@exemplo.com' })
        .expect(202);
      const missing = await api
        .post('/auth/forgot-password', { email: 'nao-existe@exemplo.com' })
        .expect(202);

      expect(existing.body.message).toBe(missing.body.message);
    });

    it('redefine a senha e encerra as sessões abertas', async () => {
      const session = await api.login('maria@exemplo.com', 'SenhaSegura2026');

      await api.post('/auth/forgot-password', { email: 'maria@exemplo.com' }).expect(202);

      const link = mail.sent.at(-1)?.text ?? '';
      const token = new URL(link.match(/https?:\/\/\S+/)![0]).searchParams.get('token');

      await api.post('/auth/reset-password', { token, password: 'NovaSenha2026' }).expect(200);

      // Senha antiga deixa de funcionar; a nova funciona.
      await api
        .post('/auth/login', { email: 'maria@exemplo.com', password: 'SenhaSegura2026' })
        .expect(401);
      await api
        .post('/auth/login', { email: 'maria@exemplo.com', password: 'NovaSenha2026' })
        .expect(200);

      // A sessão anterior foi invalidada.
      await api.post('/auth/refresh', { refreshToken: session.refreshToken }).expect(401);

      // Token de redefinição não pode ser reutilizado.
      await api.post('/auth/reset-password', { token, password: 'OutraSenha2026' }).expect(400);
    });
  });

  describe('Perfil', () => {
    it('atualiza nome e telefone', async () => {
      const session = await api.login('maria@exemplo.com', 'NovaSenha2026');

      const response = await api
        .patch('/auth/me', { name: 'Maria S. Souza', phone: '+55 11 90000-0000' }, session)
        .expect(200);

      expect(response.body.name).toBe('Maria S. Souza');
      expect(response.body.phone).toBe('+55 11 90000-0000');
    });

    it('exige a senha atual para trocar de senha', async () => {
      const session = await api.login('maria@exemplo.com', 'NovaSenha2026');

      await api
        .post(
          '/auth/me/password',
          { currentPassword: 'errada', newPassword: 'MaisUma2026' },
          session,
        )
        .expect(401);

      await api
        .post(
          '/auth/me/password',
          { currentPassword: 'NovaSenha2026', newPassword: 'MaisUma2026' },
          session,
        )
        .expect(204);

      await api
        .post('/auth/login', { email: 'maria@exemplo.com', password: 'MaisUma2026' })
        .expect(200);
    });
  });

  describe('Autorização por papel', () => {
    it('nega a área administrativa para alunos', async () => {
      const session = await api.login('maria@exemplo.com', 'MaisUma2026');

      const response = await api.get('/admin/dashboard', session).expect(403);
      expect(response.body.error).toBe('FORBIDDEN');
    });

    it('permite a área administrativa para o administrador', async () => {
      const admin = await api.login('admin@teste.local', 'AdminTeste@123');

      const response = await api.get('/admin/dashboard', admin).expect(200);
      expect(response.body.users.total).toBeGreaterThan(0);
    });

    it('nega ações exclusivas de ADMIN a um gerente de conteúdo', async () => {
      const session = await api.register('conteudo@exemplo.com');
      await users.update({ id: session.userId }, { roles: [UserRole.CONTENT_MANAGER] });

      const refreshed = await api.login('conteudo@exemplo.com', 'SenhaSegura2026');

      // Pode listar conteúdo…
      await api.get('/admin/courses', refreshed).expect(200);
      // …mas não pode mexer em produtos comerciais.
      await api.post('/admin/products', { name: 'Teste', type: 'COURSE' }, refreshed).expect(403);
    });
  });
});
