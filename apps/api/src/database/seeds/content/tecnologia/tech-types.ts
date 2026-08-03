import type { ContentBlock } from '../content-types';

/**
 * Conteúdo das aulas dos cursos de tecnologia.
 *
 * Estes cursos não vêm de um e-book: são material original da RomaLearn. Por
 * isso o tipo é separado do `LessonContent` dos módulos de Office, que carrega
 * `EbookReference` com módulo, capítulo e páginas do PDF oficial. Inventar uma
 * referência de página aqui seria mentir sobre a origem do texto — e a regra
 * editorial do projeto é justamente que a origem de cada aula fique explícita.
 *
 * O que substitui a referência é a promessa da aula: o problema concreto que
 * ela resolve e o que o aluno consegue fazer ao terminar.
 */
export interface TechLessonContent {
  /**
   * A situação do dia a dia que abre a aula, antes de qualquer termo técnico.
   *
   * Escrita para ser reconhecível por qualquer pessoa — de quem está no
   * primeiro emprego a quem está mudando de carreira aos cinquenta. Nada de
   * exemplo que dependa de conhecer videogame, rede social ou gíria de época.
   */
  problem: string;
  /** O que o aluno consegue fazer ao terminar, em uma frase verificável. */
  outcome: string;
  blocks: ContentBlock[];
  /** Perguntas de fixação ao fim da aula ("Pare e pense"). */
  reflection: string[];
  /** Itens "Conferir:" — específicos desta aula, nunca genéricos. */
  checklist: string[];
}

/** Todas as aulas de leitura de um curso, indexadas pelo título. */
export type TechCourseContent = Record<string, TechLessonContent>;
