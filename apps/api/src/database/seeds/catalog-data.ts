import { CourseLevel, LessonType, MaterialKind, QuestionType } from '@romalearn/contracts';
import { ActivityRubric, EbookReference, LessonContent } from './content/content-types';
import { enrichSections } from './content/apply-content';
import { MODULE_01_ENRICHMENT } from './content/modulo-01-windows';
import { FREE_MODULE_SECTIONS } from './content/modulo-gratuito';

/**
 * Estrutura inicial dos cursos.
 *
 * Todo o conteúdo abaixo foi extraído dos e-books oficiais da trilha
 * (sumários, títulos de partes e capítulos e a frase "Neste capítulo" de
 * cada capítulo). Nada aqui contradiz ou substitui os materiais oficiais:
 * cada aula aponta para o e-book correspondente, que segue sendo a fonte
 * completa do conteúdo.
 *
 * O Módulo 5 (IA para Processos Administrativos) ainda não possui e-book
 * disponível, por isso é cadastrado como rascunho e sem capítulos —
 * preferimos um curso incompleto e honesto a um curso inventado.
 */

export interface SeedQuestion {
  statement: string;
  type: QuestionType;
  explanation: string;
  options: { text: string; isCorrect: boolean }[];
}

export interface SeedLesson {
  title: string;
  type: LessonType;
  estimatedMinutes: number;
  /** Resumo oficial do capítulo ("Neste capítulo…"). */
  summary?: string;
  /** Tópicos listados no e-book para o capítulo. */
  topics?: string[];
  /**
   * Conteúdo do capítulo em blocos estruturados. Quando presente, substitui
   * o texto mínimo montado a partir de `summary` e `topics`.
   */
  content?: LessonContent;
  activityInstructions?: string;
  /** Rubrica de correção da atividade prática. */
  rubric?: ActivityRubric;
  /** Origem dos critérios da rubrica no e-book. */
  rubricReference?: EbookReference;
  questions?: SeedQuestion[];
  passingScore?: number;
}

export interface SeedSection {
  title: string;
  summary: string;
  lessons: SeedLesson[];
}

export interface SeedCourse {
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
  /** Nome do e-book oficial anexado como material de apoio. */
  ebookTitle: string;
  sections: SeedSection[];
}

const CONFIRM_ACTIVITY =
  'Faça a prática com dados fictícios, guarde o arquivo na sua pasta de estudos e descreva ' +
  'abaixo o que você fez e o que ainda ficou com dúvida.';

// ---------------------------------------------------------------------------
// Módulo Extra Gratuito
// ---------------------------------------------------------------------------

const FREE_MODULE: SeedCourse = {
  slug: 'carreira-digital-e-destaque-profissional',
  title: 'Carreira Digital e Destaque Profissional',
  subtitle: 'Tecnologia, LinkedIn, networking e inteligência artificial no trabalho',
  shortDescription:
    'Módulo gratuito que mostra como transformar conhecimento em evidência, presença e evolução profissional.',
  fullDescription:
    'Você já percebeu que quase toda profissão usa tecnologia? Mesmo quem não trabalha em TI precisa ' +
    'organizar arquivos, escrever documentos, acompanhar informações, apresentar ideias e aprender ' +
    'ferramentas novas.\n\n' +
    'Este módulo gratuito mostra como os conhecimentos dos cinco módulos da trilha podem se transformar ' +
    'em preparo, evidências e destaque profissional. Você também aprenderá primeiros passos de LinkedIn, ' +
    'networking online e uso responsável de inteligência artificial no trabalho.\n\n' +
    '**Ideia principal:** aprender é o começo. O valor profissional aparece quando você pratica, entrega, ' +
    'confere, explica e continua evoluindo.\n\n' +
    'Este material melhora preparo e clareza. Ele não garante emprego, salário, promoção ou aprovação ' +
    'em processo seletivo.',
  objectives: [
    'Reconhecer o papel da tecnologia em diferentes profissões.',
    'Distinguir conhecimento inicial de proficiência.',
    'Criar uma primeira evidência profissional verdadeira.',
    'Estruturar um perfil básico no LinkedIn.',
    'Escrever mensagens de networking com respeito e clareza.',
    'Escolher usos simples e seguros de inteligência artificial.',
    'Montar um plano profissional de 30 dias.',
  ],
  targetAudience: [
    'Pessoas começando a usar tecnologia.',
    'Estudantes e leitores mais jovens acompanhados por adulto ou professor.',
    'Profissionais administrativos e de atendimento.',
    'Pessoas buscando o primeiro emprego ou uma mudança de área.',
    'Quem deseja usar IA no trabalho sem abandonar revisão e responsabilidade.',
  ],
  prerequisites: ['Não é necessário conhecimento prévio.'],
  workloadHours: 8,
  level: CourseLevel.BEGINNER,
  isFree: true,
  order: 0,
  ebookTitle: 'Módulo Extra Gratuito — Carreira Digital e Destaque Profissional (Edição 2026)',
  sections: FREE_MODULE_SECTIONS,
};

// ---------------------------------------------------------------------------
// Módulo 1 — Introdução à Computação e Windows
// ---------------------------------------------------------------------------

