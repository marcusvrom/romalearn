import { QuestionType } from '@romalearn/contracts';

export interface TechnologyQuizQuestion {
  statement: string;
  type: QuestionType;
  explanation: string;
  options: { text: string; isCorrect: boolean }[];
}

export interface TechnologyCourseRefinement {
  courseSlug: string;
  projectCriteria: string[];
  quiz: TechnologyQuizQuestion[];
}

const singleChoice = (
  statement: string,
  correct: string,
  distractors: string[],
  explanation: string,
): TechnologyQuizQuestion => ({
  statement,
  type: QuestionType.SINGLE_CHOICE,
  explanation,
  options: [
    { text: correct, isCorrect: true },
    ...distractors.map((text) => ({ text, isCorrect: false })),
  ],
});

export const TECHNOLOGY_REFINEMENTS: TechnologyCourseRefinement[] = [
  {
    courseSlug: 'logica-de-programacao-e-algoritmos',
    projectCriteria: [
      'O algoritmo possui entrada, processamento e saída claramente identificados.',
      'As regras de prioridade e conclusão são representadas por condições verificáveis.',
      'Há pelo menos uma repetição com critério de parada explícito.',
      'A solução foi testada com cenário comum, limite e entrada inválida.',
      'O aluno explica as decisões sem depender apenas do código ou pseudocódigo.',
    ],
    quiz: [
      singleChoice(
        'Qual é a principal função de um algoritmo?',
        'Descrever uma sequência verificável de passos para resolver um problema.',
        ['Escolher automaticamente a melhor linguagem.', 'Eliminar todos os erros possíveis.', 'Substituir a necessidade de testes.'],
        'Um algoritmo organiza entradas, processamento e saídas em passos que podem ser executados e testados.',
      ),
      singleChoice(
        'Quando uma estrutura de repetição deve terminar?',
        'Quando seu critério de parada se torna verdadeiro.',
        ['Quando o computador fica lento.', 'Depois de uma quantidade indefinida de passos.', 'Somente quando o usuário fecha o programa.'],
        'Toda repetição precisa de uma condição de continuidade ou parada para evitar loops infinitos.',
      ),
      singleChoice(
        'Qual teste tende a revelar erros que o cenário comum não mostra?',
        'Testar valores limites e entradas inválidas.',
        ['Executar sempre os mesmos dados.', 'Remover as validações.', 'Testar somente quando o projeto estiver pronto.'],
        'Casos limites e inválidos expõem suposições escondidas na solução.',
      ),
    ],
  },
  {
    courseSlug: 'git-e-github-na-pratica',
    projectCriteria: [
      'O repositório possui histórico com commits pequenos e mensagens descritivas.',
      'A mudança principal foi desenvolvida em uma branch separada.',
      'Existe pull request com contexto, evidências e instruções de validação.',
      'O README explica problema, solução, execução e tecnologias.',
      'O projeto possui uma release ou versão identificável.',
    ],
    quiz: [
      singleChoice('O que deve representar um bom commit?', 'Uma mudança pequena, coerente e explicada por uma mensagem clara.', ['Um backup completo do computador.', 'Todas as mudanças do mês juntas.', 'Somente arquivos novos.'], 'Commits pequenos facilitam revisão, investigação e reversão.'),
      singleChoice('Por que usar uma branch de feature?', 'Para isolar uma mudança antes de integrá-la à linha principal.', ['Para duplicar definitivamente o projeto.', 'Para impedir qualquer colaboração.', 'Para substituir o repositório remoto.'], 'Branches permitem trabalhar com segurança e revisar antes do merge.'),
      singleChoice('O que um pull request deve explicar?', 'O problema, a solução, os riscos e como validar.', ['Somente o nome do autor.', 'A senha do ambiente.', 'Apenas a quantidade de arquivos alterados.'], 'Um PR é uma unidade de comunicação e revisão, não apenas um botão de merge.'),
    ],
  },
  {
    courseSlug: 'html-e-css-do-zero',
    projectCriteria: [
      'A página utiliza HTML semântico e hierarquia correta de títulos.',
      'Imagens relevantes possuem texto alternativo e campos possuem labels.',
      'O layout funciona em celular, tablet e desktop sem rolagem horizontal indevida.',
      'Contraste, foco visível e navegação por teclado foram verificados.',
      'O projeto está publicado e possui README com evidências visuais.',
    ],
    quiz: [
      singleChoice('Por que usar elementos HTML semânticos?', 'Para comunicar a função do conteúdo a pessoas, navegadores e tecnologias assistivas.', ['Para deixar o CSS desnecessário.', 'Para reduzir todo arquivo a uma única tag.', 'Para impedir indexação.'], 'Semântica melhora estrutura, acessibilidade e manutenção.'),
      singleChoice('O que significa desenvolver mobile first?', 'Começar pela experiência em telas pequenas e ampliar progressivamente.', ['Criar apenas aplicativo móvel.', 'Usar tamanhos fixos em pixels.', 'Esconder todo conteúdo no celular.'], 'Mobile first força priorização e ajuda a construir layouts fluidos.'),
      singleChoice('Qual prática melhora a acessibilidade de formulários?', 'Associar cada campo a um label claro.', ['Usar apenas placeholder.', 'Remover o foco visível.', 'Comunicar erros apenas por cor.'], 'Labels persistentes ajudam todos os usuários e leitores de tela.'),
    ],
  },
  {
    courseSlug: 'javascript-fundamentos',
    projectCriteria: [
      'O código separa obtenção de dados, estado e atualização da interface.',
      'Eventos não são registrados repetidamente de forma acidental.',
      'Carregamento, sucesso, lista vazia e erro possuem estados visíveis.',
      'Entradas do usuário são validadas antes do processamento.',
      'O projeto possui funções pequenas, nomes claros e instruções de execução.',
    ],
    quiz: [
      singleChoice('Qual é a vantagem de usar map em um array?', 'Criar um novo array transformando cada item sem alterar o original.', ['Encerrar o navegador.', 'Modificar automaticamente o HTML.', 'Eliminar a necessidade de funções.'], 'map expressa transformação e retorna uma nova coleção.'),
      singleChoice('O que é o DOM?', 'Uma representação estruturada do documento que o JavaScript pode consultar e alterar.', ['Um banco de dados remoto.', 'Um gerenciador de pacotes.', 'Uma linguagem substituta do HTML.'], 'O DOM conecta a estrutura da página ao código JavaScript.'),
      singleChoice('Por que tratar erros em requisições?', 'Porque rede, servidor e dados podem falhar e o usuário precisa receber retorno claro.', ['Para esconder todos os problemas.', 'Para tornar a API sempre síncrona.', 'Para evitar qualquer validação.'], 'Experiências robustas tratam carregamento, sucesso e falha explicitamente.'),
    ],
  },
  {
    courseSlug: 'python-para-iniciantes',
    projectCriteria: [
      'A aplicação lê dados sem sobrescrever o arquivo original.',
      'A transformação está separada da entrada e da geração do relatório.',
      'Entradas inválidas e arquivos ausentes possuem tratamento.',
      'O relatório apresenta totais e agrupamentos verificáveis.',
      'O projeto inclui dependências, instruções e exemplos de execução.',
    ],
    quiz: [
      singleChoice('Qual estrutura associa chaves a valores em Python?', 'Dicionário.', ['Tupla sem elementos.', 'Comentário.', 'Importação.'], 'Dicionários representam pares chave-valor e são úteis para registros e agrupamentos.'),
      singleChoice('Por que usar funções?', 'Para separar responsabilidades e reutilizar comportamento.', ['Para aumentar duplicação.', 'Para evitar nomes claros.', 'Para impedir testes.'], 'Funções pequenas tornam o código mais compreensível e testável.'),
      singleChoice('Quando usar try e except?', 'Quando uma operação esperada pode falhar e existe uma resposta apropriada.', ['Em toda linha do programa.', 'Para ignorar qualquer erro silenciosamente.', 'Somente em comentários.'], 'Exceções devem ser tratadas de forma específica e informativa.'),
    ],
  },
  {
    courseSlug: 'java-fundamentos-e-orientacao-a-objetos',
    projectCriteria: [
      'As classes representam responsabilidades do domínio, não apenas agrupamentos arbitrários.',
      'Os atributos são protegidos e alterados por operações válidas.',
      'Coleções são utilizadas com tipos genéricos adequados.',
      'Regras inválidas produzem mensagens ou exceções compreensíveis.',
      'O projeto possui testes essenciais e instruções para compilar e executar.',
    ],
    quiz: [
      singleChoice('O que encapsulamento busca proteger?', 'O estado interno e as regras de alteração de um objeto.', ['O nome do projeto no GitHub.', 'Somente arquivos de imagem.', 'A instalação da JVM.'], 'Encapsulamento reduz estados inválidos e concentra regras no objeto responsável.'),
      singleChoice('Para que serve uma interface em Java?', 'Definir um contrato que diferentes implementações podem cumprir.', ['Armazenar senhas.', 'Substituir qualquer classe automaticamente.', 'Criar somente variáveis globais.'], 'Interfaces favorecem abstração, substituição e testes.'),
      singleChoice('Qual benefício dos tipos genéricos em coleções?', 'Aumentar segurança de tipos e reduzir conversões manuais.', ['Executar sem JVM.', 'Eliminar todos os objetos.', 'Transformar Java em linguagem dinâmica.'], 'Generics ajudam o compilador a detectar incompatibilidades antes da execução.'),
    ],
  },
];

