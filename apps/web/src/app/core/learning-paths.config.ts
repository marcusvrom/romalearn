export type LearningPathStatus = 'AVAILABLE' | 'PLANNED';

export interface LearningPathDefinition {
  id: string;
  title: string;
  shortDescription: string;
  icon: string;
  status: LearningPathStatus;
  recommendedFor: string[];
  courseTopics: string[];
  outcome: string;
}

/**
 * Taxonomia editorial da RomaLearn.
 *
 * Ela evita que o catálogo cresça como uma lista plana e permite organizar
 * cursos atuais e futuros por objetivo profissional. Os ids são estáveis e
 * podem ser persistidos no perfil do aluno quando o onboarding for conectado
 * à API.
 */
export const LEARNING_PATHS: readonly LearningPathDefinition[] = [
  {
    id: 'carreira-digital',
    title: 'Carreira e competências digitais',
    shortDescription:
      'Para começar do zero, ganhar confiança e construir evidências profissionais.',
    icon: '🧭',
    status: 'AVAILABLE',
    recommendedFor: ['Primeiro emprego', 'Transição de carreira', 'Retorno aos estudos'],
    courseTopics: ['Carreira digital', 'Computador e Windows', 'Segurança básica'],
    outcome: 'Miniportfólio, presença profissional e autonomia para usar o computador.',
  },
  {
    id: 'produtividade-administrativa',
    title: 'Produtividade e administração',
    shortDescription:
      'Ferramentas digitais aplicadas a documentos, controles, reuniões e processos.',
    icon: '📊',
    status: 'AVAILABLE',
    recommendedFor: ['Rotinas administrativas', 'Comércio', 'Atendimento e operações'],
    courseTopics: ['Word', 'Excel', 'PowerPoint', 'IA para processos administrativos'],
    outcome: 'Documentos, planilhas e apresentações prontas para situações reais de trabalho.',
  },
  {
    id: 'fundamentos-programacao',
    title: 'Fundamentos de programação',
    shortDescription:
      'Do primeiro repositório à resolução de problemas, sem depender de experiência anterior.',
    icon: '🧠',
    status: 'AVAILABLE',
    recommendedFor: ['Quem nunca programou', 'Estudantes', 'Transição para tecnologia'],
    courseTopics: ['Git e GitHub', 'Lógica de programação', 'Algoritmos', 'Resolução de problemas'],
    outcome:
      'Caderno de bordo publicado, raciocínio estruturado e base para escolher uma linguagem.',
  },
  {
    id: 'desenvolvimento-web',
    title: 'Desenvolvimento web',
    shortDescription: 'Da primeira página à construção de aplicações web acessíveis e responsivas.',
    icon: '🌐',
    status: 'AVAILABLE',
    recommendedFor: ['Frontend', 'Portfólio', 'Projetos pessoais'],
    courseTopics: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'Angular'],
    outcome: 'Sites e aplicações publicados, com código versionado e projetos para portfólio.',
  },
  {
    id: 'backend-software',
    title: 'Backend e engenharia de software',
    shortDescription: 'APIs, bancos de dados, testes e práticas usadas em sistemas profissionais.',
    icon: '⚙️',
    status: 'AVAILABLE',
    recommendedFor: ['Backend', 'Full stack', 'Evolução profissional'],
    courseTopics: ['Python', 'Java', 'Orientação a objetos', 'Testes básicos'],
    outcome:
      'Uma automação em Python ou um sistema orientado a objetos em Java, com testes e documentação.',
  },
  {
    id: 'dados-inteligencia-artificial',
    title: 'Dados e inteligência artificial',
    shortDescription: 'Dados, automação e IA usados com responsabilidade para resolver problemas.',
    icon: '🤖',
    status: 'PLANNED',
    recommendedFor: ['Análise de dados', 'Automação', 'IA aplicada'],
    courseTopics: [
      'Python',
      'Análise de dados',
      'Prompt engineering',
      'Automação',
      'Fundamentos de IA',
    ],
    outcome: 'Análises e automações explicáveis, com validação humana e uso responsável de dados.',
  },
] as const;
