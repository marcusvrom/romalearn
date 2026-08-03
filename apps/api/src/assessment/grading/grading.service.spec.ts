import { ActivityGraderKind, ActivityReviewStatus, ActivityRubricDto } from '@romalearn/contracts';
import { ActivityGrader, GradingInput, GradingOutcome } from './activity-grader';
import { GradingService } from './grading.service';

const RUBRICA: ActivityRubricDto = {
  passingScore: 70,
  minWords: 10,
  criticalFailures: ['Experiência inventada.', 'Dado sensível exposto.'],
  criteria: [
    { id: 'a', title: 'Critério A', weight: 60, whatToObserve: 'algo' },
    { id: 'b', title: 'Critério B', weight: 40, whatToObserve: 'outra coisa' },
  ],
};

const RELATO = 'palavra '.repeat(40);

/** Corretor de teste: devolve exatamente o que o cenário precisa. */
function graderFake(outcome: Partial<GradingOutcome>): ActivityGrader {
  return {
    grade: (_input: GradingInput): Promise<GradingOutcome> =>
      Promise.resolve({
        criteria: [],
        strengths: [],
        improvements: [],
        criticalFailureIndexes: [],
        confident: true,
        model: 'modelo-de-teste',
        ...outcome,
      }),
  };
}

describe('GradingService', () => {
  it('recusa relato menor que o mínimo sem chamar o corretor', async () => {
    const grader = graderFake({});
    const espiao = jest.spyOn(grader, 'grade');
    const service = new GradingService(grader);

    const resultado = await service.grade('enunciado', RUBRICA, 'muito curto');

    expect(resultado.status).toBe(ActivityReviewStatus.NEEDS_REVISION);
    expect(resultado.score).toBe(0);
    expect(resultado.improvements[0]).toContain('pelo menos 10');
    expect(espiao).not.toHaveBeenCalled();
  });

  it('pondera as notas pelos pesos da rubrica, e não pela média simples', async () => {
    const service = new GradingService(
      graderFake({
        criteria: [
          { criterionId: 'a', score: 100, comment: '' },
          { criterionId: 'b', score: 0, comment: '' },
        ],
      }),
    );

    const resultado = await service.grade('enunciado', RUBRICA, RELATO);

    // Média simples daria 50; com pesos 60/40 o resultado é 60.
    expect(resultado.score).toBe(60);
    expect(resultado.status).toBe(ActivityReviewStatus.NEEDS_REVISION);
  });

  it('aprova quando a nota ponderada alcança o corte', async () => {
    const service = new GradingService(
      graderFake({
        criteria: [
          { criterionId: 'a', score: 80, comment: 'bom' },
          { criterionId: 'b', score: 60, comment: 'razoável' },
        ],
      }),
    );

    const resultado = await service.grade('enunciado', RUBRICA, RELATO);

    expect(resultado.score).toBe(72);
    expect(resultado.status).toBe(ActivityReviewStatus.APPROVED);
    expect(resultado.gradedBy).toBe(ActivityGraderKind.AI);
  });

  it('reprova por falha crítica mesmo com nota máxima', async () => {
    const service = new GradingService(
      graderFake({
        criteria: [
          { criterionId: 'a', score: 100, comment: '' },
          { criterionId: 'b', score: 100, comment: '' },
        ],
        criticalFailureIndexes: [1],
      }),
    );

    const resultado = await service.grade('enunciado', RUBRICA, RELATO);

    expect(resultado.score).toBe(100);
    expect(resultado.status).toBe(ActivityReviewStatus.NEEDS_REVISION);
    expect(resultado.criticalFailures).toEqual(['Dado sensível exposto.']);
  });

  it('ignora critério que não existe na rubrica e trata a ausência como zero', async () => {
    const service = new GradingService(
      graderFake({
        criteria: [
          { criterionId: 'a', score: 100, comment: '' },
          { criterionId: 'inventado', score: 100, comment: '' },
        ],
      }),
    );

    const resultado = await service.grade('enunciado', RUBRICA, RELATO);

    expect(resultado.criteriaResults.map((c) => c.criterionId)).toEqual(['a', 'b']);
    expect(resultado.score).toBe(60);
  });

  it('usa os títulos e pesos da rubrica, não os que o corretor devolveu', async () => {
    const service = new GradingService(
      graderFake({ criteria: [{ criterionId: 'a', score: 50, comment: 'ok' }] }),
    );

    const resultado = await service.grade('enunciado', RUBRICA, RELATO);

    expect(resultado.criteriaResults[0]).toMatchObject({
      title: 'Critério A',
      weight: 60,
    });
  });

  it('encaminha para revisão humana quando o corretor não tem confiança', async () => {
    const service = new GradingService(graderFake({ confident: false }));

    const resultado = await service.grade('enunciado', RUBRICA, RELATO);

    expect(resultado.status).toBe(ActivityReviewStatus.PENDING_HUMAN_REVIEW);
    expect(resultado.score).toBeNull();
  });

  it('entrega o texto do arquivo ao corretor', async () => {
    const grader = graderFake({
      criteria: [
        { criterionId: 'a', score: 80, comment: '' },
        { criterionId: 'b', score: 80, comment: '' },
      ],
    });
    const espiao = jest.spyOn(grader, 'grade');

    await new GradingService(grader).grade('enunciado', RUBRICA, RELATO, 'texto do arquivo');

    expect(espiao.mock.calls[0][0].attachmentText).toBe('texto do arquivo');
  });

  it('recusa entrega copiada do exemplo sem chamar o corretor', async () => {
    const grader = graderFake({});
    const espiao = jest.spyOn(grader, 'grade');
    const exemplo =
      'Montei a planilha com vinte registros, conferi o total somando na calculadora e comparei ' +
      'com a formula. Guardei o arquivo na pasta de estudos com a data no comeco do nome.';

    const resultado = await new GradingService(grader).grade(
      'enunciado',
      RUBRICA,
      exemplo,
      '',
      exemplo,
    );

    expect(resultado.status).toBe(ActivityReviewStatus.NEEDS_REVISION);
    expect(resultado.improvements[0]).toContain('exemplo comentado');
    expect(espiao).not.toHaveBeenCalled();
  });

  it('limita a nota ao intervalo válido', async () => {
    const service = new GradingService(
      graderFake({
        criteria: [
          { criterionId: 'a', score: 100, comment: '' },
          { criterionId: 'b', score: 100, comment: '' },
        ],
      }),
    );

    const resultado = await service.grade('enunciado', RUBRICA, RELATO);

    expect(resultado.score).toBeLessThanOrEqual(100);
  });
});
