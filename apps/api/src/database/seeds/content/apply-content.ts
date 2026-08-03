import type { ActivityAttachmentPolicyDto } from '@romalearn/contracts';
import type { SeedLesson, SeedQuestion, SeedSection } from '../catalog-data';
import type { ActivityExample, LessonContent } from './content-types';

/**
 * Conteúdo e rubricas de um módulo, indexados pelo título da aula.
 *
 * A estrutura dos cursos (partes, aulas e ordem) vive em `catalog-data.ts`,
 * transcrita dos sumários dos e-books. O texto de cada capítulo e as
 * rubricas vivem em arquivos próprios, um por módulo, para que cada um possa
 * ser revisado lado a lado com o PDF de origem.
 */
export interface SectionEnrichment {
  conteudo: Record<string, LessonContent>;
  rubricas: Record<string, Pick<SeedLesson, 'rubric' | 'rubricReference'>>;
  /** Política de anexo por título de aula. */
  anexos?: Record<string, ActivityAttachmentPolicyDto>;
  /** Exemplo comentado por título de aula. */
  exemplos?: Record<string, ActivityExample>;
  /**
   * Questionário de fixação acrescentado ao fim de uma parte, indexado pelo
   * título da parte. Serve para o aluno conferir o que reteve antes de
   * avançar, sem esperar o questionário final.
   */
  questionarios?: Record<string, SeedLesson>;
  /**
   * Perguntas acrescentadas a um questionário que já existe na estrutura,
   * indexadas pelo título da aula. Usado para ampliar o questionário final
   * sem reescrever a estrutura do curso.
   */
  perguntas?: Record<string, SeedQuestion[]>;
}

/**
 * Junta estrutura e conteúdo.
 *
 * Falha alto quando um título não bate: um capítulo renomeado em um dos
 * lados passaria despercebido e a aula iria para o ar sem conteúdo — o tipo
 * de erro que só aparece quando um aluno abre a página.
 */
export function enrichSections(
  sections: SeedSection[],
  enrichment: SectionEnrichment,
): SeedSection[] {
  const usados = new Set<string>();

  const partesUsadas = new Set<string>();

  const resultado = sections.map((section) => {
    const lessons = section.lessons.map((lesson) => {
      const conteudo = enrichment.conteudo[lesson.title];
      const rubrica = enrichment.rubricas[lesson.title];
      const anexo = enrichment.anexos?.[lesson.title];
      const extras = enrichment.perguntas?.[lesson.title];
      const exemplo = enrichment.exemplos?.[lesson.title];
      if (conteudo || rubrica || anexo || extras || exemplo) usados.add(lesson.title);

      return {
        ...lesson,
        ...(conteudo ? { content: conteudo } : {}),
        ...(rubrica ?? {}),
        ...(anexo ? { attachmentPolicy: anexo } : {}),
        ...(extras ? { questions: [...(lesson.questions ?? []), ...extras] } : {}),
        ...(exemplo ? { example: exemplo } : {}),
      };
    });

    const questionario = enrichment.questionarios?.[section.title];
    if (questionario) {
      partesUsadas.add(section.title);
      lessons.push(questionario);
    }

    return { ...section, lessons };
  });

  const orfaos = [
    ...Object.keys(enrichment.conteudo),
    ...Object.keys(enrichment.rubricas),
    ...Object.keys(enrichment.anexos ?? {}),
    ...Object.keys(enrichment.perguntas ?? {}),
    ...Object.keys(enrichment.exemplos ?? {}),
  ].filter((titulo) => !usados.has(titulo));

  if (orfaos.length > 0) {
    throw new Error(
      `Conteúdo escrito para aulas que não existem na estrutura do curso: ${orfaos.join(', ')}. ` +
        'Confira se o título da aula é o mesmo nos dois arquivos.',
    );
  }

  const partesOrfas = Object.keys(enrichment.questionarios ?? {}).filter(
    (titulo) => !partesUsadas.has(titulo),
  );

  if (partesOrfas.length > 0) {
    throw new Error(
      `Questionário escrito para partes que não existem no curso: ${partesOrfas.join(', ')}.`,
    );
  }

  return resultado;
}
