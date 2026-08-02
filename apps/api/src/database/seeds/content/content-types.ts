/**
 * Modelo do conteúdo das aulas.
 *
 * O conteúdo dos capítulos é descrito em blocos estruturados, não em Markdown
 * solto. Isso mantém a formatação uniforme nas dezenas de aulas, permite
 * revisar o material lado a lado com o e-book e deixa a origem de cada aula
 * explícita: todo capítulo carrega a referência do e-book de onde veio.
 *
 * Regra editorial: nada aqui pode contradizer os e-books oficiais. Quando o
 * e-book não cobre um assunto, a aula não o inventa.
 */

import type { ActivityRubricDto, RubricCriterionDto } from '@romalearn/contracts';

/** De onde o conteúdo da aula foi extraído. */
export interface EbookReference {
  /** Identificação curta do e-book, como "Módulo 1". */
  module: string;
  /** Capítulo ou seção de origem, como aparece no sumário. */
  chapter: string;
  /** Páginas do PDF oficial, como "15–16". */
  pages: string;
}

export type ContentBlock =
  /** Subtítulo de uma seção do capítulo. */
  | { kind: 'heading'; text: string }
  | { kind: 'paragraph'; text: string }
  /** Comparação com o mundo real ("Imagine assim", "Analogia"). */
  | { kind: 'analogy'; text: string }
  /** Risco, limite ou cuidado ("Atenção"). */
  | { kind: 'warning'; text: string }
  /** Recomendação prática ("Dica"). */
  | { kind: 'tip'; text: string }
  /** Ideia central que o capítulo quer fixar. */
  | { kind: 'keyIdea'; text: string }
  | { kind: 'list'; items: string[] }
  /** Sequência numerada de passos a executar. */
  | { kind: 'steps'; items: string[] }
  | { kind: 'table'; headers: string[]; rows: string[][] }
  /** Modelo de texto para o aluno preencher. */
  | { kind: 'template'; label: string; text: string };

export interface LessonContent {
  blocks: ContentBlock[];
  /** Itens "Conferir:" do capítulo. */
  checklist?: string[];
  /** Itens do "Resumo do capítulo". */
  summary?: string[];
  reference: EbookReference;
}

/**
 * Rubrica de uma atividade prática.
 *
 * Mesmo formato que a API entrega ao front-end. Os critérios, os pesos, as
 * falhas críticas e a nota de corte vêm das tabelas "Como avaliar" e das
 * listas "Conferir:" dos próprios e-books.
 */
export type ActivityRubric = ActivityRubricDto;
export type RubricCriterion = RubricCriterionDto;
