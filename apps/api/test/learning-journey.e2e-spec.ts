import {
  CertificateStatus,
  EnrollmentStatus,
  LessonType,
  ProgressStatus,
} from '@romalearn/contracts';
import { Repository } from 'typeorm';
import { Certificate } from '../src/certificates/entities/certificate.entity';
import { Lesson } from '../src/catalog/entities/lesson.entity';
import { ApiClient, FREE_COURSE_SLUG, PAID_COURSE_SLUG, Session } from './helpers/api-client';
import { TestContext, closeTestApp, createTestApp } from './helpers/test-app';

/**
 * Fluxo vertical completo exigido pela especificação:
 * cadastro → matrícula → consumo de aulas → questionário → conclusão →
 * certificado → validação pública.
 */
describe('Jornada de aprendizagem (e2e)', () => {
  let context: TestContext;
  let api: ApiClient;
  let student: Session;
  let lessons: Repository<Lesson>;
  let certificates: Repository<Certificate>;

  beforeAll(async () => {
    context = await createTestApp();
    api = new ApiClient(context.app);
    lessons = context.dataSource.getRepository(Lesson);
    certificates = context.dataSource.getRepository(Certificate);
    student = await api.register('jornada@exemplo.com');
  });

  afterAll(async () => closeTestApp(context));

  describe('Catálogo público', () => {
    it('lista apenas cursos publicados', async () => {
      const response = await api.get('/catalog/courses').expect(200);

      const slugs = response.body.map((course: { slug: string }) => course.slug);
      expect(slugs).toContain(FREE_COURSE_SLUG);
      expect(slugs).toContain(PAID_COURSE_SLUG);
      // O módulo 5 não tem conteúdo, então continua em rascunho.
      expect(slugs).not.toContain('inteligencia-artificial-para-processos-administrativos');
    });

    it('mostra o curso sem exigir login', async () => {
      const response = await api.get(`/catalog/courses/${FREE_COURSE_SLUG}`).expect(200);

      expect(response.body.title).toBe('Carreira Digital e Destaque Profissional');
      expect(response.body.sections.length).toBeGreaterThan(0);
      expect(response.body.isFree).toBe(true);
      // Sem sessão, não há informação de acesso.
      expect(response.body.access).toBeUndefined();
    });

    it('informa a situação de acesso para quem está autenticado', async () => {
      const response = await api.get(`/catalog/courses/${FREE_COURSE_SLUG}`, student).expect(200);
      expect(response.body.access).toEqual({
        hasAccess: false,
        enrollmentId: null,
        reason: 'NOT_ENTITLED',
      });
    });
  });

  describe('Acesso negado sem permissão', () => {
    it('bloqueia o player de um curso sem matrícula', async () => {
      const response = await api
        .get(`/learning/courses/${FREE_COURSE_SLUG}/player`, student)
        .expect(403);

      expect(response.body.error).toBe('NO_COURSE_ACCESS');
    });

    it('bloqueia o conteúdo de uma aula do curso pago', async () => {
      const response = await api
        .get(`/learning/courses/${PAID_COURSE_SLUG}/player`, student)
        .expect(403);

      expect(response.body.error).toBe('NO_COURSE_ACCESS');
    });
  });

  describe('Matrícula gratuita', () => {
    it('cria a permissão sem passar por pagamento', async () => {
      const response = await api
        .post('/commerce/enroll-free', { courseSlug: FREE_COURSE_SLUG }, student)
        .expect(201);

      expect(response.body.enrollmentId).toBeTruthy();
    });

    it('é idempotente ao repetir a matrícula', async () => {
      const first = await api
        .post('/commerce/enroll-free', { courseSlug: FREE_COURSE_SLUG }, student)
        .expect(201);
      const second = await api
        .post('/commerce/enroll-free', { courseSlug: FREE_COURSE_SLUG }, student)
        .expect(201);

      expect(first.body.enrollmentId).toBe(second.body.enrollmentId);
    });

    it('recusa matrícula gratuita em curso pago', async () => {
      const response = await api
        .post('/commerce/enroll-free', { courseSlug: PAID_COURSE_SLUG }, student)
        .expect(403);

      expect(response.body.error).toBe('FORBIDDEN');
    });

    it('libera o player após a matrícula', async () => {
      const response = await api
        .get(`/learning/courses/${FREE_COURSE_SLUG}/player`, student)
        .expect(200);

      expect(response.body.sections.length).toBeGreaterThan(0);
      expect(response.body.progress.percentage).toBe(0);
      expect(response.body.resumeLessonId).toBeTruthy();
    });
  });

  describe('Consumo de aulas e progresso', () => {
    it('não conclui uma aula de leitura só porque foi aberta', async () => {
      const player = await api.get(`/learning/courses/${FREE_COURSE_SLUG}/player`, student);
      const lessonSlug = player.body.sections[0].lessons[0].slug;

      const lesson = await api
        .get(`/learning/courses/${FREE_COURSE_SLUG}/lessons/${lessonSlug}`, student)
        .expect(200);

      expect(lesson.body.progress.status).toBe(ProgressStatus.IN_PROGRESS);

      const response = await api
        .post(`/learning/lessons/${lesson.body.id}/complete`, { confirmed: true }, student)
        .expect(400);

      expect(response.body.error).toBe('LESSON_REQUIREMENT_NOT_MET');
    });

    it('limita o tempo aceito por batida de progresso', async () => {
      const player = await api.get(`/learning/courses/${FREE_COURSE_SLUG}/player`, student);
      const lessonSlug = player.body.sections[0].lessons[0].slug;
      const lesson = await api.get(
        `/learning/courses/${FREE_COURSE_SLUG}/lessons/${lessonSlug}`,
        student,
      );

      const before = lesson.body.progress.secondsSpent;
      // Envio inflado: o backend aceita no máximo 120 s por chamada.
      const response = await api
        .post(`/learning/lessons/${lesson.body.id}/progress`, { elapsedSeconds: 600 }, student)
        .expect(200);

      expect(response.body.secondsSpent).toBe(before + 120);
    });

    it('salva a posição do vídeo e retoma o ponto', async () => {
      const player = await api.get(`/learning/courses/${FREE_COURSE_SLUG}/player`, student);
      const lessonSlug = player.body.sections[0].lessons[0].slug;
      const lesson = await api.get(
        `/learning/courses/${FREE_COURSE_SLUG}/lessons/${lessonSlug}`,
        student,
      );

      await api
        .post(
          `/learning/lessons/${lesson.body.id}/progress`,
          { elapsedSeconds: 30, positionSeconds: 95 },
          student,
        )
        .expect(200);

      const reloaded = await api.get(
        `/learning/courses/${FREE_COURSE_SLUG}/lessons/${lessonSlug}`,
        student,
      );
      expect(reloaded.body.progress.lastPositionSeconds).toBe(95);
    });

    it('registra a última aula acessada para "Continuar estudando"', async () => {
      const response = await api.get('/learning/courses', student).expect(200);
      const enrolled = response.body.find(
        (item: { course: { slug: string } }) => item.course.slug === FREE_COURSE_SLUG,
      );

      expect(enrolled.lastAccessedLesson).toBeTruthy();
      expect(enrolled.lastAccessedAt).toBeTruthy();
    });
  });

  describe('Questionário', () => {
    let quizId: string;
    let quizLessonId: string;

    beforeAll(async () => {
      const course = await api.get(`/catalog/courses/${FREE_COURSE_SLUG}`);
      const quizOutline = course.body.sections
        .flatMap(
          (section: { lessons: { id: string; slug: string; type: string }[] }) => section.lessons,
        )
        .find((lesson: { type: string }) => lesson.type === LessonType.QUIZ);

      const lesson = await api.get(
        `/learning/courses/${FREE_COURSE_SLUG}/lessons/${quizOutline.slug}`,
        student,
      );

      quizId = lesson.body.quiz.id;
      quizLessonId = lesson.body.id;
    });

    it('não entrega o gabarito antes da tentativa', async () => {
      const course = await api.get(`/catalog/courses/${FREE_COURSE_SLUG}`);
      const quizOutline = course.body.sections
        .flatMap((section: { lessons: { slug: string; type: string }[] }) => section.lessons)
        .find((lesson: { type: string }) => lesson.type === LessonType.QUIZ);

      const lesson = await api.get(
        `/learning/courses/${FREE_COURSE_SLUG}/lessons/${quizOutline.slug}`,
        student,
      );

      const serialized = JSON.stringify(lesson.body.quiz);
      expect(serialized).not.toContain('isCorrect');
      expect(serialized).not.toContain('explanation');
    });

    it('reprova quando a nota fica abaixo do mínimo', async () => {
      const lesson = await api.get(
        `/learning/courses/${FREE_COURSE_SLUG}/lessons/questionario-de-conclusao`,
        student,
      );

      // Responde tudo com a primeira alternativa — insuficiente de propósito.
      const answers = lesson.body.quiz.questions.map(
        (question: { id: string; options: { id: string }[] }) => ({
          questionId: question.id,
          selectedOptionIds: [question.options[0].id],
        }),
      );

      const response = await api
        .post(`/learning/quizzes/${quizId}/attempts`, { answers }, student)
        .expect(201);

      expect(response.body.passingScore).toBe(70);
      if (response.body.score < 70) {
        expect(response.body.passed).toBe(false);
        // A aula do questionário continua pendente.
        const lessonAfter = await api.get(
          `/learning/courses/${FREE_COURSE_SLUG}/lessons/questionario-de-conclusao`,
          student,
        );
        expect(lessonAfter.body.progress.status).not.toBe(ProgressStatus.COMPLETED);
      }
    });

    it('aprova com as respostas corretas e conclui a aula automaticamente', async () => {
      const answers = await correctAnswersFor(context, quizId);

      const response = await api
        .post(`/learning/quizzes/${quizId}/attempts`, { answers }, student)
        .expect(201);

      expect(response.body.score).toBe(100);
      expect(response.body.passed).toBe(true);
      expect(response.body.questions.length).toBeGreaterThan(0);
      // Com feedback ligado, o gabarito volta só depois do envio.
      expect(response.body.questions[0].correctOptionIds.length).toBeGreaterThan(0);

      const lesson = await api.get(
        `/learning/courses/${FREE_COURSE_SLUG}/lessons/questionario-de-conclusao`,
        student,
      );
      expect(lesson.body.progress.status).toBe(ProgressStatus.COMPLETED);
      expect(lesson.body.quiz.passed).toBe(true);
      expect(quizLessonId).toBe(lesson.body.id);
    });

    it('guarda o histórico de tentativas', async () => {
      const lesson = await api.get(
        `/learning/courses/${FREE_COURSE_SLUG}/lessons/questionario-de-conclusao`,
        student,
      );

      expect(lesson.body.quiz.attemptsUsed).toBeGreaterThanOrEqual(2);
      expect(lesson.body.quiz.bestScore).toBe(100);
    });
  });

  describe('Conclusão do curso e certificado', () => {
    it('lista os requisitos que ainda faltam', async () => {
      const player = await api.get(`/learning/courses/${FREE_COURSE_SLUG}/player`, student);
      expect(player.body.progress.pendingRequirements.length).toBeGreaterThan(0);
    });

    it('conclui o curso quando todos os critérios são atendidos', async () => {
      await completeEntireCourse(context, api, student, FREE_COURSE_SLUG, lessons);

      const player = await api.get(`/learning/courses/${FREE_COURSE_SLUG}/player`, student);

      expect(player.body.progress.percentage).toBe(100);
      expect(player.body.progress.pendingRequirements).toEqual([]);
      expect(player.body.progress.status).toBe(EnrollmentStatus.COMPLETED);
    });

    it('emite exatamente um certificado', async () => {
      const response = await api.get('/certificates', student).expect(200);

      expect(response.body.length).toBe(1);
      expect(response.body[0].subjectTitle).toBe('Carreira Digital e Destaque Profissional');
      expect(response.body[0].workloadHours).toBe(8);
      expect(response.body[0].verificationUrl).toContain('/certificados/verificar/');

      const total = await certificates.count({ where: { userId: student.userId } });
      expect(total).toBe(1);
    });

    it('não duplica o certificado ao reprocessar a conclusão', async () => {
      // Reexecuta o caminho de conclusão: concluir uma aula já concluída.
      const player = await api.get(`/learning/courses/${FREE_COURSE_SLUG}/player`, student);
      const first = player.body.sections[0].lessons[0];

      await api.post(`/learning/lessons/${first.id}/complete`, { confirmed: true }, student);

      const total = await certificates.count({ where: { userId: student.userId } });
      expect(total).toBe(1);
    });

    it('gera o PDF do certificado', async () => {
      const list = await api.get('/certificates', student);
      const certificateId = list.body[0].id;

      const response = await api
        .get(`/certificates/${certificateId}/pdf`, student)
        .expect(200)
        .buffer(true)
        .parse((res, callback) => {
          const chunks: Buffer[] = [];
          res.on('data', (chunk: Buffer) => chunks.push(chunk));
          res.on('end', () => callback(null, Buffer.concat(chunks)));
        });

      expect(response.headers['content-type']).toContain('application/pdf');
      // Assinatura de um arquivo PDF válido.
      expect((response.body as Buffer).subarray(0, 4).toString()).toBe('%PDF');
    });

    it('impede que outro aluno baixe o certificado', async () => {
      const intruder = await api.register('intruso@exemplo.com');
      const list = await api.get('/certificates', student);

      await api.get(`/certificates/${list.body[0].id}/pdf`, intruder).expect(403);
    });
  });

  describe('Validação pública do certificado', () => {
    let code: string;

    beforeAll(async () => {
      const list = await api.get('/certificates', student);
      code = list.body[0].verificationCode;
    });

    it('valida sem exigir login e sem expor dados pessoais', async () => {
      const response = await api.get(`/certificates/verify/${code}`).expect(200);

      expect(response.body.valid).toBe(true);
      expect(response.body.studentName).toBe('Aluno de Teste');
      expect(response.body.subjectTitle).toBe('Carreira Digital e Destaque Profissional');
      expect(response.body.workloadHours).toBe(8);
      expect(response.body.issuerName).toBeTruthy();

      // Nenhum dado pessoal além do nome.
      const serialized = JSON.stringify(response.body);
      expect(serialized).not.toContain('jornada@exemplo.com');
      expect(response.body.email).toBeUndefined();
      expect(response.body.userId).toBeUndefined();
      expect(response.body.phone).toBeUndefined();
    });

    it('responde "inválido" para código inexistente', async () => {
      const response = await api.get('/certificates/verify/NAO-EXISTE-1234').expect(200);
      expect(response.body.valid).toBe(false);
      expect(response.body.studentName).toBeNull();
    });

    it('reflete a revogação feita pelo administrador', async () => {
      const admin = await api.login('admin@teste.local', 'AdminTeste@123');
      const list = await api.get('/certificates', student);

      await api
        .post(
          `/admin/certificates/${list.body[0].id}/revoke`,
          { reason: 'Emitido por engano durante o teste.' },
          admin,
        )
        .expect(201);

      const response = await api.get(`/certificates/verify/${code}`).expect(200);
      expect(response.body.valid).toBe(false);
      expect(response.body.status).toBe(CertificateStatus.REVOKED);
      expect(response.body.revocationReason).toContain('engano');

      // Certificado revogado não pode mais ser baixado.
      await api.get(`/certificates/${list.body[0].id}/pdf`, student).expect(403);
    });
  });
});

