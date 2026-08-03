import type { ContentBlock, LessonContent } from './content-types';
import type { TechLessonContent } from './tecnologia/tech-types';

/**
 * A chegada comum aos cursos publicados.
 *
 * Estas aulas são autorais e complementares aos e-books. Elas não antecipam a
 * primeira prática: dão contexto, criam um modelo mental e convidam o aluno a
 * observar a ferramenta sem a pressão de produzir uma entrega.
 */
export interface CourseIntroduction {
  lessonTitle: string;
  summary: string;
  topics: string[];
  estimatedMinutes: number;
  problem: string;
  outcome: string;
  blocks: ContentBlock[];
  reflection: string[];
  checklist: string[];
  recap: string[];
}

export const COURSE_INTRODUCTIONS: Record<string, CourseIntroduction> = {
  'carreira-digital-e-destaque-profissional': {
    lessonTitle: 'Antes do currículo: como o trabalho ficou digital',
    summary:
      'Uma conversa tranquila sobre a origem do trabalho digital, os problemas que ele resolve e como começar a reconhecer suas próprias evidências.',
    topics: [
      'De onde veio o trabalho digital',
      'Competência e evidência',
      'Primeiro mapa sem pressa',
    ],
    estimatedMinutes: 18,
    problem:
      'Talvez você tenha chegado querendo melhorar o currículo e encontrado uma fila de ferramentas, perfis e palavras novas. Antes de preencher qualquer campo, vale entender por que o trabalho se tornou digital e onde você já participa dessa história.',
    outcome:
      'Ao terminar, você conseguirá explicar o que é uma competência digital, reconhecer aplicações próximas e escolher um primeiro passo pequeno e honesto.',
    blocks: [
      { kind: 'heading', text: 'Essa história não começou com uma vaga de tecnologia' },
      {
        kind: 'paragraph',
        text: 'O trabalho digital não tem um único criador. Ele cresceu à medida que computadores, redes e ferramentas passaram a organizar tarefas que antes dependiam de papel, telefone e presença física. Um marco importante aconteceu em 1989: no CERN, Tim Berners-Lee propôs a Web para facilitar a troca de informações entre cientistas de instituições diferentes.',
      },
      {
        kind: 'paragraph',
        text: 'Em 1993, o CERN tornou a tecnologia da Web livre para qualquer pessoa usar e desenvolver. A partir daí, páginas, serviços e formas de colaboração se multiplicaram. O detalhe humano é bonito: uma solução criada para pesquisadores encontrarem informações acabou mudando também como estudamos, compramos, atendemos clientes e mostramos nosso trabalho.',
      },
      { kind: 'heading', text: 'Qual problema esta disciplina resolve' },
      {
        kind: 'keyIdea',
        text: 'Carreira digital não é colecionar nomes de ferramentas. É transformar conhecimento em uma entrega que outra pessoa consegue compreender, conferir e usar.',
      },
      {
        kind: 'table',
        headers: ['Situação comum', 'A habilidade digital ajuda a', 'Evidência possível'],
        rows: [
          [
            'Arquivos espalhados',
            'Organizar nomes, pastas e versões',
            'Estrutura de pastas explicada',
          ],
          [
            'Informação difícil de entender',
            'Escrever e revisar um documento',
            'Relatório curto em PDF',
          ],
          ['Gastos sem visão do total', 'Calcular e comparar dados', 'Planilha conferida'],
          [
            'Ideia boa, mas confusa',
            'Construir uma narrativa visual',
            'Apresentação de poucos slides',
          ],
        ],
      },
      { kind: 'heading', text: 'Seu primeiro passo, sem editar nada ainda' },
      {
        kind: 'steps',
        items: [
          'Pense em uma tarefa real que você já conseguiu concluir com ajuda de tecnologia.',
          'Diga qual era o problema antes de citar a ferramenta.',
          'Nomeie a entrega: arquivo, mensagem, planilha, apresentação ou organização criada.',
          'Anote como você conferiu o resultado. Se ainda não conferiu, essa é a primeira melhoria.',
          'Guarde a frase. Você não precisa publicar, montar portfólio ou mudar o currículo agora.',
        ],
      },
      {
        kind: 'analogy',
        text: 'Uma carreira é menos parecida com uma escada rolante e mais com um caminho de pedras. Você não precisa enxergar o trajeto inteiro; precisa apenas escolher uma próxima pedra firme.',
      },
      {
        kind: 'warning',
        text: 'Não invente experiência para parecer mais preparado. Um projeto de estudo identificado com honestidade vale mais do que uma história que não pode ser explicada.',
      },
      { kind: 'heading', text: 'Fontes para continuar a história' },
      {
        kind: 'list',
        items: [
          '[CERN — Uma breve história da Web](https://home.cern/science/computing/the-birth-of-the-web/short-history-web/)',
          '[CERN — 30 anos de uma Web livre e aberta](https://home.cern/30-years-free-and-open-web/)',
        ],
      },
    ],
    reflection: [
      'Que tarefa digital você já realiza, mesmo sem se considerar uma pessoa de tecnologia?',
      'Qual entrega simples poderia provar essa habilidade sem expor dados pessoais ou de uma empresa?',
    ],
    checklist: [
      'Consigo explicar a diferença entre citar uma ferramenta e mostrar uma evidência.',
      'Escolhi uma tarefa próxima da minha realidade.',
      'Meu primeiro passo não exige publicar ou entregar nada.',
    ],
    recap: [
      'O trabalho digital surgiu de uma evolução coletiva das formas de registrar, compartilhar e usar informação.',
      'A Web nasceu para facilitar a troca de informações e ampliou as possibilidades de trabalho e aprendizagem.',
      'Começar bem é reconhecer um problema, uma ação, uma entrega e uma forma de conferência.',
    ],
  },

  'introducao-a-computacao-e-windows': {
    lessonTitle: 'Antes dos cliques: por que o computador ganhou janelas',
    summary:
      'Conheça a passagem dos computadores enormes ao Windows e explore a tela com calma antes de executar tarefas.',
    topics: ['Computadores pessoais', 'Origem do Windows', 'Exploração segura da tela'],
    estimatedMinutes: 18,
    problem:
      'Quando cada botão parece capaz de apagar alguma coisa, até mover o mouse dá tensão. A boa notícia é que o computador pessoal foi sendo desenhado justamente para aproximar a máquina das pessoas — e você pode começar apenas observando.',
    outcome:
      'Ao terminar, você conseguirá contar por que interfaces gráficas surgiram, reconhecer os espaços básicos do Windows e explorar sem alterar arquivos.',
    blocks: [
      { kind: 'heading', text: 'Antes da mesa, uma sala inteira' },
      {
        kind: 'paragraph',
        text: 'Os primeiros computadores eletrônicos ocupavam grandes espaços e eram usados principalmente por governos e grandes organizações. Na década de 1970, o microprocessador ajudou a reduzir tamanho e custo. Nos anos seguintes, o computador começou a chegar a casas, escolas e pequenos negócios.',
      },
      {
        kind: 'paragraph',
        text: 'Em 1981, o IBM PC com o sistema MS-DOS ajudou a estabelecer um padrão de computador pessoal. Ainda assim, muita interação dependia de comandos digitados. O Windows 1.0, lançado em 1985, apresentou uma interface gráfica: programas, informações e escolhas podiam aparecer em áreas visuais na tela. Em 1995, o Menu Iniciar e a barra de tarefas ficaram centrais no Windows.',
      },
      { kind: 'heading', text: 'Qual problema o Windows resolve' },
      {
        kind: 'keyIdea',
        text: 'O Windows organiza a conversa entre você, os programas, os arquivos e as peças do computador. Ele não substitui o computador: funciona como o ambiente que coordena tudo isso.',
      },
      {
        kind: 'table',
        headers: ['Elemento', 'Pergunta que ele responde', 'Exemplo cotidiano'],
        rows: [
          ['Área de Trabalho', 'Onde posso começar?', 'Abrir uma pasta de estudos'],
          ['Menu Iniciar', 'Onde está o programa?', 'Procurar a calculadora'],
          ['Barra de tarefas', 'O que está aberto?', 'Voltar ao navegador'],
          ['Explorador de Arquivos', 'Onde meu arquivo foi salvo?', 'Encontrar um documento'],
        ],
      },
      { kind: 'heading', text: 'Primeiro passeio: só observar' },
      {
        kind: 'steps',
        items: [
          'Apoie a mão no mouse e mova o ponteiro sem clicar.',
          'Localize o Menu Iniciar, a barra de tarefas e o relógio.',
          'Abra o Menu Iniciar uma vez e leia três nomes de aplicativos.',
          'Feche o menu clicando em uma área vazia. Nada precisa ser instalado ou salvo.',
          'Repita devagar e diga em voz alta o que abriu e como fechou.',
        ],
      },
      {
        kind: 'tip',
        text: 'Observar antes de clicar não é lentidão: é uma técnica de aprendizagem. Leia o rótulo, preveja o que deve acontecer e só então confirme.',
      },
      {
        kind: 'warning',
        text: 'Por enquanto, não altere configurações, não mova arquivos e não instale programas. Essas ações terão explicação e caminho de volta nas aulas certas.',
      },
      { kind: 'heading', text: 'Fonte oficial para continuar a história' },
      {
        kind: 'list',
        items: [
          '[Microsoft — A história dos computadores pessoais](https://www.microsoft.com/en-us/windows/learning-center/history-of-the-pc)',
        ],
      },
    ],
    reflection: [
      'Qual parte da tela deixou de parecer desconhecida depois do passeio?',
      'O que você gostaria que acontecesse antes de clicar em um ícone?',
    ],
    checklist: [
      'Sei que Windows é software, não uma peça física do computador.',
      'Localizei Menu Iniciar, barra de tarefas e Área de Trabalho.',
      'Consegui abrir e fechar o menu sem alterar arquivos.',
    ],
    recap: [
      'O computador pessoal ficou menor, mais acessível e mais visual ao longo de décadas.',
      'O Windows 1.0 levou uma interface gráfica ao público em 1985.',
      'A primeira habilidade não é clicar rápido: é observar, prever e reconhecer o caminho de volta.',
    ],
  },

  'microsoft-word-para-administracao': {
    lessonTitle: 'Antes da página em branco: a história de editar sem recomeçar',
    summary:
      'Descubra por que os processadores de texto mudaram a escrita e conheça o Word antes de formatar documentos.',
    topics: ['Origem do Word', 'Problema da reescrita', 'Primeira leitura da interface'],
    estimatedMinutes: 18,
    problem:
      'Uma página em branco pode parecer uma cobrança: escreva, formate e acerte tudo de primeira. Mas o processador de texto nasceu para fazer justamente o contrário — permitir escrever, corrigir, reorganizar e melhorar sem começar de novo.',
    outcome:
      'Ao terminar, você conseguirá explicar o problema que o Word resolve, reconhecer usos administrativos e observar um documento antes de editá-lo.',
    blocks: [
      { kind: 'heading', text: 'Quando corrigir significava refazer' },
      {
        kind: 'paragraph',
        text: 'Em máquinas de escrever, uma mudança no começo do texto podia exigir datilografar uma página inteira novamente. Processadores de texto separaram a escrita da impressão: primeiro você cria e revisa; depois decide como o documento será apresentado.',
      },
      {
        kind: 'paragraph',
        text: 'O Word 1.0 foi lançado em 25 de outubro de 1983 e chegou ao Windows em 1989. Um de seus diferenciais era a interface gráfica e a proposta de mostrar na tela uma aproximação do resultado impresso. A ferramenta continuou evoluindo de um editor individual para um espaço de revisão e colaboração.',
      },
      { kind: 'heading', text: 'Qual problema o Word resolve' },
      {
        kind: 'keyIdea',
        text: 'O Word ajuda a transformar informação em um documento legível, revisável e compartilhável. Digitar é apenas uma parte; estrutura e clareza fazem o documento funcionar.',
      },
      {
        kind: 'table',
        headers: ['Necessidade', 'Recurso que ajuda', 'Aplicação'],
        rows: [
          ['Corrigir sem reescrever', 'Edição e desfazer', 'Ofício ou trabalho escolar'],
          ['Manter padrão', 'Estilos e temas', 'Relatório recorrente'],
          ['Localizar seções', 'Títulos e sumário', 'Manual ou projeto'],
          ['Revisar em conjunto', 'Comentários e controle de alterações', 'Documento de equipe'],
        ],
      },
      { kind: 'heading', text: 'Primeira aproximação: leia antes de formatar' },
      {
        kind: 'steps',
        items: [
          'Abra um documento de exemplo ou um arquivo sem informação sensível.',
          'Observe o título, os parágrafos, as listas e os espaços em branco.',
          'Localize a faixa de opções, a página e a barra de status.',
          'Clique em uma palavra apenas para posicionar o cursor; não altere o texto.',
          'Feche sem salvar caso o programa pergunte. Na próxima aula, você editará com um objetivo claro.',
        ],
      },
      {
        kind: 'analogy',
        text: 'Formatar antes de estruturar é como escolher a moldura antes de saber qual fotografia será colocada nela. Primeiro vem a mensagem; depois, a aparência a serviço dela.',
      },
      {
        kind: 'warning',
        text: 'Não use espaços repetidos para alinhar conteúdo. O texto pode parecer certo na sua tela e quebrar ao imprimir, exportar ou abrir em outro dispositivo.',
      },
      { kind: 'heading', text: 'Fonte oficial para continuar a história' },
      {
        kind: 'list',
        items: [
          '[Microsoft — História e linha do tempo do Word](https://www.microsoft.com/en-us/microsoft-365/word/history-of-microsoft-word)',
        ],
      },
    ],
    reflection: [
      'Que documento do seu dia a dia precisa mais de clareza do que de decoração?',
      'Que parte você observaria antes de começar a corrigir esse documento?',
    ],
    checklist: [
      'Entendo que editar, estruturar e formatar são ações diferentes.',
      'Reconheci página, faixa de opções e barra de status.',
      'Consigo abrir e observar um documento sem alterar o original.',
    ],
    recap: [
      'Processadores de texto reduziram a necessidade de reescrever páginas inteiras.',
      'O Word surgiu em 1983 e chegou ao Windows em 1989.',
      'Um bom documento começa pela finalidade, pelo leitor e pela estrutura.',
    ],
  },

  'microsoft-excel-para-administracao': {
    lessonTitle: 'Antes das fórmulas: de onde vieram as planilhas',
    summary:
      'Entenda a passagem dos livros de contas às planilhas eletrônicas e conheça a lógica do Excel sem pressa.',
    topics: ['Origem das planilhas', 'Problema do recálculo', 'Linhas, colunas e células'],
    estimatedMinutes: 18,
    problem:
      'Para quem está começando, a grade do Excel pode parecer um tabuleiro com casas demais. Ela existe, porém, para resolver um problema muito antigo: registrar informações, relacionar valores e refazer contas quando alguma coisa muda.',
    outcome:
      'Ao terminar, você conseguirá explicar por que planilhas eletrônicas existem, reconhecer usos cotidianos e localizar uma informação sem escrever fórmulas.',
    blocks: [
      { kind: 'heading', text: 'A planilha veio antes do computador' },
      {
        kind: 'paragraph',
        text: 'Comerciantes, famílias e organizações registram entradas, saídas e quantidades em linhas e colunas há muito tempo. No papel, mudar um valor podia obrigar a refazer várias contas. A planilha eletrônica tornou o recálculo automático e permitiu testar cenários sem apagar o registro inteiro.',
      },
      {
        kind: 'paragraph',
        text: 'Em 30 de setembro de 1985, a Microsoft anunciou o Excel para Macintosh como uma planilha que reunia cálculos, gráficos de negócios e recursos de banco de dados na mesma tela. O ponto não era preencher quadradinhos: era conectar dados, contas e visualizações.',
      },
      { kind: 'heading', text: 'Qual problema o Excel resolve' },
      {
        kind: 'keyIdea',
        text: 'O Excel organiza dados em células relacionadas. Quando a fonte muda, fórmulas podem recalcular o resultado; quando a pergunta muda, filtros, tabelas e gráficos ajudam a olhar de outro jeito.',
      },
      {
        kind: 'table',
        headers: ['Pergunta cotidiana', 'Dados necessários', 'Resultado útil'],
        rows: [
          ['Quanto gastei no mês?', 'Data, categoria e valor', 'Total por categoria'],
          ['O que precisa ser reposto?', 'Item, quantidade e mínimo', 'Lista de reposição'],
          ['Qual prazo está próximo?', 'Tarefa, responsável e data', 'Pendências ordenadas'],
          ['Como os valores mudaram?', 'Período e medida', 'Comparação ou gráfico'],
        ],
      },
      { kind: 'heading', text: 'Primeiro passeio pela grade' },
      {
        kind: 'steps',
        items: [
          'Abra uma pasta de trabalho vazia.',
          'Localize as letras das colunas e os números das linhas.',
          'Clique em uma célula e observe o nome dela, como A1.',
          'Passe por duas abas da faixa de opções sem alterar configurações.',
          'Feche o arquivo sem salvar. Fórmulas, formatos e dados chegam depois desse mapa inicial.',
        ],
      },
      {
        kind: 'analogy',
        text: 'Uma célula é como um endereço: a coluna indica a rua e a linha indica o número. A referência A1 aponta para um lugar específico da grade.',
      },
      {
        kind: 'warning',
        text: 'Excel não adivinha se um dado está correto. Uma fórmula perfeita sobre valores errados produz um resultado errado com aparência profissional.',
      },
      { kind: 'heading', text: 'Fonte oficial para continuar a história' },
      {
        kind: 'list',
        items: [
          '[Microsoft Learn — História da Microsoft em 1985](https://learn.microsoft.com/en-us/shows/history/history-of-microsoft-1985)',
        ],
      },
    ],
    reflection: [
      'Que conta repetitiva do seu dia a dia ficaria mais segura se os valores estivessem organizados?',
      'Qual informação precisaria ser conferida antes de confiar no resultado?',
    ],
    checklist: [
      'Sei por que uma planilha eletrônica é mais do que uma tabela desenhada.',
      'Consigo identificar linha, coluna, célula e endereço.',
      'Ainda não preciso escrever uma fórmula para entender a grade.',
    ],
    recap: [
      'Planilhas organizam registros em linhas e colunas muito antes dos computadores.',
      'O Excel para Macintosh foi anunciado em 1985 com cálculos, gráficos e dados integrados.',
      'A confiança no resultado depende tanto da fórmula quanto da qualidade dos dados.',
    ],
  },

  'microsoft-powerpoint-para-administracao': {
    lessonTitle: 'Antes dos slides: por que ideias ganharam uma tela',
    summary:
      'Conheça a origem do PowerPoint e comece pela mensagem que o público precisa levar, não pelos efeitos.',
    topics: ['Origem do PowerPoint', 'Comunicação visual', 'Mensagem antes do layout'],
    estimatedMinutes: 18,
    problem:
      'Abrir o PowerPoint e escolher animações parece uma maneira rápida de começar. É também uma maneira rápida de terminar com slides bonitos e uma mensagem perdida. Antes das caixas e cores, precisamos saber que conversa a apresentação veio facilitar.',
    outcome:
      'Ao terminar, você conseguirá contar a origem do PowerPoint, reconhecer aplicações úteis e formular a mensagem central antes de criar slides.',
    blocks: [
      { kind: 'heading', text: 'Da transparência ao computador pessoal' },
      {
        kind: 'paragraph',
        text: 'Apresentações visuais já existiam com cartazes, projetores e transparências. Preparar e corrigir esse material, porém, exigia tempo e recursos físicos. Na startup Forethought, Robert Gaskins percebeu que computadores pessoais poderiam oferecer uma forma melhor de criar apresentações visuais.',
      },
      {
        kind: 'paragraph',
        text: 'A Forethought lançou o PowerPoint para o Macintosh em 1987. A Microsoft comprou a empresa e o produto no mesmo ano. A ferramenta cresceu das salas com transparências para aulas, reuniões, propostas, projetos e apresentações acessadas em diferentes dispositivos.',
      },
      { kind: 'heading', text: 'Qual problema o PowerPoint resolve' },
      {
        kind: 'keyIdea',
        text: 'Uma apresentação ajuda uma pessoa a conduzir a atenção de outras por uma sequência de ideias. O slide apoia a fala e a compreensão; ele não precisa carregar sozinho tudo o que será dito.',
      },
      {
        kind: 'table',
        headers: ['Situação', 'Pergunta do público', 'Papel do slide'],
        rows: [
          ['Proposta', 'Por que isso importa?', 'Mostrar problema e benefício'],
          ['Relatório', 'O que os dados dizem?', 'Destacar comparação e conclusão'],
          ['Aula', 'Como as partes se conectam?', 'Guiar a explicação'],
          [
            'Atualização de projeto',
            'Onde estamos e o que vem agora?',
            'Mostrar avanço, risco e próximo passo',
          ],
        ],
      },
      { kind: 'heading', text: 'Primeiro passo: uma frase antes de um slide' },
      {
        kind: 'steps',
        items: [
          'Escolha uma situação simples, como apresentar uma ideia de melhoria.',
          'Complete a frase: ao final, quero que o público entenda que…',
          'Anote três perguntas que essa pessoa faria.',
          'Organize as respostas em começo, desenvolvimento e fechamento.',
          'Pare aqui. Você só abrirá o PowerPoint depois de saber o que precisa comunicar.',
        ],
      },
      {
        kind: 'analogy',
        text: 'O slide é a sinalização da estrada, não a viagem inteira. Ele mostra direção e pontos importantes; quem conduz a experiência é a narrativa.',
      },
      {
        kind: 'warning',
        text: 'Efeito visual não conserta uma mensagem confusa. Se o público não sabe por que está vendo aquele slide, a animação apenas movimenta a dúvida.',
      },
      { kind: 'heading', text: 'Fonte oficial para continuar a história' },
      {
        kind: 'list',
        items: [
          '[Microsoft — Uma forma melhor de compartilhar ideias](https://blogs.microsoft.com/bayarea/2018/02/01/hacking-the-deck-for-success/)',
          '[Microsoft — As raízes do PowerPoint no Vale do Silício](https://blogs.microsoft.com/bayarea/2025/04/03/decades-of-innovating-in-the-heart-of-silicon-valley-microsofts-deep-roots-in-the-bay-area/)',
        ],
      },
    ],
    reflection: [
      'Que apresentação recente tinha muitos elementos, mas pouca direção?',
      'Qual frase você gostaria que o público lembrasse ao final de uma apresentação sua?',
    ],
    checklist: [
      'Consigo separar mensagem, narrativa e aparência visual.',
      'Formulei uma frase central antes de abrir a ferramenta.',
      'Entendo que o slide apoia, mas não substitui, a explicação.',
    ],
    recap: [
      'O PowerPoint surgiu para tornar a criação de apresentações visuais mais prática no computador pessoal.',
      'A Forethought lançou o produto em 1987 e a Microsoft o adquiriu no mesmo ano.',
      'Uma boa apresentação começa pela transformação desejada no público.',
    ],
  },

  'git-e-github-na-pratica': {
    lessonTitle: 'Antes do primeiro commit: a história de parar de perder versões',
    summary:
      'Entenda o conflito que deu origem ao Git e prepare um caderno de bordo antes de executar comandos.',
    topics: ['Origem do Git', 'Problema do versionamento', 'Mapa do primeiro repositório'],
    estimatedMinutes: 18,
    problem:
      'Você já viu arquivos chamados final, final-agora-vai e final-corrigido? Essa coleção tenta responder a uma pergunta legítima: como guardar mudanças sem perder o que funcionava? O Git transforma essa preocupação em um histórico que pode ser explicado.',
    outcome:
      'Ao terminar, você conseguirá explicar por que o Git nasceu, diferenciar Git de GitHub e desenhar o fluxo de um primeiro registro antes de usar o terminal.',
    blocks: [
      { kind: 'heading', text: 'Um projeto enorme e uma ruptura em 2005' },
      {
        kind: 'paragraph',
        text: 'Nos primeiros anos do Linux, mudanças no código circulavam como arquivos e patches. Em 2002, o projeto passou a usar o BitKeeper, um sistema distribuído proprietário. Em 2005, a relação entre a comunidade do Linux e a empresa responsável pela ferramenta se rompeu, e o uso gratuito terminou.',
      },
      {
        kind: 'paragraph',
        text: 'A comunidade do Linux, especialmente Linus Torvalds, criou então uma ferramenta própria. O novo sistema precisava ser rápido, distribuído, simples em sua base e capaz de lidar com milhares de caminhos de desenvolvimento. Assim nasceu o Git: não como moda, mas como resposta a colaboração em escala e independência técnica.',
      },
      { kind: 'heading', text: 'Git e GitHub não são a mesma coisa' },
      {
        kind: 'table',
        headers: ['Peça', 'O que faz', 'Imagem mental'],
        rows: [
          ['Git', 'Registra versões no seu computador', 'Caderno de bordo'],
          ['Repositório', 'Reúne projeto e histórico', 'Pasta com memória'],
          ['Commit', 'Marca um conjunto explicado de mudanças', 'Página datada'],
          ['GitHub', 'Hospeda e conecta repositórios pela Web', 'Mesa de colaboração'],
        ],
      },
      { kind: 'heading', text: 'Onde isso aparece no dia a dia' },
      {
        kind: 'list',
        items: [
          'Comparar o que mudou entre duas versões de um projeto.',
          'Experimentar uma ideia sem destruir a versão estável.',
          'Entender quem tomou uma decisão e por quê.',
          'Revisar uma contribuição antes de juntá-la ao trabalho principal.',
        ],
      },
      { kind: 'heading', text: 'Primeiro passo sem terminal' },
      {
        kind: 'steps',
        items: [
          'Escolha uma pasta de estudos que não contenha senhas nem documentos pessoais.',
          'Anote qual projeto viverá nela e o que não deve entrar no histórico.',
          'Imagine uma mudança pequena, como criar um arquivo de apresentação do projeto.',
          'Escreva uma frase que explique por que essa mudança existe.',
          'Guarde o mapa. Instalação e comandos serão feitos na próxima etapa, com conferência a cada passo.',
        ],
      },
      {
        kind: 'warning',
        text: 'Git registra muito bem aquilo que recebe. Isso inclui segredos enviados por engano. Nunca coloque senhas, chaves de acesso ou dados privados em um repositório.',
      },
      { kind: 'heading', text: 'Fonte oficial para continuar a história' },
      {
        kind: 'list',
        items: [
          '[Livro oficial do Git — Uma breve história do Git](https://git-scm.com/book/en/v2/Getting-Started-A-Short-History-of-Git)',
        ],
      },
    ],
    reflection: [
      'Que confusão de versões você já tentou resolver duplicando arquivos?',
      'O que uma boa mensagem de histórico precisaria explicar para você no futuro?',
    ],
    checklist: [
      'Consigo explicar a diferença entre Git, repositório, commit e GitHub.',
      'Escolhi uma pasta segura para estudar.',
      'Entendi que o primeiro commit virá depois da preparação do ambiente.',
    ],
    recap: [
      'O Git nasceu em 2005 após uma ruptura no modo como o projeto Linux controlava versões.',
      'Seu objetivo central é registrar e integrar mudanças com velocidade e independência.',
      'Antes do comando, vem a decisão sobre o que registrar e como explicar.',
    ],
  },

  'logica-de-programacao-e-algoritmos': {
    lessonTitle: 'Antes do código: a longa história de organizar passos',
    summary:
      'Conheça a origem da palavra algoritmo e pratique a observação de um processo antes de programar.',
    topics: ['Origem dos algoritmos', 'Problema e sequência', 'Observação antes do pseudocódigo'],
    estimatedMinutes: 18,
    problem:
      'Programar pode parecer aprender palavras mágicas em outra língua. Antes de qualquer linguagem, porém, existe uma habilidade mais antiga e próxima: observar um problema, separar decisões e colocar os passos em uma ordem que outra pessoa consiga testar.',
    outcome:
      'Ao terminar, você conseguirá explicar por que algoritmos não pertencem a um único programa e descrever um processo cotidiano com começo, decisões e resultado.',
    blocks: [
      { kind: 'heading', text: 'Algoritmos vieram antes dos computadores' },
      {
        kind: 'paragraph',
        text: 'Métodos passo a passo para calcular, medir e organizar tarefas atravessam séculos e culturas; por isso, lógica de programação não tem um único criador. A palavra algoritmo guarda uma pista histórica: ela chegou às línguas europeias a partir da forma latina do nome de al-Khwarizmi, estudioso do século 9 ligado a importantes trabalhos de matemática.',
      },
      {
        kind: 'paragraph',
        text: 'Com os computadores, a precisão ganhou outra urgência. Uma pessoa completa lacunas usando experiência e contexto. A máquina executa as instruções e as regras que recebeu. Programar começa quando transformamos intenção em uma sequência clara o bastante para ser repetida e conferida.',
      },
      { kind: 'heading', text: 'Qual problema a lógica resolve' },
      {
        kind: 'keyIdea',
        text: 'Lógica de programação reduz a distância entre “quero este resultado” e “estes são os passos e decisões que produzem o resultado”.',
      },
      {
        kind: 'table',
        headers: ['Situação', 'Entrada', 'Decisão ou processo', 'Saída'],
        rows: [
          ['Organizar tarefas', 'Lista e prazos', 'Ordenar por urgência', 'Próxima tarefa'],
          ['Controlar orçamento', 'Receitas e despesas', 'Somar e comparar', 'Saldo e alerta'],
          [
            'Validar cadastro',
            'Campos preenchidos',
            'Verificar regras',
            'Aceitar ou pedir correção',
          ],
        ],
      },
      { kind: 'heading', text: 'Primeiro exercício: observar antes de escrever' },
      {
        kind: 'steps',
        items: [
          'Escolha uma tarefa cotidiana pequena, como separar documentos para uma inscrição.',
          'Diga qual resultado mostra que a tarefa terminou.',
          'Liste apenas os passos que realmente mudam a situação.',
          'Marque onde uma escolha pode alterar o próximo passo.',
          'Teste a sequência mentalmente com um caso comum e um caso em que falta alguma informação.',
        ],
      },
      {
        kind: 'analogy',
        text: 'Um algoritmo é como uma orientação de caminho. “Vá até lá” expressa o desejo; ruas, conversões e pontos de referência tornam a chegada verificável.',
      },
      {
        kind: 'warning',
        text: 'Não tente parecer técnico usando passos vagos. “Processar os dados” esconde justamente a parte que precisa ser explicada.',
      },
      { kind: 'heading', text: 'Fonte para continuar a história' },
      {
        kind: 'list',
        items: [
          '[NASA Earth Observatory — Como o algoritmo ganhou esse nome](https://science.nasa.gov/earth/earth-observatory/how-algorithm-got-its-name-91544/)',
        ],
      },
    ],
    reflection: [
      'Em qual passo da sua tarefa uma pessoa poderia interpretar a instrução de duas maneiras?',
      'Que caso diferente faria a sequência mudar de caminho?',
    ],
    checklist: [
      'Consigo separar intenção, entrada, processo e resultado.',
      'Identifiquei pelo menos uma decisão na tarefa observada.',
      'Testei a sequência sem depender de uma linguagem de programação.',
    ],
    recap: [
      'Procedimentos passo a passo são muito anteriores aos computadores e não têm um único inventor.',
      'A palavra algoritmo preserva a passagem do nome de al-Khwarizmi por traduções latinas.',
      'Programar começa por tornar passos e decisões claros o bastante para serem testados.',
    ],
  },

  'html-e-css-do-zero': {
    lessonTitle: 'Antes da primeira página: a Web nasceu para conectar informação',
    summary:
      'Viaje da proposta da Web ao nascimento do CSS e desenhe a intenção da página antes de escrever marcação.',
    topics: ['Nascimento da Web', 'HTML e significado', 'CSS e apresentação'],
    estimatedMinutes: 18,
    problem:
      'Hoje uma página parece algo óbvio: título, texto, imagem, botão e link. No fim dos anos 1980, compartilhar documentos entre computadores e instituições diferentes era uma dificuldade real. HTML e CSS fazem sentido quando lembramos desse problema.',
    outcome:
      'Ao terminar, você conseguirá contar por que a Web foi criada, separar estrutura de aparência e esboçar uma página sem ainda escrever código.',
    blocks: [
      { kind: 'heading', text: 'Uma teia para cientistas encontrarem informação' },
      {
        kind: 'paragraph',
        text: 'Em 1989, Tim Berners-Lee propôs a World Wide Web enquanto trabalhava no CERN. A necessidade era prática: cientistas de universidades e laboratórios em diferentes países precisavam compartilhar informação com mais facilidade. A proposta reuniu computadores, redes e hipertexto em um sistema global simples de usar.',
      },
      {
        kind: 'paragraph',
        text: 'No fim de 1990, o primeiro servidor e o primeiro navegador já funcionavam no CERN. O HTML dava significado e conexão aos documentos. Mas autores queriam controlar melhor a aparência. Em 1994, Håkon Wium Lie publicou uma proposta de folhas de estilo em cascata; o CSS nasceu para cuidar da apresentação sem transformar HTML em uma linguagem de desenho de páginas.',
      },
      { kind: 'heading', text: 'Duas responsabilidades que trabalham juntas' },
      {
        kind: 'table',
        headers: ['Camada', 'Pergunta principal', 'Exemplo'],
        rows: [
          ['HTML', 'O que este conteúdo significa?', 'Título, parágrafo, navegação, formulário'],
          ['CSS', 'Como este conteúdo deve ser apresentado?', 'Espaço, cor, tamanho, posição'],
          ['Navegador', 'Como interpretar e exibir?', 'Página vista no computador ou celular'],
        ],
      },
      {
        kind: 'keyIdea',
        text: 'HTML cria estrutura e significado; CSS organiza a apresentação. Separar os dois torna a página mais compreensível, adaptável e fácil de manter.',
      },
      { kind: 'heading', text: 'Primeiro passo: uma página de papel' },
      {
        kind: 'steps',
        items: [
          'Escolha uma página simples, como a apresentação de um projeto de estudo.',
          'Escreva quem vai acessar a página e o que essa pessoa procura.',
          'Liste os blocos por significado: título, resumo, projetos e contato.',
          'Ordene os blocos sem pensar em cor, fonte ou animação.',
          'Desenhe uma caixa para cada bloco. O código virá depois que a estrutura fizer sentido.',
        ],
      },
      {
        kind: 'warning',
        text: 'Não escolha elementos HTML pela aparência padrão do navegador. Um título é título pelo papel que cumpre, não apenas porque aparece grande.',
      },
      { kind: 'heading', text: 'Fontes oficiais para continuar a história' },
      {
        kind: 'list',
        items: [
          '[CERN — Uma breve história da Web](https://home.cern/science/computing/the-birth-of-the-web/short-history-web/)',
          '[W3C — Uma breve história do CSS](https://www.w3.org/Style/CSS20/history.html)',
          '[W3C — Proposta original de folhas de estilo em cascata](https://www.w3.org/People/howcome/p/cascade.html)',
        ],
      },
    ],
    reflection: [
      'Que informação precisa aparecer primeiro para o visitante da sua página?',
      'Qual decisão do esboço pertence à estrutura e qual pertence à aparência?',
    ],
    checklist: [
      'Consigo explicar por que a Web nasceu no CERN.',
      'Separo a responsabilidade do HTML da responsabilidade do CSS.',
      'Esbocei a página pelo significado antes da aparência.',
    ],
    recap: [
      'A Web foi proposta em 1989 para facilitar a troca de informações entre pesquisadores.',
      'HTML estrutura e conecta documentos; CSS surgiu para cuidar de sua apresentação.',
      'A primeira página começa pela necessidade de quem vai usá-la.',
    ],
  },

  'javascript-fundamentos': {
    lessonTitle: 'Antes do primeiro script: quando a página começou a responder',
    summary: 'Conheça o nascimento do JavaScript e descreva um comportamento antes de programá-lo.',
    topics: ['Origem do JavaScript', 'Comportamento na Web', 'Evento, regra e resposta'],
    estimatedMinutes: 18,
    problem:
      'HTML organiza o conteúdo e CSS cuida da apresentação, mas uma página só com essas camadas não decide o que fazer quando alguém clica, digita ou envia um formulário. JavaScript entrou na história para dar comportamento a essa conversa.',
    outcome:
      'Ao terminar, você conseguirá contar como JavaScript surgiu, diferenciá-lo de Java e descrever uma interação como evento, regra e resposta.',
    blocks: [
      { kind: 'heading', text: 'Uma linguagem para uma Web que queria reagir' },
      {
        kind: 'paragraph',
        text: 'JavaScript foi criado em 1995 por Brendan Eich, então engenheiro da Netscape, e chegou ao navegador Netscape Navigator 2. O nome mudou durante o lançamento, mas JavaScript e Java são linguagens diferentes, com histórias e modelos próprios.',
      },
      {
        kind: 'paragraph',
        text: 'A Web estava deixando de ser apenas uma coleção de documentos. Páginas precisavam responder a ações, validar informações e atualizar partes da tela. JavaScript permitiu colocar regras perto da experiência do usuário e, com o tempo, passou a ser usado também em servidores, ferramentas e muitos outros ambientes.',
      },
      { kind: 'heading', text: 'Qual problema o JavaScript resolve' },
      {
        kind: 'table',
        headers: ['Evento', 'Regra', 'Resposta'],
        rows: [
          ['Clique em adicionar', 'Item precisa ter nome', 'Mostrar item ou pedir correção'],
          ['Digitação no campo', 'Limite de caracteres', 'Atualizar contador'],
          ['Envio do formulário', 'Campos obrigatórios completos', 'Enviar ou destacar pendências'],
        ],
      },
      {
        kind: 'keyIdea',
        text: 'Um script útil liga um evento observável a uma regra compreensível e a uma resposta que ajuda a pessoa a continuar.',
      },
      { kind: 'heading', text: 'Primeiro passo sem escrever código' },
      {
        kind: 'steps',
        items: [
          'Escolha uma interação conhecida, como marcar uma tarefa como concluída.',
          'Descreva o evento: o que a pessoa faz?',
          'Descreva o estado anterior: o que já existe antes da ação?',
          'Defina a regra e o que deve aparecer depois.',
          'Inclua um caso inválido. O primeiro script será apenas a tradução desse comportamento.',
        ],
      },
      {
        kind: 'warning',
        text: 'Não comece copiando um trecho que você ainda não consegue narrar. Se cada linha não tiver um papel no comportamento descrito, o exemplo está grande demais para o primeiro passo.',
      },
      { kind: 'heading', text: 'Fontes para continuar a história' },
      {
        kind: 'list',
        items: [
          '[MDN — Origem e história do JavaScript](https://developer.mozilla.org/en-US/docs/Glossary/JavaScript)',
          '[MDN — O que é JavaScript?](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting/What_is_JavaScript)',
        ],
      },
    ],
    reflection: [
      'Que resposta deixaria a interação escolhida clara para a pessoa usuária?',
      'Que caso inválido o comportamento também precisa tratar?',
    ],
    checklist: [
      'Consigo separar JavaScript de Java.',
      'Descrevi evento, estado, regra e resposta.',
      'Tenho um comportamento pequeno o bastante para traduzir no primeiro script.',
    ],
    recap: [
      'JavaScript foi criado por Brendan Eich na Netscape em 1995.',
      'A linguagem levou comportamento às páginas e hoje aparece em muitos ambientes.',
      'Um primeiro script deve responder a uma interação pequena e bem descrita.',
    ],
  },

  'python-para-iniciantes': {
    lessonTitle: 'Antes do primeiro programa: Python nasceu de uma necessidade real',
    summary:
      'Conheça a história contada por Guido van Rossum e prepare uma automação pequena antes de escrever código.',
    topics: ['Origem do Python', 'Automação e clareza', 'Entrada, transformação e saída'],
    estimatedMinutes: 18,
    problem:
      'Uma linguagem de programação pode parecer um conjunto de regras criado só para testar iniciantes. Python nasceu em um cenário bem mais humano: uma equipe tinha trabalho para fazer e as opções disponíveis tornavam a tarefa mais difícil do que precisava ser.',
    outcome:
      'Ao terminar, você conseguirá explicar por que Python foi criado, reconhecer usos adequados e recortar uma pequena automação antes de programar.',
    blocks: [
      {
        kind: 'heading',
        text: 'Férias de fim de ano, uma linguagem anterior e um problema de administração',
      },
      {
        kind: 'paragraph',
        text: 'Guido van Rossum trabalhava no CWI, nos Países Baixos, com o sistema operacional distribuído Amoeba. A equipe precisava de uma forma melhor de administrar o sistema do que escrever programas em C ou scripts de shell. Guido também trazia aprendizados e incômodos de uma linguagem chamada ABC.',
      },
      {
        kind: 'paragraph',
        text: 'Durante as férias de Natal de 1989, ele começou a experimentar uma linguagem extensível, com sintaxe clara e acesso às necessidades do sistema. Ao longo de 1990, colegas usaram e influenciaram o projeto. Em fevereiro de 1991, Python foi publicado na Usenet. O nome veio da comédia Monty Python, não da cobra.',
      },
      { kind: 'heading', text: 'Qual problema Python resolve' },
      {
        kind: 'keyIdea',
        text: 'Python permite expressar uma solução com código legível e combinar essa solução com uma biblioteca ampla. Clareza ajuda, mas não elimina a necessidade de decompor e testar o problema.',
      },
      {
        kind: 'table',
        headers: ['Necessidade', 'Possível uso de Python', 'Cuidado'],
        rows: [
          ['Renomear muitos arquivos', 'Automação de arquivos', 'Testar em cópias'],
          ['Resumir dados', 'Leitura e cálculo', 'Validar fonte e tipos'],
          ['Integrar serviços', 'Requisições e transformação', 'Proteger credenciais'],
          ['Criar uma aplicação', 'Regras e bibliotecas', 'Definir escopo e testes'],
        ],
      },
      { kind: 'heading', text: 'Primeiro passo: recorte a automação' },
      {
        kind: 'steps',
        items: [
          'Escolha uma tarefa repetitiva pequena e use apenas dados fictícios.',
          'Defina a entrada: o que o programa receberia?',
          'Defina uma única transformação.',
          'Defina a saída e como você saberá que ela está correta.',
          'Escreva um exemplo manual. O ambiente e o primeiro código virão depois desse acordo.',
        ],
      },
      {
        kind: 'warning',
        text: 'Automatizar um processo confuso faz a confusão acontecer mais rápido. Primeiro estabilize a regra com um exemplo pequeno; só depois aumente o volume.',
      },
      { kind: 'heading', text: 'Fonte oficial para continuar a história' },
      {
        kind: 'list',
        items: [
          '[Documentação do Python — FAQ geral e origem da linguagem](https://docs.python.org/3/faq/general.html#why-was-python-created-in-the-first-place)',
        ],
      },
    ],
    reflection: [
      'Que parte da tarefa escolhida ainda depende de uma decisão humana?',
      'Que exemplo de entrada e saída permitiria conferir a automação sem risco?',
    ],
    checklist: [
      'Consigo contar a necessidade que levou à criação do Python.',
      'Defini entrada, transformação, saída e forma de conferência.',
      'Reduzi a automação a um caso pequeno e seguro.',
    ],
    recap: [
      'Python começou em 1989 a partir de uma necessidade prática no CWI.',
      'Guido van Rossum buscava clareza, extensibilidade e melhor acesso às tarefas do sistema.',
      'Uma automação segura começa pequena, com entrada e resultado verificáveis.',
    ],
  },

  'java-fundamentos-e-orientacao-a-objetos': {
    lessonTitle: 'Antes da primeira classe: de aparelhos conectados à portabilidade',
    summary:
      'Conheça a origem do Java, o problema da portabilidade e modele uma responsabilidade antes de criar classes.',
    topics: ['Oak e a origem do Java', 'Portabilidade', 'Responsabilidade antes da classe'],
    estimatedMinutes: 18,
    problem:
      'Java costuma chegar cercado de palavras grandes: classe, objeto, compilador e máquina virtual. A história ajuda a colocar cada coisa no lugar. A linguagem começou tentando executar software em aparelhos diferentes, não tentando assustar quem abre o primeiro arquivo.',
    outcome:
      'Ao terminar, você conseguirá contar como Oak se tornou Java, explicar a ideia de portabilidade e descrever uma responsabilidade antes de modelá-la como classe.',
    blocks: [
      { kind: 'heading', text: 'Antes da Web, aparelhos eletrônicos diferentes' },
      {
        kind: 'paragraph',
        text: 'A linguagem que se tornaria Java era chamada Oak. James Gosling a projetou para aplicações embarcadas em produtos eletrônicos de consumo. O desafio era escrever software para dispositivos com características diferentes sem reconstruir tudo para cada aparelho.',
      },
      {
        kind: 'paragraph',
        text: 'Com contribuições de muitas pessoas, o projeto foi redirecionado para a Internet, recebeu o nome Java e foi amplamente revisado. A especificação buscou reduzir dependências de implementação: o programa é compilado para um formato executado por uma máquina virtual compatível. É a base da promessa de escrever uma vez e executar em diferentes ambientes.',
      },
      { kind: 'heading', text: 'Qual problema Java resolve' },
      {
        kind: 'table',
        headers: ['Ideia', 'Problema enfrentado', 'Aplicação'],
        rows: [
          ['Máquina virtual', 'Ambientes diferentes', 'Executar o mesmo formato compilado'],
          ['Tipos explícitos', 'Contratos ambíguos', 'Detectar incompatibilidades'],
          ['Classes e objetos', 'Regras espalhadas', 'Agrupar dados e comportamentos'],
          ['Bibliotecas', 'Reinventar infraestrutura', 'Construir sobre componentes conhecidos'],
        ],
      },
      {
        kind: 'keyIdea',
        text: 'Orientação a objetos não começa pela palavra classe. Começa por reconhecer uma responsabilidade, os dados de que ela precisa e os comportamentos que deve proteger.',
      },
      { kind: 'heading', text: 'Primeiro passo sem IDE' },
      {
        kind: 'steps',
        items: [
          'Escolha uma entidade simples de um sistema, como um empréstimo de livro.',
          'Diga qual responsabilidade pertence a ela.',
          'Liste somente os dados necessários para cumprir essa responsabilidade.',
          'Nomeie duas ações e uma regra que não pode ser quebrada.',
          'Guarde o modelo em linguagem comum. A classe Java será uma tradução posterior.',
        ],
      },
      {
        kind: 'warning',
        text: 'Criar uma classe para cada substantivo produz estrutura sem propósito. Pergunte primeiro qual comportamento e qual regra justificam aquela abstração.',
      },
      { kind: 'heading', text: 'Fonte oficial para continuar a história' },
      {
        kind: 'list',
        items: [
          '[Oracle — Java Language Specification, prefácio histórico](https://docs.oracle.com/javase/specs/jls/se6/jls3.pdf)',
        ],
      },
    ],
    reflection: [
      'Que regra pertence à entidade escolhida e não deveria ficar espalhada pelo sistema?',
      'O que seria desnecessário colocar nessa primeira responsabilidade?',
    ],
    checklist: [
      'Consigo explicar como Oak se relaciona com Java.',
      'Entendo o papel geral da máquina virtual na portabilidade.',
      'Descrevi responsabilidade, dados, ações e regra antes da classe.',
    ],
    recap: [
      'Java começou como Oak, projetada por James Gosling para eletrônicos de consumo.',
      'O projeto foi redirecionado à Internet e buscou portabilidade entre implementações.',
      'Uma boa classe nasce de responsabilidade e regras, não de cerimônia.',
    ],
  },
};