const MODULE_01: SeedCourse = {
  slug: 'introducao-a-computacao-e-windows',
  title: 'Introdução à Computação e ao Windows',
  subtitle: 'Aprenda com calma, pratique sem medo',
  shortDescription:
    'Windows, arquivos, organização, atalhos e segurança digital para quem está começando.',
  fullDescription:
    'E-book didático para primeiros passos no computador. Uma apresentação tranquila das partes do ' +
    'computador, dos principais espaços do Windows e dos hábitos que evitam perder arquivos.\n\n' +
    'Comece pela Parte 1 se você ainda se confunde com mouse, teclado ou janelas. Use a Parte 2 quando ' +
    'precisar organizar, salvar ou enviar arquivos. Consulte a Parte 3 para pesquisar mais rápido, ' +
    'recuperar itens e trabalhar com segurança.',
  objectives: [
    'Reconhecer hardware, software e Windows.',
    'Usar mouse, teclado e recursos básicos de acessibilidade.',
    'Abrir programas e organizar janelas.',
    'Diferenciar arquivos, pastas, caminhos e extensões.',
    'Copiar, mover, renomear e recuperar itens com segurança.',
    'Pesquisar e usar atalhos essenciais.',
    'Diferenciar nuvem, sincronização e backup.',
    'Adotar hábitos simples de segurança digital.',
  ],
  targetAudience: [
    'Pessoas que nunca usaram um computador ou ainda sentem insegurança.',
    'Crianças e adolescentes acompanhados por um adulto ou educador.',
    'Estudantes que precisam organizar trabalhos e arquivos.',
    'Profissionais iniciantes em rotinas administrativas.',
    'Pessoas que desejam revisar os fundamentos do Windows.',
  ],
  prerequisites: ['Não é necessário conhecimento prévio.'],
  workloadHours: 12,
  level: CourseLevel.BEGINNER,
  isFree: false,
  order: 1,
  ebookTitle: 'Módulo 1 — Introdução à Computação e ao Windows (Edição 2026)',
  sections: enrichSections(
    [
      {
        title: 'Parte 1 — Conhecendo o computador',
        summary:
          'Uma apresentação tranquila das partes do computador e dos principais espaços do Windows. ' +
          'Ao terminar esta parte: reconhecer hardware, software e Windows; usar mouse, teclado e ' +
          'recursos básicos de acessibilidade; abrir programas e organizar janelas.',
        lessons: [
          {
            title: 'Capítulo 1 — O computador como escritório digital',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 20,
            summary:
              'Entenda o que o computador faz e aprenda a diferenciar equipamento, programa e Windows.',
            topics: ['O que um computador faz', 'Hardware, software e Windows'],
          },
          {
            title: 'Capítulo 2 — Mouse, teclado e interação sem medo',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 20,
            summary: 'Aprenda os movimentos e as teclas que ajudam a conversar com o computador.',
            topics: ['O mouse é como um dedo na tela', 'Teclas essenciais e acessibilidade'],
          },
          {
            title: 'Capítulo 3 — Conhecendo o Windows e suas janelas',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 20,
            summary:
              'Use a Área de Trabalho, o Menu Iniciar e a barra de tarefas para abrir e organizar programas.',
            topics: ['Os espaços principais do Windows', 'Abrir, alternar e organizar janelas'],
          },
        ],
      },
      {
        title: 'Parte 2 — Cuidando dos arquivos',
        summary:
          'Ao terminar esta parte: diferenciar arquivos, pastas, caminhos e extensões; copiar, mover, ' +
          'renomear e restaurar itens com segurança.',
        lessons: [
          {
            title: 'Capítulo 4 — Arquivos, pastas e tipos de documento',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 20,
            summary:
              'Descubra onde os documentos ficam e o que partes como .docx, .xlsx e .pdf significam.',
            topics: ['Documento, gaveta e endereço', 'Extensões mais comuns'],
          },
          {
            title: 'Capítulo 5 — Organizando itens no Explorador de Arquivos',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 20,
            summary:
              'Crie pastas e aprenda a copiar, mover, renomear, excluir e restaurar itens com segurança.',
            topics: ['Abra e navegue pelo Explorador', 'Copiar, mover e restaurar'],
          },
          {
            title: 'Capítulo 6 — Pastas e nomes que todos entendem',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 15,
            summary:
              'Monte uma organização simples para encontrar o documento certo sem depender da memória.',
            topics: ['As três perguntas de uma boa organização', 'Padrões de nome e versão'],
          },
          {
            title: 'Capítulo 7 — Salvar, baixar, anexar, compartilhar e criar PDF',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 20,
            summary: 'Leve arquivos de um lugar para outro e confira tudo antes de enviar.',
            topics: ['Palavras que parecem iguais, mas não são', 'Conferência antes do envio'],
          },
          {
            title: 'Prática — Organize e envie um documento',
            type: LessonType.PRACTICAL_ACTIVITY,
            estimatedMinutes: 25,
            activityInstructions:
              'Crie uma pasta de estudos, salve um documento com nome descritivo, gere uma versão em PDF ' +
              'e escreva o passo a passo que você seguiu. ' +
              CONFIRM_ACTIVITY,
          },
        ],
      },
      {
        title: 'Parte 3 — Rapidez, recuperação e segurança',
        summary:
          'Ao terminar esta parte: pesquisar e usar atalhos essenciais; diferenciar nuvem, ' +
          'sincronização e backup; adotar hábitos de segurança digital.',
        lessons: [
          {
            title: 'Capítulo 8 — Pesquisa e atalhos que economizam tempo',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 20,
            summary:
              'Encontre arquivos e aprenda poucos atalhos por vez, sempre entendendo o que eles fazem.',
            topics: ['Encontre um arquivo', 'Atalhos essenciais'],
          },
          {
            title: 'Capítulo 9 — Nuvem, backup e recuperação',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 20,
            summary:
              'Entenda onde os arquivos ficam e o que fazer quando algo parece ter desaparecido.',
            topics: ['Onde um arquivo pode ficar', 'Backup e recuperação'],
          },
          {
            title: 'Capítulo 10 — Segurança digital para todos',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 20,
            summary: 'Proteja sua conta, seus documentos e outras pessoas com hábitos simples.',
            topics: ['Três cuidados com a informação', 'Senhas, golpes e privacidade'],
          },
        ],
      },
      {
        title: 'Projeto final e conclusão',
        summary: 'Junte tudo em um pequeno escritório digital e verifique sua compreensão.',
        lessons: [
          {
            title: 'Projeto final — Organize um pequeno escritório',
            type: LessonType.PRACTICAL_ACTIVITY,
            estimatedMinutes: 45,
            activityInstructions:
              'Monte a estrutura de pastas de um pequeno escritório usando arquivos fictícios. Aplique um ' +
              'padrão de nomes, salve uma versão em PDF, simule uma recuperação da Lixeira e escreva o que ' +
              'você faria para manter um backup.',
          },
          {
            title: 'Guia rápido, glossário e referências oficiais',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 10,
            summary: 'Consulte atalhos, termos novos e as fontes oficiais citadas no e-book.',
            topics: ['Guia rápido e glossário', 'Referências oficiais'],
          },
          {
            title: 'Questionário de conclusão',
            type: LessonType.QUIZ,
            estimatedMinutes: 10,
            passingScore: 70,
            questions: [
              {
                statement: 'Qual é a diferença entre hardware e software?',
                type: QuestionType.SINGLE_CHOICE,
                explanation:
                  'O hardware é como os móveis e equipamentos de um escritório; os programas (software) ' +
                  'são o que faz o trabalho acontecer.',
                options: [
                  {
                    text: 'Hardware é a parte física do equipamento; software são os programas.',
                    isCorrect: true,
                  },
                  {
                    text: 'Hardware são os programas; software é a parte física.',
                    isCorrect: false,
                  },
                  { text: 'São dois nomes para a mesma coisa.', isCorrect: false },
                  { text: 'Hardware só existe em computadores de mesa.', isCorrect: false },
                ],
              },
              {
                statement: 'Na analogia usada no e-book, o que representa o caminho de um arquivo?',
                type: QuestionType.SINGLE_CHOICE,
                explanation:
                  'O arquivo é a folha, a pasta é a gaveta e o caminho é o endereço que leva até ela.',
                options: [
                  { text: 'A folha guardada.', isCorrect: false },
                  { text: 'A gaveta onde a folha fica.', isCorrect: false },
                  { text: 'O endereço que leva até a gaveta.', isCorrect: true },
                  { text: 'O nome do programa que abre o arquivo.', isCorrect: false },
                ],
              },
              {
                statement: 'Quais são as quatro etapas que quase toda tarefa do computador segue?',
                type: QuestionType.SINGLE_CHOICE,
                explanation:
                  'A informação entra, o programa processa, o conteúdo é armazenado e o resultado é entregue.',
                options: [
                  { text: 'Entrada, processamento, armazenamento e saída.', isCorrect: true },
                  { text: 'Ligar, digitar, imprimir e desligar.', isCorrect: false },
                  { text: 'Abrir, salvar, fechar e apagar.', isCorrect: false },
                  { text: 'Comprar, instalar, atualizar e descartar.', isCorrect: false },
                ],
              },
              {
                statement:
                  'O que fazer quando o computador parece estar demorando para responder a um clique?',
                type: QuestionType.SINGLE_CHOICE,
                explanation:
                  'O e-book orienta: se o computador estiver demorando, não clique muitas vezes — aguarde alguns segundos.',
                options: [
                  { text: 'Clicar várias vezes até algo acontecer.', isCorrect: false },
                  { text: 'Aguardar alguns segundos antes de clicar de novo.', isCorrect: true },
                  { text: 'Desligar o computador imediatamente pelo botão.', isCorrect: false },
                  { text: 'Reinstalar o programa.', isCorrect: false },
                ],
              },
            ],
          },
        ],
      },
    ],
    MODULE_01_ENRICHMENT,
  ),
};

