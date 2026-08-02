import type { SeedLesson, SeedSection } from '../catalog-data';
import type { LessonContent } from './content-types';

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

  const resultado = sections.map((section) => ({
    ...section,
    lessons: section.lessons.map((lesson) => {
      const conteudo = enrichment.conteudo[lesson.title];
      const rubrica = enrichment.rubricas[lesson.title];
      if (conteudo || rubrica) usados.add(lesson.title);

      return { ...lesson, ...(conteudo ? { content: conteudo } : {}), ...(rubrica ?? {}) };
    }),
  }));

  const orfaos = [...Object.keys(enrichment.conteudo), ...Object.keys(enrichment.rubricas)].filter(
    (titulo) => !usados.has(titulo),
  );

  if (orfaos.length > 0) {
    throw new Error(
      `Conteúdo escrito para aulas que não existem na estrutura do curso: ${orfaos.join(', ')}. ` +
        'Confira se o título da aula é o mesmo nos dois arquivos.',
    );
  }

  return resultado;
}
