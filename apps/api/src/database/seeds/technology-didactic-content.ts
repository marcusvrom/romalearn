interface ReadingInput {
  courseSlug: string;
  courseTitle: string;
  lessonTitle: string;
  summary?: string;
  topics?: string[];
}

interface CourseContext {
  audience: string;
  outcome: string;
  setup: string;
  everydayScenario: string;
}

const COURSE_CONTEXT: Record<string, CourseContext> = {
  'logica-de-programacao-e-algoritmos': {
    audience: 'Você está construindo a base de raciocínio usada em qualquer linguagem de programação.',
    outcome: 'Cada conceito será conectado ao organizador de tarefas do projeto final.',
    setup: 'Use papel, editor de texto ou pseudocódigo. O foco inicial é compreender a regra antes da sintaxe.',
    everydayScenario: 'Imagine uma empresa que precisa transformar uma regra explicada verbalmente em passos que qualquer pessoa consiga repetir e conferir.',
  },
  'git-e-github-na-pratica': {
    audience: 'Você está aprendendo a registrar e comunicar a evolução de projetos como acontece em equipes reais.',
    outcome: 'Cada aula melhora o repositório profissional entregue ao final do curso.',
    setup: 'Tenha Git instalado, uma conta no GitHub e uma pasta exclusiva para os laboratórios.',
    everydayScenario: 'Imagine duas pessoas alterando o mesmo projeto e precisando entender quem mudou cada parte, por qual motivo e como voltar atrás.',
  },
  'html-e-css-do-zero': {
    audience: 'Você construirá interfaces compreensíveis por pessoas, navegadores e tecnologias assistivas.',
    outcome: 'Cada capítulo acrescenta uma parte da landing page responsiva do projeto final.',
    setup: 'Use um navegador com DevTools e um editor de código. Teste sempre em diferentes larguras e com teclado.',
    everydayScenario: 'Imagine uma página de inscrição que precisa funcionar no celular, ser entendida por leitor de tela e continuar clara com zoom aumentado.',
  },
  'javascript-fundamentos': {
    audience: 'Você transformará páginas estáticas em aplicações com dados, estado e interação.',
    outcome: 'Os exemplos evoluem para um painel que consulta API e trata carregamento, sucesso, vazio e erro.',
    setup: 'Use o console do navegador e execute exemplos pequenos antes de conectá-los à interface.',
    everydayScenario: 'Imagine uma tela de cursos que precisa filtrar resultados, validar formulários e informar ao usuário quando uma consulta falha.',
  },
  'python-para-iniciantes': {
    audience: 'Você aplicará programação a automações, arquivos e relatórios do dia a dia.',
    outcome: 'Cada conceito será reutilizado no organizador de relatórios do projeto final.',
    setup: 'Use ambiente virtual e dados fictícios. Preserve sempre os arquivos originais durante os testes.',
    everydayScenario: 'Imagine receber dezenas de planilhas ou arquivos CSV e precisar validar, organizar e resumir os dados sem realizar o trabalho manualmente.',
  },
  'java-fundamentos-e-orientacao-a-objetos': {
    audience: 'Você aprenderá a modelar regras de negócio com tipos, objetos e responsabilidades claras.',
    outcome: 'As classes e regras serão reunidas no sistema de gestão de biblioteca.',
    setup: 'Use uma versão LTS do JDK, IDE ou editor configurado e um projeto separado para experimentos.',
    everydayScenario: 'Imagine um sistema que não pode permitir empréstimo de livro indisponível, usuário inválido ou devolução duplicada.',
  },
};

const TOPIC_QUESTIONS: Record<string, string> = {
  Variáveis: 'Qual informação muda durante a execução e por que ela precisa ser armazenada?',
  Funções: 'Qual responsabilidade pode ser isolada para facilitar teste e reutilização?',
  Branch: 'Como isolar uma mudança sem afetar a versão principal?',
  Acessibilidade: 'Uma pessoa usando somente teclado ou leitor de tela consegue concluir a tarefa?',
  Validação: 'Quais entradas inválidas precisam ser rejeitadas com uma mensagem útil?',
  Erros: 'Como o sistema deve se comportar quando algo esperado não acontece?',
  Testes: 'Qual cenário comprova a regra e qual cenário revela seus limites?',
};

function codeFence(language: string, lines: string[]): string {
  return ['```' + language, ...lines, '```'].join('\n');
}

