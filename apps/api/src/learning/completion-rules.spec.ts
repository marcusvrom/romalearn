import { LessonCompletionRule, LessonType } from '@romalearn/contracts';
import { CompletionEvidence, evaluateCompletion, requiredSeconds } from './completion-rules';

const evidence = (patch: Partial<CompletionEvidence> = {}): CompletionEvidence => ({
  secondsSpent: 0,
  watchRatio: 0,
  quizPassed: false,
  activitySubmitted: false,
  activityApproved: false,
  confirmed: false,
  ...patch,
});

describe('Regras de conclusão de aula', () => {
  describe('MANUAL_CONFIRMATION', () => {
    const lesson = {
      type: LessonType.DOWNLOAD,
      completionRule: LessonCompletionRule.MANUAL_CONFIRMATION,
      completionThreshold: null,
      estimatedMinutes: 10,
    };

    it('recusa quando o aluno não confirmou', () => {
      const result = evaluateCompletion(lesson, evidence());
      expect(result.satisfied).toBe(false);
      expect(result.reason).toContain('Marque a aula');
    });

    it('aceita com a confirmação explícita', () => {
      expect(evaluateCompletion(lesson, evidence({ confirmed: true })).satisfied).toBe(true);
    });
  });

  describe('MINIMUM_TIME', () => {
    const lesson = {
      type: LessonType.RICH_TEXT,
      completionRule: LessonCompletionRule.MINIMUM_TIME,
      completionThreshold: 300,
      estimatedMinutes: 10,
    };

    it('não conclui só porque a página foi aberta', () => {
      const result = evaluateCompletion(lesson, evidence({ confirmed: true }));
      expect(result.satisfied).toBe(false);
      expect(result.reason).toContain('minutos');
    });

    it('conclui ao atingir o tempo mínimo', () => {
      expect(evaluateCompletion(lesson, evidence({ secondsSpent: 300 })).satisfied).toBe(true);
    });

    it('usa metade do tempo estimado quando não há limiar configurado', () => {
      expect(requiredSeconds(LessonCompletionRule.MINIMUM_TIME, 10, null)).toBe(300);
    });

    it('respeita um piso mínimo para aulas muito curtas', () => {
      expect(requiredSeconds(LessonCompletionRule.MINIMUM_TIME, 1, null)).toBe(30);
    });
  });

  describe('VIDEO_WATCH_RATIO', () => {
    const lesson = {
      type: LessonType.VIDEO,
      completionRule: LessonCompletionRule.VIDEO_WATCH_RATIO,
      completionThreshold: 0.9,
      estimatedMinutes: 8,
    };

    it('recusa quando o aluno assistiu pouco', () => {
      const result = evaluateCompletion(lesson, evidence({ watchRatio: 0.5 }));
      expect(result.satisfied).toBe(false);
      expect(result.reason).toContain('90%');
    });

    it('aceita ao atingir a proporção exigida', () => {
      expect(evaluateCompletion(lesson, evidence({ watchRatio: 0.92 })).satisfied).toBe(true);
    });

    it('exige 90% quando nenhum limiar foi configurado', () => {
      const withoutThreshold = { ...lesson, completionThreshold: null };
      expect(evaluateCompletion(withoutThreshold, evidence({ watchRatio: 0.89 })).satisfied).toBe(
        false,
      );
      expect(evaluateCompletion(withoutThreshold, evidence({ watchRatio: 0.9 })).satisfied).toBe(
        true,
      );
    });
  });

  describe('QUIZ_PASSED', () => {
    const lesson = {
      type: LessonType.QUIZ,
      completionRule: LessonCompletionRule.QUIZ_PASSED,
      completionThreshold: null,
      estimatedMinutes: 10,
    };

    it('não aceita confirmação manual no lugar da aprovação', () => {
      expect(evaluateCompletion(lesson, evidence({ confirmed: true })).satisfied).toBe(false);
    });

    it('aceita quando existe tentativa aprovada', () => {
      expect(evaluateCompletion(lesson, evidence({ quizPassed: true })).satisfied).toBe(true);
    });
  });

  describe('ACTIVITY_SUBMITTED', () => {
    const lesson = {
      type: LessonType.PRACTICAL_ACTIVITY,
      completionRule: LessonCompletionRule.ACTIVITY_SUBMITTED,
      completionThreshold: null,
      estimatedMinutes: 30,
    };

    it('exige o envio da atividade', () => {
      expect(evaluateCompletion(lesson, evidence({ confirmed: true })).satisfied).toBe(false);
      expect(evaluateCompletion(lesson, evidence({ activitySubmitted: true })).satisfied).toBe(
        true,
      );
    });
  });

  describe('ACTIVITY_APPROVED', () => {
    const lesson = {
      type: LessonType.PRACTICAL_ACTIVITY,
      completionRule: LessonCompletionRule.ACTIVITY_APPROVED,
      completionThreshold: null,
      estimatedMinutes: 30,
    };

    it('não aceita entrega apenas enviada', () => {
      const check = evaluateCompletion(lesson, evidence({ activitySubmitted: true }));

      expect(check.satisfied).toBe(false);
      expect(check.reason).toContain('nota mínima');
    });

    it('pede a entrega quando ainda não houve nenhuma', () => {
      const check = evaluateCompletion(lesson, evidence());

      expect(check.satisfied).toBe(false);
      expect(check.reason).toContain('Envie sua entrega');
    });

    it('aceita entrega aprovada', () => {
      expect(
        evaluateCompletion(lesson, evidence({ activitySubmitted: true, activityApproved: true }))
          .satisfied,
      ).toBe(true);
    });

    it('não bloqueia o aluno quando a confirmação é declarada sem entrega', () => {
      expect(evaluateCompletion(lesson, evidence({ confirmed: true })).satisfied).toBe(false);
    });
  });
});
