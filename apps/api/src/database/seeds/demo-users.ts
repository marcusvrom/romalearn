import { INestApplicationContext, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  CertificateStatus,
  LessonType,
  PaymentMethod,
  PublicationStatus,
  UserRole,
  UserStatus,
} from '@romalearn/contracts';
import { DataSource } from 'typeorm';
import { ActivityService } from '../../assessment/activity.service';
import { Quiz } from '../../assessment/entities/quiz.entity';
import { QuizService } from '../../assessment/quiz.service';
import { AuthService } from '../../auth/auth.service';
import { Lesson } from '../../catalog/entities/lesson.entity';
import { CertificatesService } from '../../certificates/certificates.service';
import { CheckoutService } from '../../commerce/checkout.service';
import { Offer } from '../../commerce/entities/offer.entity';
import { FakePaymentGateway, FAKE_SIGNATURE_HEADER } from '../../commerce/gateways/fake.gateway';
import { PAYMENT_GATEWAY, PaymentGateway } from '../../commerce/gateways/payment-gateway.types';
import { WebhookService } from '../../commerce/webhook.service';
import { AppConfig } from '../../config/configuration';
import { requiredSeconds } from '../../learning/completion-rules';
import { EnrollmentService } from '../../learning/enrollment.service';
import { ProgressService } from '../../learning/progress.service';
import { User } from '../../users/entities/user.entity';
import { UsersService } from '../../users/users.service';

const FREE_COURSE_SLUG = 'carreira-digital-e-destaque-profissional';
const PROGRAM_OFFER_SLUG = 'oferta-sandbox-trilha-completa';

/** Uma persona pronta para teste manual. */
export interface DemoPersona {
  email: string;
  name: string;
  /** O que o testador encontra ao entrar com esta conta. */
  situation: string;
  roles: UserRole[];
}

export interface DemoUsersOptions {
  /** Senha única para todas as contas de demonstração. */
  password: string;
  isProduction: boolean;
}

/**
 * Cria as contas de demonstração usadas nos testes manuais.
 *
 * Tudo passa pelos serviços reais — matrícula, progresso, checkout, webhook
 * assinado e emissão de certificado. Os dados resultantes são dados de
 * verdade, não registros montados à mão no banco, então os cenários refletem
 * exatamente o que um usuário viveria.
 *
 * Executa apenas fora de produção e é idempotente: contas já existentes são
 * mantidas como estão.
 */
export class DemoUsersSeeder {
  private readonly logger = new Logger('SeedDemo');

  private readonly dataSource: DataSource;
  private readonly authService: AuthService;
  private readonly usersService: UsersService;
  private readonly enrollmentService: EnrollmentService;
  private readonly progressService: ProgressService;
  private readonly quizService: QuizService;
  private readonly activityService: ActivityService;
  private readonly checkoutService: CheckoutService;
  private readonly webhookService: WebhookService;
  private readonly certificatesService: CertificatesService;
  private readonly configService: ConfigService<AppConfig, true>;
  private readonly gateway: PaymentGateway;

  constructor(app: INestApplicationContext) {
    this.dataSource = app.get(DataSource);
    this.authService = app.get(AuthService);
    this.usersService = app.get(UsersService);
    this.enrollmentService = app.get(EnrollmentService);
    this.progressService = app.get(ProgressService);
    this.quizService = app.get(QuizService);
    this.activityService = app.get(ActivityService);
    this.checkoutService = app.get(CheckoutService);
    this.webhookService = app.get(WebhookService);
    this.certificatesService = app.get(CertificatesService);
    this.configService = app.get(ConfigService);
    this.gateway = app.get(PAYMENT_GATEWAY);
  }

