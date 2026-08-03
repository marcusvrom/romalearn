/**
 * Fonte única da ordem pedagógica da Trilha de Desenvolvimento de Software.
 *
 * Git é a porta de entrada gratuita e prepara o caderno de bordo do aluno.
 * Lógica vem em seguida como fundação conceitual. HTML/CSS e JavaScript
 * formam uma construção web contínua. No fim, Python e Java são alternativas
 * de especialização inicial — uma não é pré-requisito da outra.
 */
export interface TechnologyJourneyItem {
  courseSlug: string;
  stage: number;
  stageTitle: string;
  stageDescription: string;
  isRequired: boolean;
  alternativeGroup: string | null;
  portfolioOutcome: string;
}

export const TECHNOLOGY_JOURNEY: readonly TechnologyJourneyItem[] = [
  {
    courseSlug: 'git-e-github-na-pratica',
    stage: 1,
    stageTitle: 'Abra seu caderno de bordo profissional',
    stageDescription:
      'Você começa registrando a própria evolução. O repositório criado aqui acompanhará todos os projetos seguintes.',
    isRequired: true,
    alternativeGroup: null,
    portfolioOutcome: 'Um repositório profissional que documenta sua jornada desde o primeiro dia.',
  },
  {
    courseSlug: 'logica-de-programacao-e-algoritmos',
    stage: 2,
    stageTitle: 'Aprenda a transformar problemas em soluções',
    stageDescription:
      'Com o espaço de trabalho preparado, você aprende a decompor problemas, escrever regras e testar decisões antes de escolher uma linguagem.',
    isRequired: true,
    alternativeGroup: null,
    portfolioOutcome: 'Um organizador de tarefas modelado, testado e explicado passo a passo.',
  },
  {
    courseSlug: 'html-e-css-do-zero',
    stage: 3,
    stageTitle: 'Coloque sua primeira solução na web',
    stageDescription:
      'A ideia sai do papel: primeiro ganha estrutura e acessibilidade; depois recebe comportamento, dados e tratamento de falhas.',
    isRequired: true,
    alternativeGroup: null,
    portfolioOutcome: 'Uma landing page acessível, responsiva, publicada e documentada.',
  },
  {
    courseSlug: 'javascript-fundamentos',
    stage: 3,
    stageTitle: 'Coloque sua primeira solução na web',
    stageDescription:
      'A ideia sai do papel: primeiro ganha estrutura e acessibilidade; depois recebe comportamento, dados e tratamento de falhas.',
    isRequired: true,
    alternativeGroup: null,
    portfolioOutcome: 'Um painel web interativo que consome uma API e comunica todos os estados.',
  },
  {
    courseSlug: 'python-para-iniciantes',
    stage: 4,
    stageTitle: 'Escolha sua primeira especialização',
    stageDescription:
      'Escolha uma das rotas para aprofundar a base: automação e dados com Python ou modelagem de sistemas com Java.',
    isRequired: false,
    alternativeGroup: 'especializacao-inicial',
    portfolioOutcome: 'Uma automação que consolida arquivos e gera relatórios reproduzíveis.',
  },
  {
    courseSlug: 'java-fundamentos-e-orientacao-a-objetos',
    stage: 4,
    stageTitle: 'Escolha sua primeira especialização',
    stageDescription:
      'Escolha uma das rotas para aprofundar a base: automação e dados com Python ou modelagem de sistemas com Java.',
    isRequired: false,
    alternativeGroup: 'especializacao-inicial',
    portfolioOutcome: 'Um sistema orientado a objetos com regras de domínio, exceções e testes.',
  },
] as const;

const ORDER_BY_SLUG = new Map(
  TECHNOLOGY_JOURNEY.map((item, index) => [item.courseSlug, index] as const),
);

export function technologyJourneyItem(courseSlug: string): TechnologyJourneyItem {
  const item = TECHNOLOGY_JOURNEY.find((candidate) => candidate.courseSlug === courseSlug);
  if (!item) throw new Error(`Curso fora da jornada técnica: ${courseSlug}`);
  return item;
}

export function technologyJourneyOrder(courseSlug: string): number {
  const order = ORDER_BY_SLUG.get(courseSlug);
  if (order === undefined) throw new Error(`Curso sem ordem na jornada técnica: ${courseSlug}`);
  return order;
}
