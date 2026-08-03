import { LessonType } from '@romalearn/contracts';
import { SEED_COURSES, SEED_PROGRAM } from './catalog-data';

describe('qualidade editorial da trilha administrativa', () => {
  const publishedCourses = SEED_COURSES.filter((course) => course.sections.length > 0);

  it('mantém conteúdo completo apenas nos cinco cursos publicáveis e no módulo gratuito', () => {
    expect(publishedCourses).toHaveLength(5);

    const draft = SEED_COURSES.find(
      (course) => course.slug === 'inteligencia-artificial-para-processos-administrativos',
    );
    expect(draft).toMatchObject({ workloadHours: 0, sections: [] });
  });

  it('garante conteúdo estruturado e referência de origem em todas as 46 leituras', () => {
    const readings = publishedCourses.flatMap((course) =>
      course.sections.flatMap((section) =>
        section.lessons.filter((lesson) => lesson.type === LessonType.RICH_TEXT),
      ),
    );

    expect(readings).toHaveLength(46);
    for (const lesson of readings) {
      expect(lesson.content).toBeDefined();
      expect(lesson.content?.blocks.length ?? 0).toBeGreaterThanOrEqual(7);
      expect(lesson.content?.blocks[0]?.kind).toBe('paragraph');
      expect(lesson.content?.reference.module.length ?? 0).toBeGreaterThan(0);
      expect(lesson.content?.reference.chapter.length ?? 0).toBeGreaterThan(0);
      expect(lesson.content?.reference.pages.length ?? 0).toBeGreaterThan(0);
      expect(lesson.content?.reference.sourceType).not.toBe('ORIGINAL');
    }
  });

  it('coloca práticas depois da preparação e publica critérios antes da entrega', () => {
    for (const course of publishedCourses) {
      const lessons = course.sections.flatMap((section) => section.lessons);
      const practices = lessons.filter((lesson) => lesson.type === LessonType.PRACTICAL_ACTIVITY);
      expect(practices.length).toBeGreaterThanOrEqual(1);

      for (const practice of practices) {
        const position = lessons.indexOf(practice);
        expect(
          lessons.slice(0, position).some((lesson) => lesson.type === LessonType.RICH_TEXT),
        ).toBe(true);
        expect(practice.rubric).toBeDefined();
        expect(
          practice.rubric?.criteria.reduce((sum, criterion) => sum + criterion.weight, 0),
        ).toBe(100);
        expect(practice.rubric?.criticalFailures.length ?? 0).toBeGreaterThanOrEqual(1);
        expect(practice.example).toBeDefined();
      }
    }
  });

  it('distribui avaliação ao longo da jornada, com feedback explicativo', () => {
    for (const course of publishedCourses) {
      const quizzes = course.sections
        .flatMap((section) => section.lessons)
        .filter((lesson) => lesson.type === LessonType.QUIZ);

      expect(quizzes).toHaveLength(4);
      for (const quiz of quizzes) {
        expect(quiz.questions?.length ?? 0).toBeGreaterThanOrEqual(6);
        for (const question of quiz.questions ?? []) {
          expect(question.explanation.length).toBeGreaterThanOrEqual(35);
          const correctOptions = question.options.filter((option) => option.isCorrect);
          if (question.type === 'SINGLE_CHOICE') {
            expect(correctOptions).toHaveLength(1);
          } else {
            expect(correctOptions.length).toBeGreaterThanOrEqual(2);
          }
        }
      }
    }
  });

  it('preserva a progressão profissional do básico à comunicação de resultados', () => {
    expect(SEED_PROGRAM.journey.map((item) => item.courseSlug)).toEqual([
      'introducao-a-computacao-e-windows',
      'microsoft-word-para-administracao',
      'microsoft-excel-para-administracao',
      'microsoft-powerpoint-para-administracao',
      'inteligencia-artificial-para-processos-administrativos',
    ]);
    expect(SEED_PROGRAM.journey.map((item) => item.stage)).toEqual([1, 2, 3, 4, 5]);
  });
});
