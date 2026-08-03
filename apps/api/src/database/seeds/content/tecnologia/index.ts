import { renderLessonContent } from '../render-content';
import type { ContentBlock } from '../content-types';
import { GIT } from './git';
import { HTML_CSS } from './html-css';
import { JAVA } from './java';
import { JAVASCRIPT } from './javascript';
import { LOGICA } from './logica';
import { PYTHON } from './python';
import type { TechCourseContent, TechLessonContent } from './tech-types';

/** Conteúdo autoral das leituras, por curso. */
const POR_CURSO: Record<string, TechCourseContent> = {
  'logica-de-programacao-e-algoritmos': LOGICA,
  'git-e-github-na-pratica': GIT,
  'html-e-css-do-zero': HTML_CSS,
  'javascript-fundamentos': JAVASCRIPT,
  'python-para-iniciantes': PYTHON,
  'java-fundamentos-e-orientacao-a-objetos': JAVA,
};

/**
 * Monta o Markdown de uma aula de leitura.
 *
 * A abertura é sempre o problema concreto, antes de qualquer termo técnico: o
 * aluno precisa reconhecer a situação para querer a explicação. Só depois vem
 * o que ele vai conseguir fazer, e então o conteúdo.
 */
function montarMarkdown(titulo: string, aula: TechLessonContent): string {
  const abertura: ContentBlock[] = [
    { kind: 'paragraph', text: aula.problem },
    { kind: 'keyIdea', text: `Ao terminar esta aula, você será capaz de: ${aula.outcome}` },
  ];

  const fechamento: ContentBlock[] = [
    { kind: 'heading', text: 'Pare e pense' },
    { kind: 'list', items: aula.reflection },
  ];

  return renderLessonContent({
    blocks: [...abertura, ...aula.blocks, ...fechamento],
    checklist: aula.checklist,
    // Estes cursos são material original da RomaLearn, não vêm de e-book. O
    // renderizador exige a referência; usá-la para dizer a verdade sobre a
    // origem é melhor do que inventar capítulo e página de um PDF que não
    // existe.
    reference: {
      module: 'Trilha de Tecnologia',
      chapter: titulo,
      pages: 'material original',
    },
  });
}

/**
 * Conteúdo de uma aula de leitura dos cursos de tecnologia.
 *
 * Devolve `null` quando a aula não tem conteúdo escrito. Quem chama decide o
 * que fazer — e o seed falha, em vez de gravar um texto genérico. Foi
 * justamente o preenchimento automático que deixou as 49 leituras com 78% do
 * texto idêntico entre si.
 */
export function conteudoDaAulaTecnica(courseSlug: string, lessonTitle: string): string | null {
  const curso = POR_CURSO[courseSlug];
  if (!curso) return null;

  const aula = curso[lessonTitle];
  if (!aula) return null;

  return montarMarkdown(lessonTitle, aula);
}

/** Títulos com conteúdo escrito, por curso. Usado pela conferência do seed. */
export function aulasComConteudo(courseSlug: string): string[] {
  return Object.keys(POR_CURSO[courseSlug] ?? {});
}

export { POR_CURSO as CONTEUDO_TECNICO };
