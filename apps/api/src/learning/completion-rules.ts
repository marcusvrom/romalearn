import { LessonCompletionRule, LessonType } from '@romalearn/contracts';

/**
 * Regras de conclusão de aula avaliadas **no backend**.
 *
 * Abrir a página nunca conclui uma aula. Cada tipo tem uma exigência
 * própria e o front apenas exibe o resultado da avaliação.
 */
export interface CompletionEvidence {
  secondsSpent: number;
  watchRatio: number;
  /** Existe tentativa aprovada no questionário da aula. */
  quizPassed: boolean;
  /** A atividade prática foi enviada. */
  activitySubmitted: boolean;
  /** O aluno marcou explicitamente "concluí esta aula". */
  confirmed: boolean;
}

export interface CompletionCheck {
  satisfied: boolean;
  /** Mensagem em linguagem simples explicando o que falta. */
  reason: string;
}

/** Padrões quando a aula não define um limiar próprio. */
export const DEFAULT_THRESHOLDS = {
  /** Fração do tempo estimado que precisa ser cumprida. */
  minimumTimeFactor: 0.5,
  /** Piso absoluto de permanência, em segundos. */
  minimumTimeFloorSeconds: 30,
  /** Proporção do vídeo que precisa ser assistida. */
  videoWatchRatio: 0.9,
} as const;

export function requiredSeconds(
  rule: LessonCompletionRule,
  estimatedMinutes: number,
  threshold: number | null,
): number {
  if (rule !== LessonCompletionRule.MINIMUM_TIME) return 0;
  if (threshold && threshold > 0) return threshold;

  return Math.max(
    DEFAULT_THRESHOLDS.minimumTimeFloorSeconds,
    Math.round(estimatedMinutes * 60 * DEFAULT_THRESHOLDS.minimumTimeFactor),
  );
}

function formatMinutes(seconds: number): string {
  const minutes = Math.ceil(seconds / 60);
  return minutes <= 1 ? '1 minuto' : `${minutes} minutos`;
}

export function evaluateCompletion(
  lesson: {
    type: LessonType;
    completionRule: LessonCompletionRule;
    completionThreshold: number | null;
    estimatedMinutes: number;
  },
  evidence: CompletionEvidence,
): CompletionCheck {
  switch (lesson.completionRule) {
    case LessonCompletionRule.MANUAL_CONFIRMATION:
      return evidence.confirmed
        ? { satisfied: true, reason: '' }
        : {
            satisfied: false,
            reason: 'Marque a aula como concluída para registrar seu progresso.',
          };

    case LessonCompletionRule.MINIMUM_TIME: {
      const needed = requiredSeconds(
        lesson.completionRule,
        lesson.estimatedMinutes,
        lesson.completionThreshold,
      );
      return evidence.secondsSpent >= needed
        ? { satisfied: true, reason: '' }
        : {
            satisfied: false,
            reason: `Continue nesta aula por pelo menos ${formatMinutes(needed)} antes de concluir.`,
          };
    }

    case LessonCompletionRule.VIDEO_WATCH_RATIO: {
      const needed = lesson.completionThreshold ?? DEFAULT_THRESHOLDS.videoWatchRatio;
      return evidence.watchRatio >= needed
        ? { satisfied: true, reason: '' }
        : {
            satisfied: false,
            reason: `Assista pelo menos ${Math.round(needed * 100)}% do vídeo para concluir a aula.`,
          };
    }

    case LessonCompletionRule.QUIZ_PASSED:
      return evidence.quizPassed
        ? { satisfied: true, reason: '' }
        : {
            satisfied: false,
            reason: 'Alcance a nota mínima no questionário para concluir esta aula.',
          };

    case LessonCompletionRule.ACTIVITY_SUBMITTED:
      return evidence.activitySubmitted
        ? { satisfied: true, reason: '' }
        : {
            satisfied: false,
            reason: 'Envie a confirmação da atividade prática para concluir esta aula.',
          };

    default:
      return { satisfied: false, reason: 'Não foi possível validar a conclusão desta aula.' };
  }
}

/** Teto de tempo aceito por chamada de progresso, contra envios inflados. */
export const MAX_HEARTBEAT_SECONDS = 120;