// ---------------------------------------------------------------------------
// Módulos 2 a 4 — mesma estrutura de três níveis + projeto final
// ---------------------------------------------------------------------------

const MODULE_02: SeedCourse = {
  slug: 'microsoft-word-para-administracao',
  title: 'Microsoft Word para Administração',
  subtitle: 'Do iniciante ao avançado',
  shortDescription:
    'Criação, padronização, colaboração e automação de documentos administrativos no Word.',
  fullDescription:
    'E-book didático para administração. Na rotina administrativa, o Word serve para comunicados, atas, ' +
    'relatórios, procedimentos, contratos, declarações e formulários.\n\n' +
    'Se você está começando, siga os capítulos em ordem e faça a atividade de cada um. Se já usa o Word, ' +
    'vá direto ao problema que deseja resolver. Antes de automatizar, confirme que domina estilos, ' +
    'seções, revisão e acessibilidade.',
  objectives: [
    'Criar, editar e salvar sem sobrescrever o original.',
    'Formatar textos, parágrafos e listas de modo consistente.',
    'Inserir tabelas e imagens e gerar um PDF revisado.',
    'Estruturar documentos com estilos, navegação e sumário.',
    'Controlar seções, cabeçalhos e rodapés.',
    'Revisar em equipe com rastreabilidade e acessibilidade.',
    'Criar modelos e elementos dinâmicos reutilizáveis.',
    'Gerar comunicações em lote com mala direta.',
  ],
  targetAudience: [
    'Estudantes de Administração e áreas relacionadas.',
    'Auxiliares, assistentes e analistas administrativos.',
    'Profissionais em transição que precisam ganhar autonomia no Word.',
    'Pessoas que produzem comunicados, atas, relatórios, procedimentos, declarações ou formulários.',
  ],
  prerequisites: [
    'É recomendável saber abrir programas, localizar arquivos, criar pastas, salvar e renomear documentos.',
  ],
  workloadHours: 16,
  level: CourseLevel.PROGRESSIVE,
  isFree: false,
  order: 2,
  ebookTitle: 'Módulo 2 — Microsoft Word para Administração (Edição 2026)',
  sections: [
    {
      title: 'Parte 1 — Word Iniciante',
      summary: 'Do primeiro documento à entrega em PDF, com hábitos seguros e formatação clara.',
      lessons: [
        {
          title: 'Capítulo 1 — Primeiros passos, edição e salvamento seguro',
          type: LessonType.RICH_TEXT,
          estimatedMinutes: 25,
          summary: 'Conheça a interface do Word, edite com segurança e proteja o arquivo original.',
          topics: ['O Word como bancada de documentos', 'Fluxo seguro para iniciar um documento'],
        },
        {
          title: 'Capítulo 2 — Formatação profissional de textos e listas',
          type: LessonType.RICH_TEXT,
          estimatedMinutes: 25,
          summary:
            'Transforme texto bruto em um documento claro, legível e visualmente consistente.',
          topics: ['Formatação e sinalização', 'Listas e espaçamento'],
        },
        {
          title: 'Capítulo 3 — Tabelas, imagens, página e exportação em PDF',
          type: LessonType.RICH_TEXT,
          estimatedMinutes: 25,
          summary:
            'Insira elementos úteis, organize a página e prepare uma saída pronta para leitura ou impressão.',
          topics: ['Elementos que organizam informação', 'Exportação revisada em PDF'],
        },
      ],
    },
    {
      title: 'Parte 2 — Word Intermediário',
      summary:
        'Ao concluir esta parte: estruturar documentos com estilos, navegação e sumário; controlar ' +
        'seções, cabeçalhos, tabelas e imagens; revisar em equipe com acessibilidade.',
      lessons: [
        {
          title: 'Capítulo 4 — Estilos, hierarquia, navegação e sumário',
          type: LessonType.RICH_TEXT,
          estimatedMinutes: 25,
          summary:
            'Estruture documentos longos para que sejam consistentes, navegáveis e fáceis de atualizar.',
          topics: ['Estilo é regra, não pintura', 'Sumário automático'],
        },
        {
          title: 'Capítulo 5 — Seções, cabeçalhos, tabelas e imagens',
          type: LessonType.RICH_TEXT,
          estimatedMinutes: 25,
          summary:
            'Controle partes diferentes do mesmo documento sem desorganizar o restante do arquivo.',
          topics: ['Página versus seção', 'Cabeçalhos e rodapés por seção'],
        },
        {
          title: 'Capítulo 6 — Revisão, colaboração e acessibilidade',
          type: LessonType.RICH_TEXT,
          estimatedMinutes: 25,
          summary:
            'Revise em equipe com rastreabilidade e entregue documentos utilizáveis por públicos diversos.',
          topics: ['Três camadas de colaboração', 'Verificação de acessibilidade'],
        },
      ],
    },
    {
      title: 'Parte 3 — Word Avançado',
      summary:
        'Ao concluir esta parte: criar modelos e elementos dinâmicos reutilizáveis e gerar ' +
        'comunicações em lote com controle.',
      lessons: [
        {
          title: 'Capítulo 7 — Modelos, blocos, campos e referências',
          type: LessonType.RICH_TEXT,
          estimatedMinutes: 25,
          summary: 'Reutilize estruturas aprovadas e mantenha informações dinâmicas atualizadas.',
          topics: ['Reutilizar sem duplicar erros', 'Campos e referências cruzadas'],
        },
        {
          title: 'Capítulo 8 — Mala direta e documentos em lote',
          type: LessonType.RICH_TEXT,
          estimatedMinutes: 25,
          summary:
            'Combine um modelo com uma fonte de dados para gerar documentos personalizados com controle.',
          topics: ['Modelo, dados e resultado', 'Conferência antes do envio em lote'],
        },
        {
          title: 'Capítulo 9 — Formulários, proteção e finalização',
          type: LessonType.RICH_TEXT,
          estimatedMinutes: 25,
          summary:
            'Crie documentos preenchíveis, compare versões e faça uma inspeção completa antes da entrega.',
          topics: ['Formulário estruturado', 'Inspeção final e proteção'],
        },
      ],
    },
    {
      title: 'Projeto final e conclusão',
      summary: 'Integre os três níveis em uma rotina administrativa completa.',
      lessons: [
        {
          title: 'Projeto final integrado',
          type: LessonType.PRACTICAL_ACTIVITY,
          estimatedMinutes: 60,
          activityInstructions:
            'Produza um documento administrativo completo com dados fictícios: aplique estilos e sumário, ' +
            'configure seções com cabeçalho e rodapé, registre uma rodada de revisão, verifique a ' +
            'acessibilidade e exporte a versão final em PDF.',
        },
        {
          title: 'Questionário de conclusão',
          type: LessonType.QUIZ,
          estimatedMinutes: 10,
          passingScore: 70,
          questions: [
            {
              statement:
                'Ao editar um documento existente, qual é o passo recomendado para preservar o original?',
              type: QuestionType.SINGLE_CHOICE,
              explanation:
                'Se você partiu de um arquivo existente, use "Salvar uma Cópia" antes de editar para preservar o original.',
              options: [
                { text: 'Usar "Salvar uma Cópia" antes de começar a editar.', isCorrect: true },
                { text: 'Editar direto e salvar por cima ao final.', isCorrect: false },
                { text: 'Renomear o arquivo depois de salvar as alterações.', isCorrect: false },
                { text: 'Trabalhar sempre com o documento fechado.', isCorrect: false },
              ],
            },
            {
              statement: 'Qual é a diferença entre quebra de página e quebra de seção?',
              type: QuestionType.SINGLE_CHOICE,
              explanation:
                'A quebra de página apenas inicia outra página; a quebra de seção cria uma nova zona de configuração.',
              options: [
                {
                  text: 'A quebra de página inicia outra página; a de seção cria uma nova zona de configuração.',
                  isCorrect: true,
                },
                { text: 'São exatamente a mesma coisa.', isCorrect: false },
                {
                  text: 'A quebra de seção só funciona em documentos protegidos.',
                  isCorrect: false,
                },
                { text: 'A quebra de página muda o cabeçalho automaticamente.', isCorrect: false },
              ],
            },
            {
              statement: 'O que o e-book recomenda confirmar antes de automatizar documentos?',
              type: QuestionType.SINGLE_CHOICE,
              explanation:
                'Antes de automatizar, confirme que domina estilos, seções, revisão e acessibilidade.',
              options: [
                { text: 'Domínio de estilos, seções, revisão e acessibilidade.', isCorrect: true },
                { text: 'Ter a versão mais recente do Word.', isCorrect: false },
                { text: 'Saber programar macros.', isCorrect: false },
                { text: 'Ter concluído todos os outros módulos da trilha.', isCorrect: false },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const MODULE_03: SeedCourse = {
  slug: 'microsoft-excel-para-administracao',
  title: 'Microsoft Excel para Administração',
  subtitle: 'Do iniciante ao avançado',
  shortDescription: 'Dados, fórmulas, análises e controles para o dia a dia administrativo.',
  fullDescription:
    'E-book didático para administração. O Excel ajuda a guardar informações em uma grade, fazer contas ' +
    'e responder perguntas — controlar materiais, prazos, despesas, presença, pedidos e muitas outras rotinas.\n\n' +
    'Digite as fórmulas em vez de apenas ler: errar e corrigir faz parte do aprendizado. Use somente ' +
    'dados fictícios nos exercícios. Antes de compartilhar, confira fórmulas, filtros, totais, ' +
    'permissões e a versão do arquivo.',
  objectives: [
    'Reconhecer células, linhas, colunas, planilhas e arquivos.',
    'Registrar, formatar e calcular valores básicos.',
    'Criar tabelas, usar filtros e gerar PDF revisado.',
    'Preparar bases limpas e criar alertas compreensíveis.',
    'Usar referências e funções por critérios.',
    'Transformar resultados em gráficos e indicadores claros.',
    'Buscar informações entre tabelas e criar listas dinâmicas.',
    'Resumir bases com Tabelas Dinâmicas e segmentações.',
  ],
  targetAudience: [
    'Pessoas que nunca usaram uma planilha.',
    'Crianças e jovens acompanhados por um adulto ou professor.',
    'Estudantes de Administração e áreas relacionadas.',
    'Auxiliares, assistentes e analistas administrativos.',
    'Profissionais que precisam ganhar segurança com dados e fórmulas.',
  ],
  prerequisites: [
    'É recomendável saber abrir programas, localizar arquivos, criar pastas, salvar e renomear documentos.',
  ],
  workloadHours: 18,
  level: CourseLevel.PROGRESSIVE,
  isFree: false,
  order: 3,
  ebookTitle: 'Módulo 3 — Microsoft Excel para Administração (Edição 2026)',
  sections: [
    {
      title: 'Parte 1 — Excel Iniciante',
      summary: 'Da planilha vazia a uma lista organizada, calculada e pronta para ser entregue.',
      lessons: [
        {
          title: 'Capítulo 1 — O Excel como caderno inteligente',
          type: LessonType.RICH_TEXT,
          estimatedMinutes: 25,
          summary: 'Conheça a tela do Excel e aprenda a registrar informações sem medo de errar.',
          topics: ['Antes de começar: o que o Excel faz', 'As peças da tela'],
        },
        {
          title: 'Capítulo 2 — Formatação e contas que se atualizam',
          type: LessonType.RICH_TEXT,
          estimatedMinutes: 25,
          summary: 'Dê significado aos números e crie fórmulas simples que recalculam sozinhas.',
          topics: ['Valor e aparência', 'Primeiras fórmulas'],
        },
        {
          title: 'Capítulo 3 — Tabelas, classificação, filtros e PDF',
          type: LessonType.RICH_TEXT,
          estimatedMinutes: 25,
          summary:
            'Organize listas, encontre o que importa e prepare uma entrega sem colunas cortadas.',
          topics: ['Transforme a lista em Tabela', 'Classificação, filtros e exportação'],
        },
      ],
    },
    {
      title: 'Parte 2 — Excel Intermediário',
      summary:
        'Ao concluir esta parte: preparar bases limpas, criar alertas compreensíveis e usar ' +
        'referências e funções por critérios.',
      lessons: [
        {
          title: 'Capítulo 4 — Dados limpos e alertas visuais',
          type: LessonType.RICH_TEXT,
          estimatedMinutes: 25,
          summary:
            'Prepare uma base confiável e use regras visuais para encontrar prazos e problemas.',
          topics: ['Uma boa análise começa antes da fórmula', 'Formatação condicional'],
        },
        {
          title: 'Capítulo 5 — Referências e funções por critérios',
          type: LessonType.RICH_TEXT,
          estimatedMinutes: 25,
          summary: 'Faça somas, contagens e decisões com regras claras e fórmulas copiáveis.',
          topics: ['Referências que mudam e referências que ficam', 'Funções por critério'],
        },
        {
          title: 'Capítulo 6 — Gráficos e indicadores que contam uma história',
          type: LessonType.RICH_TEXT,
          estimatedMinutes: 25,
          summary: 'Transforme resultados em mensagens visuais claras para reuniões e relatórios.',
          topics: ['Comece pela pergunta', 'Escolha do tipo de gráfico'],
        },
      ],
    },
    {
      title: 'Parte 3 — Excel Avançado',
      summary:
        'Ao concluir esta parte: buscar informações entre tabelas, criar listas dinâmicas e resumir ' +
        'bases com Tabelas Dinâmicas.',
      lessons: [
        {
          title: 'Capítulo 7 — Buscas e listas que se atualizam',
          type: LessonType.RICH_TEXT,
          estimatedMinutes: 25,
          summary: 'Relacione cadastros por código e crie listas que mudam conforme um critério.',
          topics: ['O que é uma chave de busca', 'Listas dinâmicas'],
        },
        {
          title: 'Capítulo 8 — Tabelas Dinâmicas e segmentações',
          type: LessonType.RICH_TEXT,
          estimatedMinutes: 25,
          summary: 'Resuma muitas linhas arrastando campos e filtre a análise com botões.',
          topics: ['O que a Tabela Dinâmica faz', 'Segmentações de dados'],
        },
        {
          title: 'Capítulo 9 — Validação, proteção e revisão final',
          type: LessonType.RICH_TEXT,
          estimatedMinutes: 25,
          summary:
            'Controle entradas, reduza alterações acidentais e revise o arquivo antes de compartilhar.',
          topics: ['Três tipos de controle', 'Revisão antes de compartilhar'],
        },
      ],
    },
    {
      title: 'Projeto final e conclusão',
      summary: 'Junte os três níveis em uma única rotina de controle.',
      lessons: [
        {
          title: 'Projeto final integrado',
          type: LessonType.PRACTICAL_ACTIVITY,
          estimatedMinutes: 60,
          activityInstructions:
            'Monte um controle administrativo completo com dados fictícios: base limpa, tabela, fórmulas ' +
            'por critério, formatação condicional, um gráfico que responda a uma pergunta, uma Tabela ' +
            'Dinâmica e a revisão final antes de compartilhar.',
        },
        {
          title: 'Guia de consulta rápida e referências oficiais',
          type: LessonType.RICH_TEXT,
          estimatedMinutes: 10,
          summary: 'Consulte funções, atalhos e as fontes oficiais citadas no e-book.',
          topics: ['Guia de consulta rápida', 'Referências oficiais'],
        },
        {
          title: 'Questionário de conclusão',
          type: LessonType.QUIZ,
          estimatedMinutes: 10,
          passingScore: 70,
          questions: [
            {
              statement: 'O que é uma célula em uma planilha?',
              type: QuestionType.SINGLE_CHOICE,
              explanation: 'A célula é o encontro de uma coluna com uma linha, como C7.',
              options: [
                { text: 'O encontro de uma coluna com uma linha.', isCorrect: true },
                { text: 'O arquivo inteiro do Excel.', isCorrect: false },
                { text: 'Uma aba dentro do arquivo.', isCorrect: false },
                { text: 'Um grupo de células.', isCorrect: false },
              ],
            },
            {
              statement: 'O que pode acontecer ao salvar uma planilha no formato .csv?',
              type: QuestionType.SINGLE_CHOICE,
              explanation:
                'Um arquivo .csv guarda dados simples, mas pode perder fórmulas, cores e várias planilhas.',
              options: [
                { text: 'Pode perder fórmulas, cores e várias planilhas.', isCorrect: true },
                { text: 'Nada muda em relação ao .xlsx.', isCorrect: false },
                { text: 'As fórmulas passam a recalcular mais rápido.', isCorrect: false },
                { text: 'O arquivo passa a aceitar Tabelas Dinâmicas.', isCorrect: false },
              ],
            },
            {
              statement: 'Quais cuidados o e-book recomenda antes de compartilhar uma planilha?',
              type: QuestionType.MULTIPLE_CHOICE,
              explanation:
                'Antes de compartilhar, confira fórmulas, filtros, totais, permissões e a versão do arquivo.',
              options: [
                { text: 'Conferir fórmulas e totais.', isCorrect: true },
                { text: 'Conferir filtros aplicados.', isCorrect: true },
                { text: 'Conferir permissões e a versão do arquivo.', isCorrect: true },
                { text: 'Apagar a base original para reduzir o tamanho.', isCorrect: false },
              ],
            },
          ],
        },
      ],
    },
  ],
};

const MODULE_04: SeedCourse = {
  slug: 'microsoft-powerpoint-para-administracao',
  title: 'Microsoft PowerPoint para Administração',
  subtitle: 'Do iniciante ao avançado',
  shortDescription: 'Slides claros, histórias visuais e apresentações seguras.',
  fullDescription:
    'E-book didático para administração. O PowerPoint ajuda a combinar fala, texto, imagens e dados em ' +
    'uma sequência visual para reuniões, aulas, treinamentos, propostas e relatórios.\n\n' +
    'Leia o slide em modo de apresentação, não apenas na tela de edição. Use somente dados, nomes e ' +
    'imagens fictícios ou autorizados. Antes de compartilhar, confira conteúdo, acessibilidade, ' +
    'permissões e versão.',
  objectives: [
    'Criar, ordenar e salvar slides com layouts adequados.',
    'Organizar texto com tema, contraste e consistência.',
    'Usar elementos visuais e gerar um PDF conferido.',
    'Planejar uma história orientada ao público e à decisão.',
    'Organizar objetos, dados e multimídia com equilíbrio.',
    'Usar movimento, notas e ensaio a favor da mensagem.',
    'Criar mestres, layouts e modelos reutilizáveis.',
    'Controlar dados vinculados, versões e distribuição segura.',
  ],
  targetAudience: [
    'Pessoas que nunca criaram uma apresentação.',
    'Crianças e jovens acompanhados por um adulto ou professor.',
    'Estudantes de Administração e áreas relacionadas.',
    'Auxiliares, assistentes e analistas administrativos.',
    'Profissionais que precisam apresentar ideias, dados e propostas.',
  ],
  prerequisites: [
    'É recomendável saber abrir programas, localizar arquivos, criar pastas, salvar e renomear documentos.',
  ],
  workloadHours: 14,
  level: CourseLevel.PROGRESSIVE,
  isFree: false,
  order: 4,
  ebookTitle: 'Módulo 4 — Microsoft PowerPoint para Administração (Edição 2026)',
  sections: [
    {
      title: 'Parte 1 — PowerPoint Iniciante',
      summary: 'Da apresentação vazia a uma entrega visual curta e revisada.',
      lessons: [
        {
          title: 'Capítulo 1 — A apresentação como história em cartões',
          type: LessonType.RICH_TEXT,
          estimatedMinutes: 25,
          summary: 'Conheça a tela do PowerPoint e monte uma apresentação curta sem medo de errar.',
          topics: ['Antes de começar: o que o PowerPoint faz', 'As peças da tela'],
        },
        {
          title: 'Capítulo 2 — Texto, temas e uma aparência fácil de ler',
          type: LessonType.RICH_TEXT,
          estimatedMinutes: 25,
          summary: 'Transforme texto em uma mensagem visual simples, legível e consistente.',
          topics: ['A mensagem vem antes da aparência', 'Temas, contraste e consistência'],
        },
        {
          title: 'Capítulo 3 — Imagens, formas, processos, dados e PDF',
          type: LessonType.RICH_TEXT,
          estimatedMinutes: 25,
          summary:
            'Escolha elementos visuais que explicam a mensagem e prepare uma entrega revisada.',
          topics: ['Escolha o elemento pelo problema', 'Exportação em PDF'],
        },
      ],
    },
    {
      title: 'Parte 2 — PowerPoint Intermediário',
      summary:
        'Ao concluir esta parte: planejar uma história orientada ao público e à decisão e organizar ' +
        'objetos, dados e multimídia.',
      lessons: [
        {
          title: 'Capítulo 4 — Público, objetivo, roteiro e narrativa',
          type: LessonType.RICH_TEXT,
          estimatedMinutes: 25,
          summary: 'Organize slides em uma história que ajude o público a compreender e decidir.',
          topics: ['Comece pelo público', 'Objetivo, roteiro e narrativa'],
        },
        {
          title: 'Capítulo 5 — Composição, alinhamento, camadas e multimídia',
          type: LessonType.RICH_TEXT,
          estimatedMinutes: 25,
          summary: 'Organize objetos, processos, dados, áudio e vídeo com equilíbrio e propósito.',
          topics: ['Crie ordem com alinhamento e espaço', 'Camadas e multimídia'],
        },
        {
          title: 'Capítulo 6 — Movimento, notas, ensaio e apresentação',
          type: LessonType.RICH_TEXT,
          estimatedMinutes: 25,
          summary:
            'Use movimento para orientar a atenção e apresente com notas, tempo e acessibilidade.',
          topics: ['Transição e animação são coisas diferentes', 'Notas, ensaio e acessibilidade'],
        },
      ],
    },
    {
      title: 'Parte 3 — PowerPoint Avançado',
      summary:
        'Ao concluir esta parte: criar mestres, layouts e modelos reutilizáveis e controlar dados ' +
        'vinculados, versões e distribuição.',
      lessons: [
        {
          title: 'Capítulo 7 — Slide Mestre, layouts e modelos reutilizáveis',
          type: LessonType.RICH_TEXT,
          estimatedMinutes: 25,
          summary:
            'Crie uma base visual reutilizável para reduzir retrabalho e diferenças entre arquivos.',
          topics: ['Mestre, layout, tema e modelo', 'Padronização visual'],
        },
        {
          title: 'Capítulo 8 — Dados do Excel, reutilização e versões',
          type: LessonType.RICH_TEXT,
          estimatedMinutes: 25,
          summary:
            'Traga dados e slides de outras fontes com escolhas claras de atualização e controle.',
          topics: ['Imagem, incorporação ou vínculo', 'Controle de versões'],
        },
        {
          title: 'Capítulo 9 — Gravação, inspeção, segurança e distribuição',
          type: LessonType.RICH_TEXT,
          estimatedMinutes: 25,
          summary:
            'Grave, teste e prepare os formatos finais sem expor informações ou enviar a versão errada.',
          topics: ['Grave primeiro uma amostra', 'Inspeção e distribuição segura'],
        },
      ],
    },
    {
      title: 'Projeto final e conclusão',
      summary: 'Junte os três níveis em uma única rotina de apresentação.',
      lessons: [
        {
          title: 'Projeto final integrado',
          type: LessonType.PRACTICAL_ACTIVITY,
          estimatedMinutes: 60,
          activityInstructions:
            'Monte uma apresentação administrativa curta com dados fictícios: defina público e objetivo, ' +
            'escreva o roteiro, aplique um Slide Mestre, inclua um gráfico vindo do Excel, escreva as ' +
            'notas do apresentador, faça a inspeção final e exporte em PDF.',
        },
        {
          title: 'Guia de consulta rápida e referências oficiais',
          type: LessonType.RICH_TEXT,
          estimatedMinutes: 10,
          summary: 'Consulte recursos, atalhos e as fontes oficiais citadas no e-book.',
          topics: ['Guia de consulta rápida', 'Referências oficiais'],
        },
        {
          title: 'Questionário de conclusão',
          type: LessonType.QUIZ,
          estimatedMinutes: 10,
          passingScore: 70,
          questions: [
            {
              statement: 'Qual é a diferença entre transição e animação?',
              type: QuestionType.SINGLE_CHOICE,
              explanation:
                'Transição é abrir a porta para outra sala; animação é mover algo dentro da mesma sala.',
              options: [
                {
                  text: 'A transição acontece entre slides; a animação, dentro de um slide.',
                  isCorrect: true,
                },
                { text: 'São dois nomes para o mesmo recurso.', isCorrect: false },
                { text: 'A animação só funciona com vídeos.', isCorrect: false },
                { text: 'A transição só funciona no modo de edição.', isCorrect: false },
              ],
            },
            {
              statement: 'O que fazer quando um slide tem duas ideias grandes?',
              type: QuestionType.SINGLE_CHOICE,
              explanation:
                'Um slide não é uma página de Word: se houver duas ideias grandes, separe-as em dois slides.',
              options: [
                { text: 'Separar em dois slides.', isCorrect: true },
                { text: 'Reduzir a fonte para caber tudo.', isCorrect: false },
                { text: 'Transformar o slide em um documento de texto.', isCorrect: false },
                { text: 'Adicionar uma animação para dividir a atenção.', isCorrect: false },
              ],
            },
            {
              statement:
                'Quando há muitas categorias para comparar, qual tipo de gráfico o e-book recomenda?',
              type: QuestionType.SINGLE_CHOICE,
              explanation:
                'Pizza com muitas categorias fica difícil de ler. Para várias categorias, prefira barras ordenadas.',
              options: [
                { text: 'Barras ordenadas.', isCorrect: true },
                { text: 'Gráfico de pizza.', isCorrect: false },
                { text: 'Gráfico de dispersão.', isCorrect: false },
                { text: 'Nenhum gráfico: só texto.', isCorrect: false },
              ],
            },
          ],
        },
      ],
    },
  ],
};

/**
 * Módulo 5 — ainda sem e-book oficial disponível.
 *
 * Cadastrado como rascunho e sem capítulos: o título e a proposta constam da
 * apresentação da trilha, mas o conteúdo detalhado não pode ser inventado.
 */
const MODULE_05: SeedCourse = {
  slug: 'inteligencia-artificial-para-processos-administrativos',
  title: 'Inteligência Artificial para Processos Administrativos',
  subtitle: 'Módulo em produção',
  shortDescription:
    'Uso responsável de inteligência artificial em rotinas administrativas. Conteúdo em produção.',
  fullDescription:
    'Este é o quinto módulo da trilha. O material didático completo ainda está em produção e será ' +
    'publicado nesta mesma página assim que estiver disponível.\n\n' +
    'Enquanto isso, o Módulo Extra Gratuito já traz um capítulo introdutório sobre inteligência ' +
    'artificial no dia a dia profissional.',
  objectives: [],
  targetAudience: [
    'Estudantes de Administração e áreas relacionadas.',
    'Auxiliares, assistentes e analistas administrativos.',
  ],
  prerequisites: ['Recomenda-se concluir os módulos 1 a 4 da trilha.'],
  workloadHours: 0,
  level: CourseLevel.PROGRESSIVE,
  isFree: false,
  order: 5,
  ebookTitle: '',
  sections: [],
};

export const SEED_COURSES: SeedCourse[] = [
  FREE_MODULE,
  MODULE_01,
  MODULE_02,
  MODULE_03,
  MODULE_04,
  MODULE_05,
];

export const SEED_PROGRAM = {
  slug: 'trilha-completa-competencias-digitais',
  title: 'Trilha Completa — Competências Digitais para o Trabalho',
  shortDescription:
    'Os cinco módulos da trilha, do primeiro contato com o computador ao uso responsável de IA.',
  fullDescription:
    'A trilha reúne os cinco módulos pagos em uma sequência pensada para quem está começando: ' +
    'primeiro os fundamentos do computador e do Windows, depois Word, Excel e PowerPoint aplicados à ' +
    'rotina administrativa e, por fim, o uso de inteligência artificial em processos administrativos.\n\n' +
    'Cada módulo vai do iniciante ao avançado, com atividades práticas e projeto final. O Módulo 5 ' +
    'está em produção e será liberado para quem já tem acesso à trilha assim que for publicado.',
  objectives: [
    'Ganhar autonomia no computador e na organização de arquivos.',
    'Produzir documentos, planilhas e apresentações de nível profissional.',
    'Aplicar boas práticas de revisão, acessibilidade e segurança.',
    'Usar inteligência artificial com responsabilidade nas rotinas de trabalho.',
  ],
  /** Slugs dos cursos, na ordem da trilha. */
  courseSlugs: [MODULE_01.slug, MODULE_02.slug, MODULE_03.slug, MODULE_04.slug, MODULE_05.slug],
};

export const SEED_INSTRUCTOR = {
  name: 'Equipe RomaLearn',
  title: 'Produção didática',
  bio:
    'Equipe responsável pelos e-books didáticos da trilha, com foco em linguagem simples, ' +
    'exemplos do dia a dia administrativo e prática guiada.',
};

export const MATERIAL_KIND_FOR_EBOOK = MaterialKind.PDF;
