import { LessonType } from '@romalearn/contracts';
import { calculateProgramWorkload } from '../../catalog/program-workload';
import { getCourseIntroduction } from './content/course-introductions';
import { renderLessonContent } from './content/render-content';
import { CONTEUDO_TECNICO, conteudoDaAulaTecnica } from './content/tecnologia';
import { TECHNOLOGY_COURSES } from './technology-catalog-data';
import { TECHNOLOGY_REFINEMENTS, buildProjectRubric } from './technology-content-refinements';
import { buildTechnologyActivityContent } from './technology-content-expansion.service';
import { TECHNOLOGY_JOURNEY } from './technology-learning-journey';

describe('qualidade editorial da trilha de tecnologia', () => {
  it('mantém uma única ordem pedagógica, com Git como entrada e uma especialização alternativa', () => {
    expect(TECHNOLOGY_COURSES.map((course) => course.slug)).toEqual(
      TECHNOLOGY_JOURNEY.map((item) => item.courseSlug),
    );
    expect(TECHNOLOGY_JOURNEY.map((item) => item.stage)).toEqual([1, 2, 3, 3, 4, 4]);

    const git = TECHNOLOGY_COURSES[0];
    const logic = TECHNOLOGY_COURSES[1];
    expect(git).toMatchObject({ slug: 'git-e-github-na-pratica', isFree: true, order: 10 });
    expect(logic).toMatchObject({
      slug: 'logica-de-programacao-e-algoritmos',
      isFree: false,
      order: 11,
      priceCents: 5900,
    });

    const alternatives = TECHNOLOGY_JOURNEY.filter((item) => item.alternativeGroup);
    expect(alternatives.map((item) => item.courseSlug)).toEqual([
      'python-para-iniciantes',
      'java-fundamentos-e-orientacao-a-objetos',
    ]);
    expect(new Set(alternatives.map((item) => item.alternativeGroup))).toEqual(
      new Set(['especializacao-inicial']),
    );
    expect(alternatives.every((item) => !item.isRequired)).toBe(true);
  });

  it('publica as cargas editoriais revisadas sem uma segunda fonte de sobrescrita', () => {
    expect(
      Object.fromEntries(TECHNOLOGY_COURSES.map((course) => [course.slug, course.workloadHours])),
    ).toEqual({
      'git-e-github-na-pratica': 18,
      'logica-de-programacao-e-algoritmos': 28,
      'html-e-css-do-zero': 32,
      'javascript-fundamentos': 36,
      'python-para-iniciantes': 36,
      'java-fundamentos-e-orientacao-a-objetos': 44,
    });

    const workload = calculateProgramWorkload(
      TECHNOLOGY_JOURNEY.map((item) => ({
        workloadHours:
          TECHNOLOGY_COURSES.find((course) => course.slug === item.courseSlug)?.workloadHours ?? 0,
        isRequired: item.isRequired,
        alternativeGroup: item.alternativeGroup,
      })),
    );
    expect(workload).toEqual({ minimum: 150, maximum: 158 });
  });

  it('mantém as 55 leituras autorais completas, reconhecíveis e sem preenchimento genérico', () => {
    const readingLessons = TECHNOLOGY_COURSES.flatMap((course) =>
      course.sections.flatMap((section) =>
        section.lessons
          .filter((lesson) => lesson.type === LessonType.RICH_TEXT)
          .map((lesson) => ({ course, lesson })),
      ),
    );

    expect(readingLessons).toHaveLength(55);
    expect(
      Object.values(CONTEUDO_TECNICO).reduce(
        (total, lessons) => total + Object.keys(lessons).length,
        0,
      ),
    ).toBe(55);

    const problems = new Set<string>();
    const outcomes = new Set<string>();

    for (const { course, lesson } of readingLessons) {
      const authored = CONTEUDO_TECNICO[course.slug]?.[lesson.title];
      expect(authored).toBeDefined();
      if (!authored) continue;

      expect(authored.problem.length).toBeGreaterThanOrEqual(70);
      expect(authored.outcome.length).toBeGreaterThanOrEqual(45);
      expect(authored.blocks.length).toBeGreaterThanOrEqual(5);
      expect(
        authored.blocks.some((block) =>
          ['paragraph', 'analogy', 'keyIdea', 'tip', 'warning'].includes(block.kind),
        ),
      ).toBe(true);
      expect(authored.reflection.length).toBeGreaterThanOrEqual(2);
      expect(authored.checklist.length).toBeGreaterThanOrEqual(3);
      problems.add(authored.problem);
      outcomes.add(authored.outcome);

      const markdown = conteudoDaAulaTecnica(course.slug, lesson.title);
      expect(markdown).toContain('material original da RomaLearn');
      expect(markdown).not.toContain('do e-book');
      expect(markdown).toContain('## Pare e pense');
      expect(markdown).toContain('## Antes de seguir, confira');
      expect(markdown).toContain('class="rl-learning-flow"');
      expect(markdown).toContain('class="rl-guided-thinking"');
      expect(markdown).toContain('Caso para analisar:');
      expect(markdown).toContain('Modelo para começar:');
    }

    expect(problems.size).toBe(readingLessons.length);
    expect(outcomes.size).toBe(readingLessons.length);
  });

  it('guia todas as práticas com fluxo, casos de teste, reflexão e entrega', () => {
    const activities = TECHNOLOGY_COURSES.flatMap((course) =>
      course.sections.flatMap((section) =>
        section.lessons.filter((lesson) => lesson.type === LessonType.PRACTICAL_ACTIVITY),
      ),
    );

    expect(activities.length).toBeGreaterThanOrEqual(12);
    for (const activity of activities) {
      const markdown = buildTechnologyActivityContent(
        activity.title,
        activity.activityInstructions ?? '',
      );

      expect(markdown).toContain('class="rl-learning-flow"');
      expect(markdown).toContain('## Como desenvolver');
      expect(markdown).toContain('## Reflexão obrigatória');
      expect(markdown).toContain('class="rl-guided-thinking"');
      expect(markdown).toContain('## Antes de enviar');
      expect(markdown).toContain('1.');
    }
  });

  it('abre cada curso com uma chegada histórica, narrável e sem código obrigatório', () => {
    for (const course of TECHNOLOGY_COURSES) {
      const introduction = getCourseIntroduction(course.slug);
      const firstSection = course.sections[0];
      const firstLesson = firstSection.lessons[0];
      const authored = CONTEUDO_TECNICO[course.slug]?.[firstLesson.title];

      expect(firstSection.title).toBe('Antes de começar');
      expect(firstSection.lessons).toHaveLength(1);
      expect(firstLesson).toMatchObject({
        title: introduction.lessonTitle,
        type: LessonType.RICH_TEXT,
        estimatedMinutes: introduction.estimatedMinutes,
      });
      expect(authored?.blocks.some((block) => block.kind === 'steps')).toBe(true);
      expect(
        authored?.blocks.some(
          (block) => block.kind === 'list' && block.items.some((item) => item.includes('https://')),
        ),
      ).toBe(true);
      expect(authored?.blocks.some((block) => block.kind === 'code')).toBe(false);
      expect(
        firstSection.lessons.some((lesson) => lesson.type === LessonType.PRACTICAL_ACTIVITY),
      ).toBe(false);
    }
  });

  it('posiciona toda prática depois de conteúdo que prepara o aluno', () => {
    for (const course of TECHNOLOGY_COURSES) {
      for (const section of course.sections) {
        section.lessons.forEach((lesson, index) => {
          if (lesson.type !== LessonType.PRACTICAL_ACTIVITY) return;
          expect(
            section.lessons.slice(0, index).some((item) => item.type === LessonType.RICH_TEXT),
          ).toBe(true);
          expect(lesson.activityInstructions?.length ?? 0).toBeGreaterThanOrEqual(80);
        });
      }
    }
  });

  it('avalia cada curso com cobertura mínima e projeto verificável', () => {
    expect(TECHNOLOGY_REFINEMENTS).toHaveLength(TECHNOLOGY_COURSES.length);

    for (const refinement of TECHNOLOGY_REFINEMENTS) {
      expect(refinement.quiz.length).toBeGreaterThanOrEqual(6);
      expect(refinement.projectCriteria).toHaveLength(5);
      expect(new Set(refinement.quiz.map((question) => question.statement)).size).toBe(
        refinement.quiz.length,
      );
      for (const question of refinement.quiz) {
        expect(question.explanation.length).toBeGreaterThanOrEqual(45);
        expect(question.options.filter((option) => option.isCorrect)).toHaveLength(1);
        expect(question.options).toHaveLength(4);
      }

      const rubric = buildProjectRubric(refinement.projectCriteria);
      expect(rubric.minWords).toBeGreaterThanOrEqual(120);
      expect(rubric.criteria.reduce((sum, criterion) => sum + criterion.weight, 0)).toBe(100);
      expect(rubric.criticalFailures.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('cria uma legenda narrável para exemplos de código sem legenda manual', () => {
    const markdown = renderLessonContent({
      blocks: [{ kind: 'code', language: 'python', lines: ['print("Olá")'] }],
      reference: {
        sourceType: 'ORIGINAL',
        module: 'RomaLearn',
        chapter: 'Teste editorial',
        pages: 'material original',
      },
    });

    expect(markdown).toContain('Exemplo em python:');
    expect(markdown).toContain('material original da RomaLearn');
  });
});
