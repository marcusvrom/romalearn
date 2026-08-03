import { CourseLevel, LessonType } from '@romalearn/contracts';

export interface TechnologySeedLesson {
  title: string;
  type: LessonType;
  estimatedMinutes: number;
  summary?: string;
  topics?: string[];
  activityInstructions?: string;
}

export interface TechnologySeedSection {
  title: string;
  summary: string;
  lessons: TechnologySeedLesson[];
}

export interface TechnologySeedCourse {
  slug: string;
  title: string;
  subtitle: string;
  shortDescription: string;
  fullDescription: string;
  objectives: string[];
  targetAudience: string[];
  prerequisites: string[];
  workloadHours: number;
  level: CourseLevel;
  isFree: boolean;
  order: number;
  priceCents: number;
  sections: TechnologySeedSection[];
}

const activity = (title: string, instructions: string): TechnologySeedLesson => ({
  title,
  type: LessonType.PRACTICAL_ACTIVITY,
  estimatedMinutes: 45,
  activityInstructions:
    `${instructions}\n\nUse apenas dados fictícios ou autorizados. Ao concluir, descreva o que fez, ` +
    'quais decisões tomou e o que ainda ficou com dúvida.',
});

const TECHNOLOGY_COURSE_DEFINITIONS: TechnologySeedCourse[] = [
  {
    slug: 'logica-de-programacao-e-algoritmos',
    title: 'Lógica de Programação e Algoritmos',
    subtitle: 'Aprenda a pensar como uma pessoa desenvolvedora antes de escolher uma linguagem',
    shortDescription:
      'Variáveis, decisões, repetições, funções e resolução de problemas com exercícios progressivos.',
    fullDescription:
      'Seu repositório de estudos já está pronto. Agora começa o segundo capítulo da jornada: aprender a ' +
      'transformar situações confusas em passos claros, regras testáveis e resultados previsíveis.\n\n' +
      'Você acompanhará a evolução de um organizador de tarefas, da primeira ideia ao projeto final. Cada ' +
      'aula acrescenta uma decisão ao mesmo problema, sem depender de uma linguagem específica.',
    objectives: [
      'Decompor problemas em passos menores.',
      'Usar variáveis, operadores e tipos de dados.',
      'Aplicar decisões e estruturas de repetição.',
      'Criar funções simples e reutilizáveis.',
      'Ler, testar e corrigir algoritmos.',
    ],
    targetAudience: [
      'Pessoas sem experiência em programação.',
      'Estudantes iniciando na área de tecnologia.',
    ],
    prerequisites: [
      'Não é necessário conhecimento prévio de programação.',
      'Recomenda-se concluir Git e GitHub na Prática para registrar os exercícios desde o início.',
    ],
    workloadHours: 28,
    level: CourseLevel.BEGINNER,
    isFree: false,
    order: 11,
    priceCents: 5900,
    sections: [
      {
        title: 'Parte 1 — Pensamento computacional',
        summary: 'Entenda como transformar objetivos em instruções verificáveis.',
        lessons: [
          {
            title: 'O que é um algoritmo',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 20,
            summary: 'Um algoritmo é uma sequência clara de passos para chegar a um resultado.',
            topics: ['Entrada, processamento e saída', 'Sequência e precisão', 'Teste de mesa'],
          },
          {
            title: 'Decomposição e reconhecimento de padrões',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 25,
            summary: 'Divida problemas grandes e reaproveite soluções semelhantes.',
            topics: ['Decomposição', 'Padrões', 'Abstração'],
          },
          activity(
            'Prática — Escreva seu primeiro algoritmo',
            'Crie um algoritmo para organizar uma rotina de estudos e teste-o com dois cenários diferentes.',
          ),
        ],
      },
      {
        title: 'Parte 2 — Dados, decisões e repetições',
        summary: 'Construa algoritmos capazes de guardar informações e reagir a condições.',
        lessons: [
          {
            title: 'Variáveis, constantes e tipos de dados',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 30,
            summary: 'Aprenda a representar textos, números e valores lógicos.',
            topics: ['Variáveis', 'Tipos primitivos', 'Conversão e validação'],
          },
          {
            title: 'Operadores e expressões',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 25,
            summary: 'Combine valores para calcular, comparar e tomar decisões.',
            topics: ['Aritméticos', 'Relacionais', 'Lógicos'],
          },
          {
            title: 'Condições e caminhos alternativos',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 30,
            summary: 'Use condições para escolher o próximo passo do algoritmo.',
            topics: ['Se e senão', 'Condições compostas', 'Casos limites'],
          },
          {
            title: 'Repetições e contadores',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 30,
            summary: 'Automatize tarefas repetitivas com critérios claros de parada.',
            topics: ['Enquanto', 'Para', 'Acumuladores', 'Loops infinitos'],
          },
          activity(
            'Prática — Controle de despesas',
            'Crie um algoritmo que receba despesas, calcule o total e informe se o orçamento foi ultrapassado.',
          ),
        ],
      },
      {
        title: 'Parte 3 — Funções, testes e projeto',
        summary: 'Organize soluções reutilizáveis e valide o comportamento esperado.',
        lessons: [
          {
            title: 'Funções e responsabilidades',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 30,
            summary: 'Separe responsabilidades e evite repetir lógica.',
            topics: ['Parâmetros', 'Retorno', 'Responsabilidade única'],
          },
          {
            title: 'Erros, testes e depuração',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 30,
            summary: 'Investigue resultados incorretos de forma sistemática.',
            topics: ['Teste de mesa', 'Casos felizes e limites', 'Depuração'],
          },
          activity(
            'Projeto final — Organizador de tarefas',
            'Modele um programa de tarefas com cadastro, prioridade, conclusão e relatório resumido.',
          ),
        ],
      },
    ],
  },
  {
    slug: 'git-e-github-na-pratica',
    title: 'Git e GitHub na Prática',
    subtitle: 'Versionamento, colaboração e portfólio profissional',
    shortDescription:
      'Aprenda commits, branches, pull requests e publicação de projetos no GitHub.',
    fullDescription:
      'Este é o primeiro capítulo gratuito da trilha. Você começa com uma pasta confusa e termina com um ' +
      'repositório que conta, passo a passo, a história do seu trabalho.\n\n' +
      'Esse repositório será seu caderno de bordo: nele você registrará os exercícios e projetos dos cursos ' +
      'seguintes, com histórico, documentação, branches e revisão.',
    objectives: [
      'Criar repositórios.',
      'Registrar mudanças com bons commits.',
      'Trabalhar com branches.',
      'Abrir e revisar pull requests.',
      'Publicar projetos com README claro.',
    ],
    targetAudience: ['Estudantes de programação.', 'Pessoas iniciando projetos colaborativos.'],
    prerequisites: [
      'Conhecimentos básicos de arquivos e terminal ajudam, mas não são obrigatórios.',
    ],
    workloadHours: 18,
    level: CourseLevel.BEGINNER,
    isFree: true,
    order: 10,
    priceCents: 0,
    sections: [
      {
        title: 'Parte 1 — Controle de versão',
        summary: 'Entenda o problema que Git resolve e crie seu primeiro histórico.',
        lessons: [
          {
            title: 'Por que versionar código',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 20,
            summary: 'Compare arquivos soltos com um histórico rastreável.',
            topics: ['Repositório', 'Snapshot', 'Histórico'],
          },
          {
            title: 'Instalação e configuração inicial',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 25,
            summary: 'Configure identidade e ambiente.',
            topics: ['git config', 'Terminal', 'Editor'],
          },
          {
            title: 'Add, commit e status',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 30,
            summary: 'Registre mudanças pequenas e compreensíveis.',
            topics: ['Working tree', 'Stage', 'Commit'],
          },
          activity(
            'Prática — Seu primeiro histórico',
            'Crie um repositório local e registre pelo menos três mudanças com mensagens claras.',
          ),
        ],
      },
      {
        title: 'Parte 2 — GitHub e colaboração',
        summary: 'Publique código e trabalhe com mudanças isoladas.',
        lessons: [
          {
            title: 'Repositório remoto e push',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 25,
            summary: 'Conecte o projeto local ao GitHub.',
            topics: ['remote', 'push', 'pull'],
          },
          {
            title: 'Branches e merge',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 30,
            summary: 'Isole mudanças antes de integrá-las.',
            topics: ['Branch', 'Merge', 'Conflitos'],
          },
          {
            title: 'Pull requests e revisão',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 30,
            summary: 'Apresente contexto e receba feedback.',
            topics: ['Descrição', 'Review', 'Checks'],
          },
          activity(
            'Prática — Fluxo de feature',
            'Crie uma branch, implemente uma mudança e abra um pull request documentado.',
          ),
        ],
      },
      {
        title: 'Parte 3 — Portfólio e projeto',
        summary: 'Transforme o repositório em evidência profissional.',
        lessons: [
          {
            title: 'README que explica o projeto',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 30,
            summary: 'Documente objetivo, execução e decisões.',
            topics: ['Estrutura', 'Screenshots', 'Como executar'],
          },
          {
            title: 'Issues, releases e organização',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 25,
            summary: 'Organize trabalho e versões.',
            topics: ['Issues', 'Labels', 'Releases'],
          },
          activity(
            'Projeto final — Repositório profissional',
            'Publique um projeto com README, issues, branch de feature, pull request e release.',
          ),
        ],
      },
    ],
  },
  {
    slug: 'html-e-css-do-zero',
    title: 'HTML e CSS do Zero',
    subtitle: 'Construa páginas acessíveis, responsivas e publicáveis',
    shortDescription:
      'Estrutura semântica, estilos, layouts responsivos e publicação de uma landing page.',
    fullDescription:
      'A solução que você planejou em Lógica ganha uma casa visível na web. Primeiro você constrói a estrutura ' +
      'e o significado; depois cria uma identidade visual que continua funcionando em diferentes telas.\n\n' +
      'O capítulo termina com uma landing page acessível, responsiva, publicada e registrada no repositório ' +
      'profissional iniciado no começo da trilha.',
    objectives: [
      'Estruturar páginas com HTML semântico.',
      'Aplicar estilos com CSS.',
      'Criar layouts responsivos.',
      'Melhorar acessibilidade.',
      'Publicar uma landing page.',
    ],
    targetAudience: ['Pessoas iniciando no desenvolvimento web.'],
    prerequisites: ['Recomenda-se concluir Lógica e Git/GitHub.'],
    workloadHours: 32,
    level: CourseLevel.BEGINNER,
    isFree: false,
    order: 12,
    priceCents: 7900,
    sections: [
      {
        title: 'Parte 1 — HTML e significado',
        summary: 'Crie páginas compreensíveis por pessoas, navegadores e leitores de tela.',
        lessons: [
          {
            title: 'Como a web funciona',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 25,
            summary: 'Entenda navegador, servidor, URL e documento.',
            topics: ['HTTP', 'Navegador', 'Arquivos web'],
          },
          {
            title: 'Estrutura de um documento HTML',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 30,
            summary: 'Monte a base de uma página.',
            topics: ['doctype', 'head', 'body'],
          },
          {
            title: 'HTML semântico e acessibilidade',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 35,
            summary: 'Use elementos pelo significado.',
            topics: ['header', 'main', 'section', 'formulários', 'texto alternativo'],
          },
          activity(
            'Prática — Página de apresentação',
            'Crie uma página semântica com apresentação, competências, projetos e contato.',
          ),
        ],
      },
      {
        title: 'Parte 2 — CSS e layout',
        summary: 'Controle aparência, espaçamento e organização visual.',
        lessons: [
          {
            title: 'Seletores, cascata e especificidade',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 35,
            summary: 'Entenda como o navegador escolhe estilos.',
            topics: ['Seletores', 'Herança', 'Cascata'],
          },
          {
            title: 'Box model, tipografia e cores',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 35,
            summary: 'Construa uma base visual consistente.',
            topics: ['Margin', 'Padding', 'Contraste'],
          },
          {
            title: 'Flexbox e Grid',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 40,
            summary: 'Organize componentes e páginas.',
            topics: ['Eixos', 'Alinhamento', 'Grid responsivo'],
          },
          activity(
            'Prática — Seção responsiva',
            'Implemente uma seção de cards que se adapte a celular, tablet e desktop.',
          ),
        ],
      },
      {
        title: 'Parte 3 — Responsividade e publicação',
        summary: 'Finalize uma página pronta para usuários reais.',
        lessons: [
          {
            title: 'Mobile first e media queries',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 35,
            summary: 'Projete primeiro para telas pequenas.',
            topics: ['Breakpoints', 'Unidades fluidas', 'Imagens responsivas'],
          },
          {
            title: 'Formulários e estados de interação',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 30,
            summary: 'Crie campos e botões claros.',
            topics: ['Labels', 'Focus', 'Hover', 'Validação'],
          },
          {
            title: 'Performance e publicação',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 30,
            summary: 'Otimize arquivos e publique o projeto.',
            topics: ['Imagens', 'Lighthouse', 'GitHub Pages'],
          },
          activity(
            'Projeto final — Landing page profissional',
            'Construa e publique uma landing page responsiva, acessível e documentada no GitHub.',
          ),
        ],
      },
    ],
  },
  {
    slug: 'javascript-fundamentos',
    title: 'JavaScript — Fundamentos',
    subtitle: 'Da lógica à interação no navegador',
    shortDescription: 'Variáveis, funções, arrays, objetos, DOM, eventos e consumo básico de APIs.',
    fullDescription:
      'Sua página já apresenta uma ideia, mas ainda não reage. Neste capítulo ela passa a receber entradas, ' +
      'guardar estado, responder a eventos e buscar dados externos.\n\n' +
      'A narrativa acompanha a evolução de uma lista simples até um painel publicável, sempre mostrando os ' +
      'estados de carregamento, sucesso, vazio e erro que aplicações reais precisam comunicar.',
    objectives: [
      'Dominar fundamentos da linguagem.',
      'Manipular arrays e objetos.',
      'Usar funções.',
      'Interagir com o DOM.',
      'Consumir uma API simples.',
    ],
    targetAudience: ['Alunos que já conhecem HTML e CSS.'],
    prerequisites: ['Lógica de programação', 'HTML e CSS básicos'],
    workloadHours: 36,
    level: CourseLevel.BEGINNER,
    isFree: false,
    order: 13,
    priceCents: 8900,
    sections: [
      {
        title: 'Parte 1 — Linguagem',
        summary: 'Construa uma base segura de JavaScript.',
        lessons: [
          {
            title: 'Variáveis, tipos e operadores',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 35,
            summary: 'Represente e transforme dados.',
            topics: ['let e const', 'Tipos', 'Comparações'],
          },
          {
            title: 'Condições, loops e funções',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 40,
            summary: 'Controle o fluxo e reutilize lógica.',
            topics: ['if', 'for', 'function', 'arrow functions'],
          },
          {
            title: 'Arrays e objetos',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 40,
            summary: 'Organize coleções e entidades.',
            topics: ['map', 'filter', 'find', 'objetos'],
          },
          activity(
            'Prática — Lista de tarefas em memória',
            'Implemente operações de adicionar, concluir, filtrar e remover tarefas.',
          ),
        ],
      },
      {
        title: 'Parte 2 — Navegador',
        summary: 'Conecte a linguagem à interface.',
        lessons: [
          {
            title: 'DOM e seleção de elementos',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 35,
            summary: 'Leia e altere a página com segurança.',
            topics: ['querySelector', 'textContent', 'classes'],
          },
          {
            title: 'Eventos e formulários',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 35,
            summary: 'Responda às ações do usuário.',
            topics: ['click', 'submit', 'validação'],
          },
          {
            title: 'Estado e armazenamento local',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 30,
            summary: 'Mantenha informações entre sessões.',
            topics: ['JSON', 'localStorage', 'estado'],
          },
          activity(
            'Prática — Lista de tarefas interativa',
            'Conecte a lista de tarefas a uma interface HTML e persista os dados localmente.',
          ),
        ],
      },
      {
        title: 'Parte 3 — Assincronicidade e projeto',
        summary: 'Trabalhe com dados externos.',
        lessons: [
          {
            title: 'Promises, async e await',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 40,
            summary: 'Entenda operações que levam tempo.',
            topics: ['Promise', 'try/catch', 'async/await'],
          },
          {
            title: 'Fetch e APIs REST',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 40,
            summary: 'Consuma dados de uma API.',
            topics: ['HTTP', 'fetch', 'tratamento de erro'],
          },
          activity(
            'Projeto final — Painel de informações',
            'Crie um painel responsivo que consulte uma API pública, trate erros e permita filtrar resultados.',
          ),
        ],
      },
    ],
  },
  {
    slug: 'python-para-iniciantes',
    title: 'Python para Iniciantes',
    subtitle: 'Automação, dados e desenvolvimento de programas simples',
    shortDescription: 'Sintaxe, estruturas de dados, funções, arquivos e automações úteis.',
    fullDescription:
      'Na primeira bifurcação da trilha, você escolhe Python para automatizar rotinas e trabalhar com arquivos. ' +
      'O fio condutor é uma equipe que recebe relatórios repetitivos e precisa transformar trabalho manual em ' +
      'um processo seguro, reproduzível e explicável.\n\n' +
      'Esta é uma alternativa inicial ao curso de Java: você não precisa concluir os dois para encerrar a jornada.',
    objectives: [
      'Escrever programas Python.',
      'Manipular coleções.',
      'Criar funções.',
      'Ler e escrever arquivos.',
      'Automatizar uma rotina.',
    ],
    targetAudience: ['Pessoas iniciando em programação ou automação.'],
    prerequisites: ['Recomenda-se concluir Lógica de Programação.'],
    workloadHours: 36,
    level: CourseLevel.BEGINNER,
    isFree: false,
    order: 14,
    priceCents: 8900,
    sections: [
      {
        title: 'Parte 1 — Fundamentos',
        summary: 'Conheça a linguagem e escreva os primeiros programas.',
        lessons: [
          {
            title: 'Ambiente e primeiro programa',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 30,
            summary: 'Prepare o ambiente e execute código.',
            topics: ['Python', 'Terminal', 'Editor'],
          },
          {
            title: 'Variáveis, tipos e entrada de dados',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 35,
            summary: 'Receba, valide e transforme valores.',
            topics: ['str', 'int', 'float', 'input'],
          },
          {
            title: 'Condições e repetições',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 40,
            summary: 'Controle o fluxo do programa.',
            topics: ['if', 'for', 'while'],
          },
          activity(
            'Prática — Calculadora de orçamento',
            'Crie um programa que receba receitas e despesas e gere um resumo.',
          ),
        ],
      },
      {
        title: 'Parte 2 — Estruturas e funções',
        summary: 'Organize dados e responsabilidades.',
        lessons: [
          {
            title: 'Listas, tuplas e dicionários',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 40,
            summary: 'Escolha estruturas adequadas.',
            topics: ['list', 'tuple', 'dict'],
          },
          {
            title: 'Funções, módulos e pacotes',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 40,
            summary: 'Reutilize código e organize arquivos.',
            topics: ['def', 'import', 'venv'],
          },
          {
            title: 'Erros e testes básicos',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 35,
            summary: 'Trate falhas esperadas.',
            topics: ['try/except', 'assert', 'casos de teste'],
          },
          activity(
            'Prática — Cadastro em memória',
            'Crie um cadastro simples com inclusão, busca, edição e remoção.',
          ),
        ],
      },
      {
        title: 'Parte 3 — Arquivos e automação',
        summary: 'Crie uma automação útil e segura.',
        lessons: [
          {
            title: 'Arquivos CSV e JSON',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 40,
            summary: 'Leia e grave dados estruturados.',
            topics: ['open', 'csv', 'json'],
          },
          {
            title: 'Automação de tarefas',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 35,
            summary: 'Automatize arquivos e relatórios.',
            topics: ['pathlib', 'datas', 'organização'],
          },
          activity(
            'Projeto final — Organizador de relatórios',
            'Crie uma automação que leia arquivos, valide dados e gere um relatório consolidado.',
          ),
        ],
      },
    ],
  },
  {
    slug: 'java-fundamentos-e-orientacao-a-objetos',
    title: 'Java — Fundamentos e Orientação a Objetos',
    subtitle: 'Construa aplicações organizadas com uma base sólida',
    shortDescription:
      'Sintaxe, classes, objetos, coleções, exceções e projeto orientado a objetos.',
    fullDescription:
      'Na primeira bifurcação da trilha, você escolhe Java para modelar sistemas com regras de negócio claras. ' +
      'O fio condutor é uma biblioteca que precisa controlar livros, usuários e empréstimos sem aceitar estados ' +
      'contraditórios.\n\n' +
      'Esta é uma alternativa inicial ao curso de Python: você não precisa concluir os dois para encerrar a jornada.',
    objectives: [
      'Configurar o ambiente Java.',
      'Criar classes e objetos.',
      'Aplicar encapsulamento.',
      'Usar coleções.',
      'Tratar exceções.',
      'Construir uma aplicação de console.',
    ],
    targetAudience: ['Pessoas que desejam seguir no desenvolvimento backend com Java.'],
    prerequisites: ['Lógica de programação', 'Noções de Git são recomendadas.'],
    workloadHours: 44,
    level: CourseLevel.BEGINNER,
    isFree: false,
    order: 15,
    priceCents: 9900,
    sections: [
      {
        title: 'Parte 1 — Fundamentos da linguagem',
        summary: 'Prepare o ambiente e domine a sintaxe essencial.',
        lessons: [
          {
            title: 'JDK, JVM e primeiro programa',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 35,
            summary: 'Entenda como Java é compilado e executado.',
            topics: ['JDK', 'JVM', 'main'],
          },
          {
            title: 'Tipos, operadores e controle de fluxo',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 45,
            summary: 'Construa regras e repetições.',
            topics: ['Tipos', 'if', 'switch', 'loops'],
          },
          {
            title: 'Métodos e organização do código',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 40,
            summary: 'Divida responsabilidades.',
            topics: ['Métodos', 'Parâmetros', 'Retorno'],
          },
          activity(
            'Prática — Sistema de notas',
            'Crie um programa que calcule médias e classifique resultados.',
          ),
        ],
      },
      {
        title: 'Parte 2 — Orientação a objetos',
        summary: 'Modele problemas com classes e responsabilidades claras.',
        lessons: [
          {
            title: 'Classes, objetos e construtores',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 45,
            summary: 'Modele entidades e estados.',
            topics: ['Classe', 'Objeto', 'Construtor'],
          },
          {
            title: 'Encapsulamento e validação',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 40,
            summary: 'Proteja invariantes do domínio.',
            topics: ['private', 'getters', 'setters', 'validação'],
          },
          {
            title: 'Herança, interfaces e composição',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 50,
            summary: 'Entenda diferentes formas de reutilização.',
            topics: ['extends', 'interface', 'composição'],
          },
          activity(
            'Prática — Catálogo de produtos',
            'Modele produtos, categorias e regras de preço com orientação a objetos.',
          ),
        ],
      },
      {
        title: 'Parte 3 — Coleções, erros e projeto',
        summary: 'Construa uma aplicação organizada e resiliente.',
        lessons: [
          {
            title: 'Coleções e generics',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 45,
            summary: 'Organize conjuntos de objetos.',
            topics: ['List', 'Set', 'Map', 'Generics'],
          },
          {
            title: 'Exceções e testes básicos',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 40,
            summary: 'Trate erros sem esconder problemas.',
            topics: ['Exception', 'try/catch', 'JUnit'],
          },
          activity(
            'Projeto final — Gestão de biblioteca',
            'Crie uma aplicação de console com livros, usuários, empréstimos, validações e testes básicos.',
          ),
        ],
      },
    ],
  },
];

/** Catálogo sempre exportado na mesma ordem em que aparece para o aluno. */
export const TECHNOLOGY_COURSES: TechnologySeedCourse[] = [...TECHNOLOGY_COURSE_DEFINITIONS].sort(
  (left, right) => left.order - right.order,
);