  async run(options: DemoUsersOptions): Promise<DemoPersona[]> {
    if (options.isProduction) {
      this.logger.warn('Contas de demonstração não são criadas em produção. Nada foi feito.');
      return [];
    }

    /*
     * Cada persona passa pelos fluxos reais da aplicação — matrícula, aulas,
     * questionários, compra, certificado. Algumas levam vários segundos, então
     * o nome aparece antes de começar: sem isso o terminal fica mudo e o
     * comando parece travado.
     */
    const etapas: [string, () => Promise<DemoPersona>][] = [
      ['aluno recém-cadastrado', () => this.newStudent(options)],
      ['aluno matriculado', () => this.enrolledStudent(options)],
      ['aluno em progresso', () => this.inProgressStudent(options)],
      ['concluinte com certificado', () => this.graduatedStudent(options)],
      ['certificado revogado', () => this.revokedCertificateStudent(options)],
      ['comprador da trilha', () => this.programBuyer(options)],
      ['pagamento pendente', () => this.pendingPaymentStudent(options)],
      ['pagamento recusado', () => this.rejectedPaymentStudent(options)],
      ['conta suspensa', () => this.suspendedStudent(options)],
      ['gestor de conteúdo', () => this.contentManager(options)],
      ['suporte', () => this.support(options)],
    ];

    const personas: DemoPersona[] = [];

    for (const [indice, [descricao, criar]] of etapas.entries()) {
      this.logger.log(`Conta ${indice + 1}/${etapas.length}: ${descricao}…`);
      personas.push(await criar());
    }

    this.logger.log(`${personas.length} contas de demonstração disponíveis.`);
    return personas;
  }

  // ------------------------------------------------------------------
  // Personas
  // ------------------------------------------------------------------

  /** Acabou de se cadastrar: e-mail ainda não confirmado e sem nenhum curso. */
  private async newStudent(options: DemoUsersOptions): Promise<DemoPersona> {
    const persona: DemoPersona = {
      email: 'novo@romalearn.local',
      name: 'Ana Novata',
      situation: 'Cadastrado, e-mail não confirmado, sem nenhuma matrícula.',
      roles: [UserRole.STUDENT],
    };

    // Sem confirmar o e-mail: reproduz o estado logo após o cadastro.
    await this.ensureUser(persona, options, { verifyEmail: false });
    return persona;
  }

  /** Matriculado no módulo gratuito, ainda sem ter aberto nenhuma aula. */
  private async enrolledStudent(options: DemoUsersOptions): Promise<DemoPersona> {
    const persona: DemoPersona = {
      email: 'matriculado@romalearn.local',
      name: 'Bruno Matriculado',
      situation: 'Matriculado no módulo gratuito, com 0% de progresso.',
      roles: [UserRole.STUDENT],
    };

    const { user, created } = await this.ensureUser(persona, options);
    if (!created) return persona;

    await this.enrollmentService.enrollFree(user.id, FREE_COURSE_SLUG);
    return persona;
  }

  /** Começou a estudar: as duas primeiras aulas concluídas. */
  private async inProgressStudent(options: DemoUsersOptions): Promise<DemoPersona> {
    const persona: DemoPersona = {
      email: 'progresso@romalearn.local',
      name: 'Carla Estudante',
      situation: 'Módulo gratuito em andamento, com as primeiras aulas concluídas.',
      roles: [UserRole.STUDENT],
    };

    const { user, created } = await this.ensureUser(persona, options);
    if (!created) return persona;

    await this.enrollmentService.enrollFree(user.id, FREE_COURSE_SLUG);
    await this.completeCourse(user.id, FREE_COURSE_SLUG, { limit: 2 });
    return persona;
  }

  /** Concluiu o módulo gratuito e já tem o certificado emitido. */
  private async graduatedStudent(options: DemoUsersOptions): Promise<DemoPersona> {
    const persona: DemoPersona = {
      email: 'concluinte@romalearn.local',
      name: 'Daniel Concluinte',
      situation: 'Concluiu o módulo gratuito; certificado ativo com código de validação.',
      roles: [UserRole.STUDENT],
    };

    const { user, created } = await this.ensureUser(persona, options);

    if (created) {
      await this.enrollmentService.enrollFree(user.id, FREE_COURSE_SLUG);
      await this.completeCourse(user.id, FREE_COURSE_SLUG);
    }

    // Buscado sempre: reexecutar o seed reimprime o código para consulta.
    const certificates = await this.certificatesService.listForUser(user.id);
    if (certificates[0]) {
      persona.situation += ` Código: ${certificates[0].verificationCode}.`;
    }

    return persona;
  }