export function getCourseIntroduction(courseSlug: string): CourseIntroduction {
  const introduction = COURSE_INTRODUCTIONS[courseSlug];
  if (!introduction) {
    throw new Error(`Curso sem aula introdutória autoral: ${courseSlug}.`);
  }
  return introduction;
}

/** Conteúdo estruturado usado pelos cursos administrativos e pelo módulo gratuito. */
export function administrativeIntroductionContent(courseSlug: string): LessonContent {
  const introduction = getCourseIntroduction(courseSlug);

  return {
    blocks: [
      { kind: 'paragraph', text: introduction.problem },
      {
        kind: 'keyIdea',
        text: `Ao terminar esta aula, você será capaz de: ${introduction.outcome}`,
      },
      ...introduction.blocks,
      { kind: 'heading', text: 'Pare e pense' },
      { kind: 'list', items: introduction.reflection },
    ],
    checklist: introduction.checklist,
    summary: introduction.recap,
    reference: {
      sourceType: 'ORIGINAL',
      module: 'RomaLearn',
      chapter: introduction.lessonTitle,
      pages: 'material original com fontes oficiais indicadas na aula',
    },
  };
}

/** Conteúdo no contrato autoral dos seis cursos técnicos. */
export function technologyIntroductionContent(courseSlug: string): TechLessonContent {
  const introduction = getCourseIntroduction(courseSlug);

  return {
    problem: introduction.problem,
    outcome: introduction.outcome,
    blocks: introduction.blocks,
    reflection: introduction.reflection,
    checklist: introduction.checklist,
  };
}