/** Descobre as alternativas corretas direto do banco, como faria um gabarito. */
async function correctAnswersFor(context: TestContext, quizId: string) {
  const rows = await context.dataSource.query(
    `SELECT q.id AS "questionId", o.id AS "optionId"
       FROM questions q
       JOIN question_options o ON o."questionId" = q.id
      WHERE q."quizId" = $1 AND o."isCorrect" = true
      ORDER BY q."order"`,
    [quizId],
  );

  const grouped = new Map<string, string[]>();
  for (const row of rows as { questionId: string; optionId: string }[]) {
    grouped.set(row.questionId, [...(grouped.get(row.questionId) ?? []), row.optionId]);
  }

  return [...grouped.entries()].map(([questionId, selectedOptionIds]) => ({
    questionId,
    selectedOptionIds,
  }));
}

/** Cumpre de fato cada regra de conclusão do curso, aula por aula. */
async function completeEntireCourse(
  context: TestContext,
  api: ApiClient,
  session: Session,
  courseSlug: string,
  lessonsRepository: Repository<Lesson>,
): Promise<void> {
  const player = await api.get(`/learning/courses/${courseSlug}/player`, session);

  for (const section of player.body.sections) {
    for (const outline of section.lessons) {
      const lesson = await api.get(
        `/learning/courses/${courseSlug}/lessons/${outline.slug}`,
        session,
      );
      const entity = await lessonsRepository.findOneOrFail({ where: { id: lesson.body.id } });

      if (entity.type === LessonType.PRACTICAL_ACTIVITY) {
        await api.post(
          `/learning/lessons/${entity.id}/activity`,
          { notes: 'Atividade concluída com dados fictícios durante o teste.' },
          session,
        );
      }

      if (entity.type === LessonType.QUIZ) {
        const quiz = lesson.body.quiz;
        if (!quiz.passed) {
          const answers = await correctAnswersFor(context, quiz.id);
          await api.post(`/learning/quizzes/${quiz.id}/attempts`, { answers }, session);
        }
      }

      // Cumpre a exigência de permanência das aulas de leitura.
      const needed = lesson.body.completionThreshold ?? 0;
      let sent = lesson.body.progress.secondsSpent;
      while (sent < needed) {
        const step = Math.min(120, needed - sent);
        await api.post(
          `/learning/lessons/${entity.id}/progress`,
          { elapsedSeconds: step },
          session,
        );
        sent += step;
      }

      await api.post(`/learning/lessons/${entity.id}/complete`, { confirmed: true }, session);
    }
  }
}