  /** Concluiu o curso, mas o certificado foi revogado pela instituição. */
  private async revokedCertificateStudent(options: DemoUsersOptions): Promise<DemoPersona> {
    const persona: DemoPersona = {
      email: 'revogado@romalearn.local',
      name: 'Eduarda Revogada',
      situation: 'Concluiu o curso, mas o certificado foi revogado (validação mostra o motivo).',
      roles: [UserRole.STUDENT],
    };

    const { user, created } = await this.ensureUser(persona, options);

    if (!created) {
      const existing = await this.certificatesService.listForUser(user.id);
      if (existing[0]) persona.situation += ` Código: ${existing[0].verificationCode}.`;
      return persona;
    }

    await this.enrollmentService.enrollFree(user.id, FREE_COURSE_SLUG);
    await this.completeCourse(user.id, FREE_COURSE_SLUG);

    const admin = await this.usersService.findByEmail(
      this.configService.get('seed', { infer: true }).adminEmail,
    );
    const certificates = await this.certificatesService.listForUser(user.id);

    if (certificates[0] && admin) {
      await this.certificatesService.revoke(
        certificates[0].id,
        admin.id,
        'Revogado no seed de demonstração para permitir o teste da validação pública.',
      );
      persona.situation += ` Código: ${certificates[0].verificationCode}.`;
    }

    return persona;
  }

  /** Comprou a trilha completa: pedido aprovado por webhook assinado. */
  private async programBuyer(options: DemoUsersOptions): Promise<DemoPersona> {
    const persona: DemoPersona = {
      email: 'trilha@romalearn.local',
      name: 'Fernando Comprador',
      situation: 'Comprou a trilha completa (pagamento aprovado); acesso a todos os módulos.',
      roles: [UserRole.STUDENT],
    };

    const { user, created } = await this.ensureUser(persona, options);

    if (!created) {
      persona.situation += await this.describeLastOrder(user.id);
      return persona;
    }

    const checkout = await this.purchaseProgram(user.id);
    if (!checkout) {
      persona.situation = 'Compra não realizada: nenhuma oferta ativa encontrada.';
      return persona;
    }

    // Aprovação pelo mesmo caminho de produção: webhook assinado.
    await this.sendFakeWebhook({
      id: `seed-aprovado-${user.id}`,
      type: 'payment.approved',
      paymentId: checkout.gatewayPaymentId,
      status: 'APPROVED',
      amountCents: checkout.amountCents,
    });

    persona.situation += ` Pedido ${checkout.reference}.`;
    return persona;
  }

  /** Iniciou a compra e ainda não pagou: sem acesso ao conteúdo. */
  private async pendingPaymentStudent(options: DemoUsersOptions): Promise<DemoPersona> {
    const persona: DemoPersona = {
      email: 'pendente@romalearn.local',
      name: 'Gabriela Pendente',
      situation: 'Pedido aguardando pagamento; ainda sem acesso à trilha.',
      roles: [UserRole.STUDENT],
    };

    const { user, created } = await this.ensureUser(persona, options);

    if (!created) {
      persona.situation += await this.describeLastOrder(user.id, { withPaymentId: true });
      return persona;
    }

    const checkout = await this.purchaseProgram(user.id);
    if (checkout) {
      persona.situation +=
        ` Pedido ${checkout.reference}, pagamento ${checkout.gatewayPaymentId}` +
        ' (aprove com o script de webhook para testar a liberação).';
    }

    return persona;
  }

  /** Teve o pagamento recusado pela operadora. */
  private async rejectedPaymentStudent(options: DemoUsersOptions): Promise<DemoPersona> {
    const persona: DemoPersona = {
      email: 'recusado@romalearn.local',
      name: 'Heitor Recusado',
      situation: 'Pagamento recusado pela operadora; sem acesso à trilha.',
      roles: [UserRole.STUDENT],
    };

    const { user, created } = await this.ensureUser(persona, options);

    if (!created) {
      persona.situation += await this.describeLastOrder(user.id);
      return persona;
    }

    const checkout = await this.purchaseProgram(user.id, PaymentMethod.CREDIT_CARD);
    if (!checkout) return persona;

    await this.sendFakeWebhook({
      id: `seed-recusado-${user.id}`,
      type: 'payment.rejected',
      paymentId: checkout.gatewayPaymentId,
      status: 'REJECTED',
      failureReason: 'Recusado pela operadora (simulação do seed).',
    });

    persona.situation += ` Pedido ${checkout.reference}.`;
    return persona;
  }

  /** Conta bloqueada por um administrador: o login deve ser recusado. */
  private async suspendedStudent(options: DemoUsersOptions): Promise<DemoPersona> {
    const persona: DemoPersona = {
      email: 'suspenso@romalearn.local',
      name: 'Igor Suspenso',
      situation: 'Conta suspensa: o login é recusado com mensagem específica.',
      roles: [UserRole.STUDENT],
    };

    const { user, created } = await this.ensureUser(persona, options);
    if (!created) return persona;

    await this.dataSource
      .getRepository(User)
      .update({ id: user.id }, { status: UserStatus.SUSPENDED });

    return persona;
  }