export function refinementFor(courseSlug: string): TechnologyCourseRefinement | undefined {
  return TECHNOLOGY_REFINEMENTS.find((item) => item.courseSlug === courseSlug);
}

export function buildDidacticContent(input: {
  courseTitle: string;
  lessonTitle: string;
  summary?: string;
  topics?: string[];
}): string {
  const topics = input.topics ?? [];
  const conceptualSteps = topics.length
    ? topics.map((topic, index) => `${index + 1}. **${topic}** — identifique o conceito, reproduza um exemplo e altere uma condição para observar o efeito.`).join('\n')
    : '1. Identifique o objetivo.\n2. Reproduza um exemplo pequeno.\n3. Modifique uma entrada.\n4. Compare o resultado.';

  return [
    `## Objetivo da aula\n\n${input.summary ?? `Compreender e praticar ${input.lessonTitle.toLowerCase()}.`}`,
    `## Antes de começar\n\nExplique com suas próprias palavras o que você espera que aconteça. Essa previsão transforma a execução em aprendizagem ativa.`,
    `## Passo a passo\n\n${conceptualSteps}`,
    `## Exemplo guiado\n\nPense em um problema pequeno relacionado a **${input.lessonTitle}**. Escreva a entrada, o resultado esperado e os passos intermediários. Depois implemente a menor versão possível e execute-a antes de adicionar novas regras.`,
    `## Experimente\n\n- Altere uma entrada comum.\n- Teste um valor limite.\n- Provoque um erro controlado.\n- Registre o que mudou e por quê.`,
    `## Erros comuns\n\n- Copiar uma solução sem conseguir explicá-la.\n- Fazer muitas mudanças antes de testar.\n- Ignorar mensagens de erro.\n- Usar dados sensíveis em exemplos ou commits.`,
    `## Checklist de conclusão\n\n- [ ] Consigo explicar o conceito sem consultar o texto.\n- [ ] Reproduzi um exemplo.\n- [ ] Modifiquei o exemplo e previ o resultado.\n- [ ] Registrei uma dúvida ou descoberta.`,
    `## Conexão com o projeto\n\nEste conceito será utilizado no projeto do curso **${input.courseTitle}**. Salve seu exemplo no repositório de estudos para reutilizá-lo mais tarde.`,
  ].join('\n\n');
}

export function buildProjectRubric(criteria: string[]): Record<string, unknown> {
  return {
    version: 1,
    passingScore: 70,
    criteria: criteria.map((description, index) => ({
      id: `criterion-${index + 1}`,
      title: `Critério ${index + 1}`,
      description,
      weight: 20,
      levels: [
        { score: 0, label: 'Não demonstrado' },
        { score: 50, label: 'Parcial' },
        { score: 100, label: 'Atendido' },
      ],
    })),
  };
}
