import type { ActivityRubricDto, CriterionResultDto } from '@romalearn/contracts';

/** Token de injeção do corretor configurado. */
export const ACTIVITY_GRADER = Symbol('ACTIVITY_GRADER');

export interface GradingInput {
  /** Enunciado da atividade, para o corretor saber o que foi pedido. */
  instructions: string;
  rubric: ActivityRubricDto;
  /** Relato escrito pelo aluno. Conteúdo não confiável. */
  notes: string;
  /**
   * Texto extraído do arquivo entregue, quando houver. Também é conteúdo
   * não confiável: veio de um arquivo de fora.
   */
  attachmentText: string;
}

export interface GradingOutcome {
  /**
   * Nota por critério, de 0 a 100. A nota final **não** vem daqui: quem
   * pondera e decide a aprovação é a API.
   */
  criteria: { criterionId: string; score: number; comment: string }[];
  strengths: string[];
  improvements: string[];
  /** Índices das falhas críticas da rubrica que o corretor identificou. */
  criticalFailureIndexes: number[];
  /**
   * Falso quando o corretor não conseguiu avaliar com segurança — provedor
   * fora do ar, resposta inválida, relato ambíguo. A entrega vai para
   * revisão humana em vez de receber uma nota inventada.
   */
  confident: boolean;
  /** Identificador público do modelo usado, quando houver. */
  model: string | null;
}

/**
 * Corretor de atividades práticas.
 *
 * Contrato deliberadamente estreito: recebe enunciado, rubrica e relato, e
 * devolve notas por critério. Nenhuma implementação tem acesso ao banco, ao
 * usuário ou à decisão de conclusão da aula.
 */
export interface ActivityGrader {
  grade(input: GradingInput): Promise<GradingOutcome>;
}

/** Aplica os pesos da rubrica às notas por critério. */
export function weightedScore(rubric: ActivityRubricDto, results: CriterionResultDto[]): number {
  const totalWeight = rubric.criteria.reduce((sum, criterion) => sum + criterion.weight, 0);
  if (totalWeight <= 0) return 0;

  const weighted = results.reduce((sum, result) => sum + result.score * result.weight, 0);
  return Math.round((weighted / totalWeight) * 100) / 100;
}