  /** Pode editar conteúdo, mas não mexe em produtos, pedidos nem papéis. */
  private async contentManager(options: DemoUsersOptions): Promise<DemoPersona> {
    const persona: DemoPersona = {
      email: 'conteudo@romalearn.local',
      name: 'Joana Conteúdo',
      situation: 'Gestora de conteúdo: edita cursos, mas não acessa ações financeiras.',
      roles: [UserRole.CONTENT_MANAGER],
    };

    await this.ensureUser(persona, options);
    return persona;
  }

  /** Atende alunos: consulta tudo e libera acesso, sem poderes financeiros plenos. */
  private async support(options: DemoUsersOptions): Promise<DemoPersona> {
    const persona: DemoPersona = {
      email: 'suporte@romalearn.local',
      name: 'Lucas Suporte',
      situation: 'Suporte: consulta pedidos e usuários e faz liberações manuais de acesso.',
      roles: [UserRole.SUPPORT],
    };

    await this.ensureUser(persona, options);
    return persona;
  }

  // ------------------------------------------------------------------
  // Apoio
  // ------------------------------------------------------------------

  /**
   * Cria a conta pelo fluxo real de cadastro (com aceite dos termos) e, por
   * padrão, confirma o e-mail e ajusta os papéis.
   */
  private async ensureUser(
    persona: DemoPersona,
    options: DemoUsersOptions,
    settings: { verifyEmail?: boolean } = {},
  ): Promise<{ user: User; created: boolean }> {
    const existing = await this.usersService.findByEmail(persona.email);
    if (existing) {
      this.logger.log(`${persona.email} já existe — mantido como está.`);
      return { user: existing, created: false };
    }

    const { user } = await this.authService.register(
      {
        name: persona.name,
        email: persona.email,
        password: options.password,
        acceptedTerms: true,
      },
      { userAgent: 'seed-demo', ip: '127.0.0.1' },
    );

    const repository = this.dataSource.getRepository(User);
    // Tipo estreito: `Partial<User>` arrastaria as relações para o update.
    const patch: {
      emailVerifiedAt?: Date;
      status?: UserStatus;
      roles?: UserRole[];
    } = {};

    if (settings.verifyEmail !== false) {
      patch.emailVerifiedAt = new Date();
      patch.status = UserStatus.ACTIVE;
    }

    const isStudentOnly = persona.roles.length === 1 && persona.roles[0] === UserRole.STUDENT;
    if (!isStudentOnly) patch.roles = persona.roles;

    if (Object.keys(patch).length > 0) {
      await repository.update({ id: user.id }, patch);
    }

    this.logger.log(`${persona.email} criado.`);
    return { user: await repository.findOneOrFail({ where: { id: user.id } }), created: true };
  }

  /**
   * Percorre o curso cumprindo de fato cada regra de conclusão — mesmo
   * caminho de um aluno real, incluindo tempo de permanência, atividades e
   * questionários.
   */
  private async completeCourse(
    userId: string,
    courseSlug: string,
    options: { limit?: number } = {},
  ): Promise<void> {
    const player = await this.progressService.getPlayer(userId, courseSlug);
    const lessonRepository = this.dataSource.getRepository(Lesson);

    const outlines = player.sections.flatMap((section) => section.lessons);
    const selected = options.limit ? outlines.slice(0, options.limit) : outlines;

    for (const outline of selected) {
      const lesson = await lessonRepository.findOneOrFail({ where: { id: outline.id } });

      if (lesson.type === LessonType.PRACTICAL_ACTIVITY) {
        await this.activityService.submit(userId, lesson.id, {
          notes:
            'Atividade concluída com dados fictícios durante a preparação do ambiente de teste.',
        });
      }

      if (lesson.type === LessonType.QUIZ) {
        await this.passQuiz(userId, lesson.id);
      }

      // Cumpre a exigência de permanência das aulas de leitura.
      const needed =
        lesson.completionThreshold ??
        requiredSeconds(lesson.completionRule, lesson.estimatedMinutes, null);

      let sent = 0;
      while (sent < needed) {
        const step = Math.min(120, needed - sent);
        await this.progressService.heartbeat(userId, lesson.id, { elapsedSeconds: step });
        sent += step;
      }

      await this.progressService.completeLesson(userId, lesson.id, { confirmed: true });
    }
  }

