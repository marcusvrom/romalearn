import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  ActivityGraderKind,
  ActivityReviewStatus,
  ActivityRubricDto,
  CriterionResultDto,
} from '@romalearn/contracts';
import { ActivitySubmission } from '../entities/activity-submission.entity';
import { ACTIVITY_GRADER, ActivityGrader, weightedScore } from './activity-grader';

/** Resultado consolidado de uma correção, pronto para persistir. */
export interface GradedSubmission {
  status: ActivityReviewStatus;
  score: number | null;
  criteriaResults: CriterionResultDto[];
  strengths: string[];
  improvements: string[];
  criticalFailures: string[];
  gradedBy: ActivityGraderKind;
  graderModel: string | null;
}

/**
 * Correção de atividades práticas.
 *
 * Este serviço é a autoridade sobre a nota. O corretor — regra ou modelo de
 * linguagem — apenas opina critério a critério; a ponderação, o corte de
 * aprovação e o efeito das falhas críticas são decididos aqui.
 */
@Injectable()
export class GradingService {
  private readonly logger = new Logger(GradingService.name);

  constructor(@Inject(ACTIVITY_GRADER) private readonly grader: ActivityGrader) {}

  async grade(
    instructions: string,
    rubric: ActivityRubricDto,
    notes: string,
  ): Promise<GradedSubmission> {
    // Relato curto demais não tem o que corrigir: devolvemos sem gastar chamada.
    const wordCount = notes.trim().split(/\s+/).filter(Boolean).length;
    if (wordCount < rubric.minWords) {
      return {
        status: ActivityReviewStatus.NEEDS_REVISION,
        score: 0,
        criteriaResults: [],
        strengths: [],
        improvements: [
          `Seu relato tem ${wordCount} palavras e a atividade pede pelo menos ${rubric.minWords}. ` +
            'Descreva o que você fez em cada critério, passo a passo.',
        ],
        criticalFailures: [],
        gradedBy: ActivityGraderKind.RULES,
        graderModel: null,
      };
    }

    const outcome = await this.grader.grade({ instructions, rubric, notes });
    const gradedBy = outcome.model ? ActivityGraderKind.AI : ActivityGraderKind.RULES;

    if (!outcome.confident) {
      return {
        status: ActivityReviewStatus.PENDING_HUMAN_REVIEW,
        score: null,
        criteriaResults: [],
        strengths: [],
        improvements: [],
        criticalFailures: [],
        gradedBy,
        graderModel: outcome.model,
      };
    }

    // Reconstrói a partir da rubrica: o corretor não define peso nem título.
    const criteriaResults: CriterionResultDto[] = rubric.criteria.map((criterion) => {
      const result = outcome.criteria.find((item) => item.criterionId === criterion.id);
      return {
        criterionId: criterion.id,
        title: criterion.title,
        weight: criterion.weight,
        score: result?.score ?? 0,
        comment: result?.comment ?? '',
      };
    });

    const criticalFailures = outcome.criticalFailureIndexes.map(
      (index) => rubric.criticalFailures[index],
    );

    const score = weightedScore(rubric, criteriaResults);
    // Falha crítica reprova mesmo com nota alta — a regra é do próprio e-book.
    const approved = criticalFailures.length === 0 && score >= rubric.passingScore;

    return {
      status: approved ? ActivityReviewStatus.APPROVED : ActivityReviewStatus.NEEDS_REVISION,
      score,
      criteriaResults,
      strengths: outcome.strengths,
      improvements: outcome.improvements,
      criticalFailures,
      gradedBy,
      graderModel: outcome.model,
    };
  }

  /** Mensagem em português para o estado atual de uma entrega. */
  statusMessage(submission: ActivitySubmission, rubric: ActivityRubricDto | null): string {
    switch (submission.status) {
      case ActivityReviewStatus.APPROVED:
        return 'Atividade aprovada. Você já pode concluir esta aula.';

      case ActivityReviewStatus.NEEDS_REVISION:
        return (
          `Sua entrega ficou em ${formatScore(submission.score)} e a aprovação pede ` +
          `${rubric?.passingScore ?? 70}%. Leia os comentários abaixo, ajuste o relato e envie de novo — ` +
          'não há limite de tentativas.'
        );

      case ActivityReviewStatus.PENDING_HUMAN_REVIEW:
        return (
          'Recebemos sua entrega. Desta vez a correção automática não conseguiu avaliar com ' +
          'segurança, então uma pessoa da equipe vai revisar. A aula já está liberada e você ' +
          'pode seguir estudando.'
        );

      case ActivityReviewStatus.GRADING:
        return 'Estamos corrigindo sua entrega. Isso costuma levar poucos segundos.';

      default:
        return 'Entrega recebida.';
    }
  }
}

function formatScore(score: number | null): string {
  return score === null ? 'sem nota' : `${Math.round(score)}%`;
}