function buildExample(input: ReadingInput): string {
  const title = input.lessonTitle.toLowerCase();

  if (title.includes('repositório remoto') || title.includes('push')) {
    return [
      'Considere um projeto que já possui commits locais e precisa ser publicado no GitHub.',
      codeFence('bash', [
        'git remote add origin URL_DO_REPOSITORIO',
        'git branch -M main',
        'git push -u origin main',
      ]),
      'O primeiro comando registra o endereço remoto. O segundo padroniza o nome da branch principal. O terceiro envia os commits e associa a branch local à remota por meio do parâmetro -u.',
      'Depois dessa associação, os próximos envios normalmente podem usar apenas `git push`.',
    ].join('\n\n');
  }

  if (title.includes('algoritmo')) {
    return [
      'Uma loja precisa liberar somente pedidos aprovados e com endereço completo.',
      codeFence('text', [
        'receber statusPagamento',
        'receber enderecoCompleto',
        '',
        'se statusPagamento = "aprovado" e enderecoCompleto = verdadeiro então',
        '  exibir "liberar para separação"',
        'senão',
        '  exibir "encaminhar para revisão"',
        'fim-se',
      ]),
      'Observe a separação entre entrada, processamento e saída. Teste também pagamento pendente, endereço incompleto e status desconhecido.',
    ].join('\n\n');
  }

  if (title.includes('variáveis') || title.includes('tipos')) {
    return [
      'Uma plataforma precisa guardar nome do aluno, preço, quantidade de parcelas e situação do pagamento.',
      codeFence('text', [
        'nomeAluno = "Fernando"',
        'precoEmCentavos = 5900',
        'parcelas = 2',
        'pagamentoAprovado = falso',
      ]),
      'Cada valor possui uma natureza diferente. Guardar preço em centavos evita parte dos problemas de arredondamento de números decimais.',
    ].join('\n\n');
  }

  return [
    `Considere uma funcionalidade real relacionada a **${input.lessonTitle}**.`,
    'Defina primeiro quais dados entram, qual regra será aplicada e qual resultado deve ser observado.',
    'Comece pelo menor exemplo possível. Depois altere uma entrada, teste um limite e provoque uma falha controlada.',
    'Registre o resultado esperado antes de executar. Isso transforma tentativa e erro em investigação orientada por hipótese.',
  ].join('\n\n');
}

function buildConcepts(topics: string[]): string {
  if (!topics.length) {
    return 'Identifique o conceito principal, sua responsabilidade, quando utilizá-lo e quais problemas ele não resolve.';
  }

  return topics
    .map((topic, index) => {
      const question = TOPIC_QUESTIONS[topic] ?? 'Que problema este conceito resolve e como podemos verificar seu funcionamento?';
      return `${index + 1}. **${topic}** — ${question}`;
    })
    .join('\n');
}

export function buildTechnologyReadingContent(input: ReadingInput): string {
  const context = COURSE_CONTEXT[input.courseSlug] ?? {
    audience: 'Você aprenderá um conceito aplicável a problemas reais.',
    outcome: 'O conhecimento será reutilizado no projeto final.',
    setup: 'Prepare um ambiente de testes separado e use dados fictícios.',
    everydayScenario: 'Uma equipe precisa transformar uma necessidade em uma solução clara, verificável e segura.',
  };
  const topics = input.topics ?? [];

  const guidedSteps = [
    'Leia o problema e descreva com suas palavras qual resultado é esperado.',
    'Reproduza o exemplo sem copiar automaticamente: explique cada passo antes de executá-lo.',
    'Altere uma entrada e preveja o novo resultado.',
    'Teste um cenário comum, um cenário limite e uma entrada inválida.',
    'Registre o que aprendeu e a dúvida que ainda permaneceu.',
  ];

  const mistakes = [
    'Copiar comandos ou código sem compreender a responsabilidade de cada parte.',
    'Testar apenas o caminho em que tudo funciona.',
    'Adicionar complexidade antes de validar o caso básico.',
    'Ignorar mensagens de erro, segurança, acessibilidade ou dados sensíveis.',
  ];

  return [
    `# ${input.lessonTitle}`,
    `## Por que esta aula importa\n\n${context.audience}\n\n${context.everydayScenario}`,
    `## O que você vai aprender\n\n${input.summary ?? input.lessonTitle}\n\nAo final, você deverá conseguir explicar **o que é**, **como funciona**, **por que existe**, **quando utilizar** e **quais cuidados tomar**.`,
    `## Prepare seu ambiente\n\n${context.setup}`,
    `## Conceitos essenciais\n\n${buildConcepts(topics)}`,
    [
      '## Entendendo o conceito',
      '',
      `O tema **${input.lessonTitle}** deve ser entendido como uma ferramenta para resolver um problema, e não como uma sequência de palavras ou comandos para memorizar.`,
      '',
      'Pergunte sempre:',
      '',
      '- Qual dado entra?',
      '- Qual regra transforma esse dado?',
      '- Qual resultado deve sair?',
      '- Como reconhecemos uma entrada inválida?',
      '- Como comprovamos que o comportamento está correto?',
    ].join('\n'),
    `## Exemplo trabalhado\n\n${buildExample(input)}`,
    `## Construção guiada\n\n${guidedSteps.map((step, index) => `${index + 1}. ${step}`).join('\n')}`,
    [
      '## Pare e pense',
      '',
      '- Como você explicaria este conceito para alguém que nunca programou?',
      '- Em qual problema do cotidiano ou do trabalho ele seria útil?',
      '- Quando uma solução mais simples seria suficiente?',
      '- Que teste revelaria um erro escondido?',
    ].join('\n'),
    `## Erros comuns e como evitá-los\n\n${mistakes.map((mistake) => `- ${mistake}`).join('\n')}`,
    [
      '## Verificação rápida',
      '',
      '- [ ] Consigo explicar o conceito sem consultar o texto.',
      '- [ ] Reproduzi o exemplo e entendi cada etapa.',
      '- [ ] Modifiquei o exemplo e previ o resultado.',
      '- [ ] Testei uma situação inválida ou de limite.',
      '- [ ] Registrei uma dúvida ou descoberta.',
    ].join('\n'),
    `## Conexão com a atividade prática\n\n${context.outcome}\n\nA atividade seguinte não apresentará um novo conceito essencial: ela pedirá que você aplique, combine e demonstre o conhecimento desenvolvido nesta leitura.`,
  ].join('\n\n');
}
