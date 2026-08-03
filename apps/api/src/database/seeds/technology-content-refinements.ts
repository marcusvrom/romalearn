import { ActivityRubricDto, QuestionType } from '@romalearn/contracts';

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
        [
          'Escolher automaticamente a melhor linguagem.',
          'Eliminar todos os erros possíveis.',
          'Substituir a necessidade de testes.',
        ],
        'Um algoritmo organiza entradas, processamento e saídas em passos que podem ser executados e testados.',
      ),
      singleChoice(
        'Quando uma estrutura de repetição deve terminar?',
        'Quando seu critério de parada se torna verdadeiro.',
        [
          'Quando o computador fica lento.',
          'Depois de uma quantidade indefinida de passos.',
          'Somente quando o usuário fecha o programa.',
        ],
        'Toda repetição precisa de uma condição de continuidade ou parada para evitar loops infinitos.',
      ),
      singleChoice(
        'Qual teste tende a revelar erros que o cenário comum não mostra?',
        'Testar valores limites e entradas inválidas.',
        [
          'Executar sempre os mesmos dados.',
          'Remover as validações.',
          'Testar somente quando o projeto estiver pronto.',
        ],
        'Casos limites e inválidos expõem suposições escondidas na solução.',
      ),
      singleChoice(
        'Ao decompor um problema, qual é o primeiro resultado esperado?',
        'Partes menores com entradas, regras e saídas que possam ser analisadas separadamente.',
        [
          'Uma linguagem escolhida antes de entender o problema.',
          'Um único passo que esconda todas as regras.',
          'Uma tela pronta sem critérios de funcionamento.',
        ],
        'Decomposição reduz a complexidade e torna cada regra observável e testável.',
      ),
      singleChoice(
        'Quando uma condição possui mais de um critério, o que precisa ficar explícito?',
        'Como os operadores lógicos combinam os critérios e quais limites pertencem a cada caminho.',
        [
          'Somente o nome da variável principal.',
          'A velocidade do computador.',
          'Que toda condição deve produzir o mesmo resultado.',
        ],
        'Operadores e limites mal definidos são fontes comuns de caminhos incorretos.',
      ),
      singleChoice(
        'Qual sinal indica que uma função possui responsabilidade clara?',
        'Seu nome descreve uma ação e suas entradas e saída têm um contrato compreensível.',
        [
          'Ela mistura leitura, cálculo, gravação e exibição sem separação.',
          'Ela depende de variáveis escondidas em todo o programa.',
          'Ela só funciona quando nenhum teste é executado.',
        ],
        'Uma função coesa é mais simples de compreender, reutilizar e testar.',
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
      singleChoice(
        'O que deve representar um bom commit?',
        'Uma mudança pequena, coerente e explicada por uma mensagem clara.',
        [
          'Um backup completo do computador.',
          'Todas as mudanças do mês juntas.',
          'Somente arquivos novos.',
        ],
        'Commits pequenos facilitam revisão, investigação e reversão.',
      ),
      singleChoice(
        'Por que usar uma branch de feature?',
        'Para isolar uma mudança antes de integrá-la à linha principal.',
        [
          'Para duplicar definitivamente o projeto.',
          'Para impedir qualquer colaboração.',
          'Para substituir o repositório remoto.',
        ],
        'Branches permitem trabalhar com segurança e revisar antes do merge.',
      ),
      singleChoice(
        'O que um pull request deve explicar?',
        'O problema, a solução, os riscos e como validar.',
        [
          'Somente o nome do autor.',
          'A senha do ambiente.',
          'Apenas a quantidade de arquivos alterados.',
        ],
        'Um PR é uma unidade de comunicação e revisão, não apenas um botão de merge.',
      ),
      singleChoice(
        'Antes do primeiro commit, por que configurar nome e e-mail no Git?',
        'Para atribuir corretamente a autoria registrada no histórico.',
        [
          'Para publicar automaticamente todas as pastas do computador.',
          'Para substituir a autenticação do GitHub.',
          'Para impedir o uso de branches.',
        ],
        'A identidade do commit e a autenticação do serviço remoto são responsabilidades diferentes.',
      ),
      singleChoice(
        'O que a área de staging permite fazer?',
        'Escolher exatamente quais mudanças farão parte do próximo commit.',
        [
          'Excluir permanentemente o histórico remoto.',
          'Executar o projeto sem dependências.',
          'Mesclar qualquer branch sem revisão.',
        ],
        'A staging area ajuda a construir commits pequenos, intencionais e coerentes.',
      ),
      singleChoice(
        'Qual conjunto torna um repositório mais verificável por outra pessoa?',
        'README com contexto e execução, histórico claro e uma versão identificável.',
        [
          'Somente uma imagem sem instruções.',
          'Arquivos gerados e credenciais reais.',
          'Um único commit chamado alterações.',
        ],
        'Portfólio profissional precisa permitir que outra pessoa entenda, execute e acompanhe a evolução.',
      ),
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
      singleChoice(
        'Por que usar elementos HTML semânticos?',
        'Para comunicar a função do conteúdo a pessoas, navegadores e tecnologias assistivas.',
        [
          'Para deixar o CSS desnecessário.',
          'Para reduzir todo arquivo a uma única tag.',
          'Para impedir indexação.',
        ],
        'Semântica melhora estrutura, acessibilidade e manutenção.',
      ),
      singleChoice(
        'O que significa desenvolver mobile first?',
        'Começar pela experiência em telas pequenas e ampliar progressivamente.',
        [
          'Criar apenas aplicativo móvel.',
          'Usar tamanhos fixos em pixels.',
          'Esconder todo conteúdo no celular.',
        ],
        'Mobile first força priorização e ajuda a construir layouts fluidos.',
      ),
      singleChoice(
        'Qual prática melhora a acessibilidade de formulários?',
        'Associar cada campo a um label claro.',
        ['Usar apenas placeholder.', 'Remover o foco visível.', 'Comunicar erros apenas por cor.'],
        'Labels persistentes ajudam todos os usuários e leitores de tela.',
      ),
      singleChoice(
        'Quando duas regras CSS disputam a mesma propriedade, o que deve ser analisado?',
        'Origem, importância, especificidade e ordem das regras na cascata.',
        [
          'Somente o tamanho do arquivo HTML.',
          'A velocidade da conexão do usuário.',
          'A quantidade de imagens da página.',
        ],
        'A cascata resolve conflitos de forma previsível; aumentar especificidade sem entender a causa cria dívida.',
      ),
      singleChoice(
        'No box model padrão, o que compõe o espaço ocupado por um elemento?',
        'Conteúdo, padding, borda e margem.',
        ['Apenas a cor de fundo.', 'Somente largura e fonte.', 'HTML, JavaScript e servidor.'],
        'Compreender o box model evita medidas inesperadas e sobreposição no layout.',
      ),
      singleChoice(
        'Qual verificação deve acontecer antes de publicar uma página?',
        'Testar tamanhos de tela, teclado, contraste, links e carregamento dos recursos.',
        [
          'Remover os textos alternativos.',
          'Converter toda a página em imagem.',
          'Usar apenas o navegador de quem desenvolveu.',
        ],
        'Publicação responsável inclui funcionamento, acessibilidade e desempenho em condições variadas.',
      ),
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
      singleChoice(
        'Qual é a vantagem de usar map em um array?',
        'Criar um novo array transformando cada item sem alterar o original.',
        [
          'Encerrar o navegador.',
          'Modificar automaticamente o HTML.',
          'Eliminar a necessidade de funções.',
        ],
        'map expressa transformação e retorna uma nova coleção.',
      ),
      singleChoice(
        'O que é o DOM?',
        'Uma representação estruturada do documento que o JavaScript pode consultar e alterar.',
        [
          'Um banco de dados remoto.',
          'Um gerenciador de pacotes.',
          'Uma linguagem substituta do HTML.',
        ],
        'O DOM conecta a estrutura da página ao código JavaScript.',
      ),
      singleChoice(
        'Por que tratar erros em requisições?',
        'Porque rede, servidor e dados podem falhar e o usuário precisa receber retorno claro.',
        [
          'Para esconder todos os problemas.',
          'Para tornar a API sempre síncrona.',
          'Para evitar qualquer validação.',
        ],
        'Experiências robustas tratam carregamento, sucesso e falha explicitamente.',
      ),
      singleChoice(
        'Quando usar const em vez de let?',
        'Quando a variável não será reatribuída depois da declaração.',
        [
          'Quando o valor nunca puder conter um objeto.',
          'Somente dentro de arquivos HTML.',
          'Para impedir qualquer alteração interna de arrays e objetos.',
        ],
        'const impede reatribuição da variável, mas não congela automaticamente o conteúdo de objetos.',
      ),
      singleChoice(
        'Qual é uma forma segura de tratar o envio de um formulário no navegador?',
        'Interceptar o evento, validar os dados e comunicar sucesso ou erro na interface.',
        [
          'Ignorar o evento e confiar apenas no placeholder.',
          'Registrar o mesmo listener a cada clique.',
          'Inserir toda entrada diretamente como HTML.',
        ],
        'Eventos, validação e feedback precisam trabalhar juntos para criar uma interação previsível.',
      ),
      singleChoice(
        'O que acontece quando uma função async usa await em uma Promise?',
        'Aquela função aguarda o resultado sem bloquear toda a interface do navegador.',
        [
          'Todo o navegador fica permanentemente bloqueado.',
          'A Promise deixa de poder falhar.',
          'A resposta da rede se torna instantânea.',
        ],
        'await organiza o fluxo assíncrono, mas erros e estados da interface continuam precisando de tratamento.',
      ),
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
      singleChoice(
        'Qual estrutura associa chaves a valores em Python?',
        'Dicionário.',
        ['Tupla sem elementos.', 'Comentário.', 'Importação.'],
        'Dicionários representam pares chave-valor e são úteis para registros e agrupamentos.',
      ),
      singleChoice(
        'Por que usar funções?',
        'Para separar responsabilidades e reutilizar comportamento.',
        ['Para aumentar duplicação.', 'Para evitar nomes claros.', 'Para impedir testes.'],
        'Funções pequenas tornam o código mais compreensível e testável.',
      ),
      singleChoice(
        'Quando usar try e except?',
        'Quando uma operação esperada pode falhar e existe uma resposta apropriada.',
        [
          'Em toda linha do programa.',
          'Para ignorar qualquer erro silenciosamente.',
          'Somente em comentários.',
        ],
        'Exceções devem ser tratadas de forma específica e informativa.',
      ),
      singleChoice(
        'Por que criar um ambiente virtual para um projeto Python?',
        'Para isolar dependências e tornar o ambiente do projeto reproduzível.',
        [
          'Para transformar qualquer arquivo em executável.',
          'Para dispensar a documentação de versões.',
          'Para armazenar senhas junto do código.',
        ],
        'O ambiente virtual reduz conflitos entre projetos e facilita repetir a instalação.',
      ),
      singleChoice(
        'Qual estrutura é adequada quando a ordem importa e valores podem se repetir?',
        'Lista.',
        ['Conjunto usado como arquivo.', 'Comentário de módulo.', 'Exceção.'],
        'Listas preservam ordem e aceitam repetição; a escolha da estrutura deve refletir o problema.',
      ),
      singleChoice(
        'Ao processar um CSV, qual cuidado evita perder o arquivo original?',
        'Ler a origem e gravar o resultado em outro arquivo antes de substituir qualquer dado.',
        [
          'Abrir sempre no modo de sobrescrita.',
          'Ignorar cabeçalhos e codificação.',
          'Misturar leitura, transformação e gravação em cada linha.',
        ],
        'Separar origem e saída permite conferir o resultado e recuperar-se de uma falha.',
      ),
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
      singleChoice(
        'O que encapsulamento busca proteger?',
        'O estado interno e as regras de alteração de um objeto.',
        ['O nome do projeto no GitHub.', 'Somente arquivos de imagem.', 'A instalação da JVM.'],
        'Encapsulamento reduz estados inválidos e concentra regras no objeto responsável.',
      ),
      singleChoice(
        'Para que serve uma interface em Java?',
        'Definir um contrato que diferentes implementações podem cumprir.',
        [
          'Armazenar senhas.',
          'Substituir qualquer classe automaticamente.',
          'Criar somente variáveis globais.',
        ],
        'Interfaces favorecem abstração, substituição e testes.',
      ),
      singleChoice(
        'Qual benefício dos tipos genéricos em coleções?',
        'Aumentar segurança de tipos e reduzir conversões manuais.',
        [
          'Executar sem JVM.',
          'Eliminar todos os objetos.',
          'Transformar Java em linguagem dinâmica.',
        ],
        'Generics ajudam o compilador a detectar incompatibilidades antes da execução.',
      ),
      singleChoice(
        'Qual é a relação correta entre JDK, compilador e JVM?',
        'O JDK fornece ferramentas; javac gera bytecode; a JVM executa esse bytecode.',
        [
          'A JVM escreve automaticamente todo o código-fonte.',
          'O JDK é apenas um editor de texto.',
          'javac executa HTML no navegador.',
        ],
        'Separar compilação de execução ajuda a diagnosticar erros de cada etapa.',
      ),
      singleChoice(
        'Qual responsabilidade importante pode ficar em um construtor?',
        'Garantir que o objeto seja criado com os dados obrigatórios em estado válido.',
        [
          'Expor todos os atributos para alteração irrestrita.',
          'Executar toda regra do sistema em uma única classe.',
          'Ignorar valores nulos para evitar mensagens de erro.',
        ],
        'Construtores podem proteger invariantes que precisam ser verdadeiras desde a criação.',
      ),
      singleChoice(
        'Quando a composição tende a ser melhor que herança?',
        'Quando um objeto precisa colaborar com um comportamento substituível sem afirmar uma relação de tipo.',
        [
          'Quando todas as classes precisam compartilhar o mesmo estado global.',
          'Quando se deseja impedir testes com implementações falsas.',
          'Quando não existe nenhuma responsabilidade separável.',
        ],
        'Composição favorece responsabilidades menores e permite trocar colaboradores por contrato.',
      ),
    ],
  },
];

export function refinementFor(courseSlug: string): TechnologyCourseRefinement | undefined {
  return TECHNOLOGY_REFINEMENTS.find((item) => item.courseSlug === courseSlug);
}

export function buildProjectRubric(criteria: string[]): ActivityRubricDto {
  return {
    passingScore: 70,
    minWords: 120,
    criticalFailures: [
      'O projeto não pode ser executado ou verificado.',
      'A entrega contém credenciais, tokens ou dados pessoais sensíveis.',
      'A entrega é apenas uma cópia sem explicação das decisões tomadas.',
    ],
    criteria: criteria.map((whatToObserve, index) => ({
      id: `criterio-${index + 1}`,
      title: `Critério ${index + 1}`,
      weight: 20,
      whatToObserve,
    })),
  };
}