  /** Responde o questionário com o gabarito, pelo serviço de correção real. */
  private async passQuiz(userId: string, lessonId: string): Promise<void> {
    const quiz = await this.dataSource.getRepository(Quiz).findOne({ where: { lessonId } });
    if (!quiz) return;

    const rows = await this.dataSource.query<{ questionId: string; optionId: string }[]>(
      `SELECT q.id AS "questionId", o.id AS "optionId"
         FROM questions q
         JOIN question_options o ON o."questionId" = q.id
        WHERE q."quizId" = $1 AND o."isCorrect" = true
        ORDER BY q."order"`,
      [quiz.id],
    );

    const grouped = new Map<string, string[]>();
    for (const row of rows) {
      grouped.set(row.questionId, [...(grouped.get(row.questionId) ?? []), row.optionId]);
    }

    const answers = [...grouped.entries()].map(([questionId, selectedOptionIds]) => ({
      questionId,
      selectedOptionIds,
    }));

    await this.quizService.submitAttempt(userId, quiz.id, { answers });
  }

  /** Cria o pedido da trilha pela oferta de sandbox publicada no seed. */
  private async purchaseProgram(
    userId: string,
    method: PaymentMethod = PaymentMethod.PIX,
  ): Promise<{ reference: string; gatewayPaymentId: string; amountCents: number } | null> {
    const offer = await this.dataSource
      .getRepository(Offer)
      .findOne({ where: { slug: PROGRAM_OFFER_SLUG } });

    if (!offer) return null;

    const result = await this.checkoutService.checkout(userId, { offerId: offer.id, method });
    const payment = result.payment;
    if (!payment?.gatewayPaymentId) return null;

    return {
      reference: result.order.reference,
      gatewayPaymentId: payment.gatewayPaymentId,
      amountCents: payment.amountCents,
    };
  }

  /**
   * Resumo do último pedido, para reimprimir a tabela sem recriar as contas.
   */
  private async describeLastOrder(
    userId: string,
    options: { withPaymentId?: boolean } = {},
  ): Promise<string> {
    const rows = await this.dataSource.query<
      { reference: string; status: string; gatewayPaymentId: string | null }[]
    >(
      `SELECT o.reference, o.status, p."gatewayPaymentId"
         FROM orders o
         LEFT JOIN payments p ON p."orderId" = o.id
        WHERE o."userId" = $1
        ORDER BY o."createdAt" DESC
        LIMIT 1`,
      [userId],
    );

    const order = rows[0];
    if (!order) return '';

    const paymentId =
      options.withPaymentId && order.gatewayPaymentId
        ? `, pagamento ${order.gatewayPaymentId}`
        : '';

    // Mostra o estado real: o ambiente pode ter sido alterado por testes
    // anteriores, e a descrição da persona é apenas a intenção original.
    return ` Estado atual: pedido ${order.reference} — ${order.status}${paymentId}.`;
  }

  /** Envia um webhook assinado ao gateway simulado, como faria o provedor. */
  private async sendFakeWebhook(payload: Record<string, unknown>): Promise<void> {
    if (!(this.gateway instanceof FakePaymentGateway)) {
      this.logger.warn(
        'Gateway simulado não está ativo — cenários de pagamento não foram preparados.',
      );
      return;
    }

    const rawBody = JSON.stringify(payload);

    await this.webhookService.handle('fake', {
      headers: { [FAKE_SIGNATURE_HEADER]: this.gateway.sign(rawBody) },
      rawBody,
      body: payload,
      query: {},
    });
  }

  /** Confere se o catálogo já foi semeado antes de montar as personas. */
  async assertCatalogReady(): Promise<boolean> {
    const count = await this.dataSource
      .getRepository(Lesson)
      .count({ where: { status: PublicationStatus.PUBLISHED } });

    if (count === 0) {
      this.logger.error('Catálogo vazio. Rode `pnpm seed` antes de `pnpm seed:demo`.');
      return false;
    }

    return true;
  }

  /** Situação atual das contas, para imprimir ao final. */
  async summarize(personas: DemoPersona[]): Promise<void> {
    const revoked = await this.dataSource.query<{ total: string }[]>(
      `SELECT COUNT(*)::text AS total FROM certificates WHERE status = $1`,
      [CertificateStatus.REVOKED],
    );

    this.logger.log(
      `Certificados revogados no ambiente: ${revoked[0]?.total ?? '0'} · ` +
        `Personas: ${personas.length}`,
    );
  }
}
