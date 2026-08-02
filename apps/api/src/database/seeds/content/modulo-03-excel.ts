import { ActivityAttachmentPolicyDto, LessonType, QuestionType } from '@romalearn/contracts';
import type { SeedLesson, SeedQuestion } from '../catalog-data';
import type { SectionEnrichment } from './apply-content';
import { ActivityExample, ActivityRubric, LessonContent } from './content-types';

/**
 * Módulo 3 — Microsoft Excel para Administração.
 *
 * Conteúdo extraído do e-book oficial (Edição 2026, 31 páginas). A rubrica do
 * projeto final reproduz a tabela de critérios (páginas 27–28) e as falhas
 * críticas listadas nas regras do projeto (página 26).
 */

const EBOOK = 'Módulo 3';

/** Falhas críticas transcritas das regras do projeto final (página 26). */
const FALHAS_CRITICAS = [
  'Cálculo errado que passou sem ser identificado na conferência.',
  'Registro perdido durante classificação, filtro ou exclusão.',
  'Fórmula substituída por um valor digitado à mão.',
  'Dado real de cliente, colega ou fornecedor exposto em vez de dados fictícios.',
  'Macro de origem desconhecida habilitada.',
];

const CAP_1: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Capítulo 1 — O Excel como caderno inteligente',
    pages: '5–6',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Conheça a tela do Excel e aprenda a registrar informações sem medo de errar.',
    },
    { kind: 'heading', text: 'O que o Excel faz' },
    {
      kind: 'paragraph',
      text: 'O Excel ajuda a guardar informações em uma grade, fazer contas e responder perguntas. Ele pode controlar materiais, prazos, despesas, presença, pedidos e muitas outras rotinas. Você não precisa decorar todos os botões: o mais importante é entender onde a informação está e o que deseja descobrir com ela.',
    },
    {
      kind: 'analogy',
      text: 'Imagine um caderno quadriculado que sabe fazer contas. Quando você troca um número, ele pode recalcular os resultados automaticamente.',
    },
    { kind: 'heading', text: 'As peças da tela' },
    {
      kind: 'table',
      headers: ['Nome', 'Explicação fácil', 'Exemplo'],
      rows: [
        ['Pasta de trabalho', 'O arquivo inteiro do Excel.', 'Controle_Compras.xlsx'],
        ['Planilha', 'Uma aba dentro do arquivo.', 'Pedidos, Cadastro, Resumo'],
        ['Coluna', 'Faixa vertical identificada por letra.', 'Coluna C'],
        ['Linha', 'Faixa horizontal identificada por número.', 'Linha 7'],
        ['Célula', 'Encontro de uma coluna com uma linha.', 'C7'],
        ['Intervalo', 'Grupo de células.', 'A2:D10'],
      ],
    },
    {
      kind: 'warning',
      text: 'A extensão mais comum é .xlsx. Um arquivo .xls é mais antigo, e um .csv guarda dados simples, mas pode perder fórmulas, cores e várias planilhas.',
    },
    { kind: 'heading', text: 'Crie sua primeira lista' },
    {
      kind: 'analogy',
      text: 'Cada linha é uma ficha. As colunas são os campos da ficha, como Item, Quantidade e Setor.',
    },
    {
      kind: 'steps',
      items: [
        'Abra o Excel e escolha Pasta de trabalho em branco.',
        'Clique em A1 e escreva Item.',
        'Pressione Tab e escreva Quantidade em B1.',
        'Pressione Tab e escreva Setor em C1.',
        'Na linha 2, preencha um registro fictício.',
        'Use Enter para criar mais quatro registros.',
        'Dê duplo clique no nome da aba e troque para Materiais.',
        'Salve como Controle_Materiais_2026-07.xlsx.',
      ],
    },
    { kind: 'heading', text: 'Texto, número e data não são a mesma coisa' },
    {
      kind: 'list',
      items: [
        'Texto identifica pessoas, setores, produtos e observações.',
        'Número pode participar de contas.',
        'Data representa um dia real e pode ser ordenada ou comparada.',
        'Porcentagem representa uma parte de cem.',
        'Fórmula é uma instrução iniciada por =.',
      ],
    },
    {
      kind: 'warning',
      text: 'Não escreva R$ junto com o número e não use frases como "semana que vem" em uma coluna de datas. Digite o valor e aplique o formato correto.',
    },
    {
      kind: 'keyIdea',
      text: 'Você dominou o capítulo quando consegue explicar célula, intervalo, planilha e pasta de trabalho com suas palavras.',
    },
  ],
  summary: [
    'A pasta de trabalho é o arquivo; cada planilha é uma aba dentro dele.',
    'A célula é o encontro de uma coluna com uma linha, como B4.',
    'Uma base organizada usa uma linha por registro e uma coluna por tipo de informação.',
  ],
};

const CAP_2: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Capítulo 2 — Formatação e contas que se atualizam',
    pages: '7–8',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Dê significado aos números e crie fórmulas simples que recalculam sozinhas.',
    },
    { kind: 'heading', text: 'Valor e aparência' },
    {
      kind: 'paragraph',
      text: 'Uma célula pode guardar o número 0,15 e mostrar 15%. O conteúdo não mudou; apenas a forma de exibir ficou mais clara. Use formatos de Número, Moeda, Porcentagem e Data para comunicar o significado. Evite usar cor ou símbolo digitado como substituto do formato.',
    },
    {
      kind: 'analogy',
      text: 'O valor é a pessoa; o formato é a roupa. A roupa muda a apresentação, mas não transforma quem está por dentro.',
    },
    { kind: 'heading', text: 'As quatro operações' },
    {
      kind: 'warning',
      text: 'Toda fórmula começa com =. Se o Excel mostrar a fórmula como texto, confira o sinal de igual e o formato da célula.',
    },
    {
      kind: 'table',
      headers: ['Operação', 'Sinal', 'Exemplo'],
      rows: [
        ['Somar', '+', '=B2+C2'],
        ['Subtrair', '-', '=B2-C2'],
        ['Multiplicar', '*', '=B2*C2'],
        ['Dividir', '/', '=B2/C2'],
      ],
    },
    { kind: 'heading', text: 'Monte um controle de compras' },
    {
      kind: 'analogy',
      text: 'A fórmula é uma receita. B2 e C2 são os ingredientes. Quando um ingrediente muda, o Excel refaz a conta.',
    },
    {
      kind: 'steps',
      items: [
        'Crie as colunas Item, Quantidade, Preço unitário e Total.',
        'Digite cinco itens fictícios.',
        'Formate Preço unitário e Total como Moeda.',
        'Em D2, digite =B2*C2 e pressione Enter.',
        'Use a alça de preenchimento para copiar a fórmula para baixo.',
        'Abaixo da lista, digite =SOMA(D2:D6).',
        'Altere uma quantidade e veja o resultado mudar.',
        'Confira a primeira, uma linha do meio e a última fórmula.',
      ],
    },
    { kind: 'heading', text: 'Funções básicas' },
    {
      kind: 'table',
      headers: ['Pergunta', 'Fórmula de exemplo'],
      rows: [
        ['Qual é o total?', '=SOMA(D2:D10)'],
        ['Qual é a média?', '=MÉDIA(D2:D10)'],
        ['Qual é o menor valor?', '=MÍNIMO(D2:D10)'],
        ['Qual é o maior valor?', '=MÁXIMO(D2:D10)'],
      ],
    },
    { kind: 'heading', text: 'Erros que ensinam' },
    {
      kind: 'warning',
      text: 'Não apague o erro sem entender a causa. O aviso é uma pista que ajuda a encontrar o problema.',
    },
    {
      kind: 'list',
      items: [
        '#DIV/0!: a fórmula tentou dividir por zero ou por uma célula vazia.',
        '#####: a coluna está estreita demais para mostrar o valor; aumente a largura.',
        'Número parado: talvez a fórmula tenha sido substituída por um valor digitado.',
        'Resultado estranho: confira se números foram armazenados como texto.',
      ],
    },
    {
      kind: 'keyIdea',
      text: 'Você dominou o capítulo quando consegue criar e copiar uma fórmula sem substituir as referências por números fixos.',
    },
  ],
  summary: [
    'O valor guardado e a aparência mostrada pela célula são coisas diferentes.',
    'Toda fórmula começa com o sinal de igual.',
    'Use referências de células para que os resultados mudem junto com os dados.',
  ],
};

const CAP_3: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Capítulo 3 — Tabelas, classificação, filtros e PDF',
    pages: '9–10',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Organize listas, encontre o que importa e prepare uma entrega sem colunas cortadas.',
    },
    { kind: 'heading', text: 'Transforme a lista em Tabela' },
    {
      kind: 'paragraph',
      text: 'Uma Tabela do Excel é mais que uma grade colorida. Ela reconhece os cabeçalhos, acrescenta filtros e costuma expandir quando novos registros são incluídos.',
    },
    {
      kind: 'analogy',
      text: 'Uma Tabela é como um arquivo de fichas que já vem com etiquetas e uma lupa para pesquisa.',
    },
    {
      kind: 'steps',
      items: [
        'Clique em qualquer célula da lista.',
        'Acesse Página Inicial e escolha Formatar como Tabela.',
        'Escolha um estilo simples.',
        'Confirme que "Minha tabela tem cabeçalhos" está marcado.',
        'Dê um nome curto e claro à Tabela, como Pedidos.',
      ],
    },
    { kind: 'heading', text: 'Classificar e filtrar' },
    {
      kind: 'table',
      headers: ['Ação', 'O que acontece', 'Exemplo'],
      rows: [
        ['Classificar', 'Os registros mudam de ordem.', 'Data mais antiga para mais recente'],
        ['Filtrar', 'Só alguns registros ficam visíveis.', 'Mostrar apenas Status Pendente'],
        ['Limpar filtro', 'Todos os registros voltam a aparecer.', 'Mostrar tudo novamente'],
      ],
    },
    {
      kind: 'warning',
      text: 'Filtrar não apaga dados. Porém, excluir linhas enquanto existe um filtro pode remover registros. Confira o ícone do filtro antes de excluir qualquer coisa.',
    },
    { kind: 'heading', text: 'Cabeçalho sempre visível' },
    {
      kind: 'steps',
      items: [
        'Clique em Exibir.',
        'Escolha Congelar Painéis.',
        'Selecione Congelar Linha Superior.',
        'Role a lista e confirme que os nomes das colunas continuam visíveis.',
      ],
    },
    { kind: 'heading', text: 'Preparar impressão e PDF' },
    {
      kind: 'warning',
      text: 'O PDF preserva o visual, mas não substitui a planilha editável. Guarde o XLSX como fonte e distribua o PDF quando a pessoa só precisa ler.',
    },
    {
      kind: 'keyIdea',
      text: 'Você dominou o capítulo quando consegue limpar o filtro e recuperar a visão completa sem perder registros.',
    },
  ],
  checklist: [
    'O filtro correto está ativo, ou todos os dados devem aparecer.',
    'A orientação Retrato ou Paisagem combina com a largura da tabela.',
    'Nenhuma coluna foi cortada em outra página.',
    'Títulos e cabeçalhos são legíveis.',
    'O número e a ordem das páginas estão corretos.',
    'O PDF foi aberto e conferido após a exportação.',
  ],
  summary: [
    'Tabela do Excel acrescenta cabeçalhos, filtros e expansão automática.',
    'Classificar muda a ordem; filtrar apenas esconde temporariamente alguns registros.',
    'Abra e confira o PDF depois da exportação.',
  ],
};

const CAP_4: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Capítulo 4 — Dados limpos e alertas visuais',
    pages: '12–13',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Prepare uma base confiável e use regras visuais para encontrar prazos e problemas.',
    },
    { kind: 'heading', text: 'Uma boa análise começa antes da fórmula' },
    {
      kind: 'paragraph',
      text: 'Se a base mistura datas, textos e números, até uma fórmula correta pode produzir uma resposta ruim. Antes de analisar, organize o modo como os dados entram.',
    },
    {
      kind: 'analogy',
      text: 'Uma gaveta com etiquetas erradas dificulta qualquer busca. O mesmo acontece quando uma coluna chamada Data contém datas, frases e espaços vazios sem explicação.',
    },
    { kind: 'heading', text: 'Vazio, zero e não se aplica' },
    {
      kind: 'table',
      headers: ['Situação', 'Significado possível', 'Boa prática'],
      rows: [
        ['Célula vazia', 'Ainda não informado ou desconhecido.', 'Defina o significado do vazio.'],
        ['Zero', 'Valor conhecido igual a zero.', 'Use quando zero for um dado real.'],
        [
          'Não se aplica',
          'O campo não pertence ao caso.',
          'Use um rótulo padronizado em coluna de texto.',
        ],
      ],
    },
    { kind: 'heading', text: 'Formatação condicional como alerta' },
    {
      kind: 'warning',
      text: 'Poucas regras claras ajudam mais que muitas cores. Formatação condicional muda a aparência, não o valor e nem o status real do processo.',
    },
    {
      kind: 'steps',
      items: [
        'Selecione a coluna que receberá a regra.',
        'Acesse Página Inicial e Formatação Condicional.',
        'Escolha uma regra simples, como valor maior que um limite ou data vencida.',
        'Defina um formato legível.',
        'Abra Gerenciar Regras e confira o intervalo "Aplica-se a".',
        'Teste a regra com um valor fictício que deve disparar o alerta.',
        'Adicione um texto de status para não depender apenas da cor.',
      ],
    },
    {
      kind: 'keyIdea',
      text: 'Você dominou o capítulo quando consegue explicar por que uma base limpa é parte do cálculo.',
    },
  ],
  checklist: [
    'Existe uma única linha de cabeçalhos claros.',
    'Cada linha representa um registro completo.',
    'Cada coluna representa uma característica.',
    'Não existem linhas ou colunas vazias no meio da base.',
    'Não há células mescladas dentro da área de dados.',
    'Datas são datas, valores são números e códigos seguem o mesmo padrão.',
    'Subtotais e observações ficam fora da base principal.',
    'Um identificador único existe quando o processo precisa distinguir registros.',
  ],
  summary: [
    'Cada coluna deve manter um único tipo de dado.',
    'Vazio, zero e não se aplica têm significados diferentes.',
    'Formatação condicional chama atenção, mas não corrige o dado.',
  ],
};

const CAP_5: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Capítulo 5 — Referências e funções por critérios',
    pages: '14–15',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Faça somas, contagens e decisões com regras claras e fórmulas copiáveis.',
    },
    { kind: 'heading', text: 'Referências que mudam e referências que ficam' },
    {
      kind: 'analogy',
      text: 'Referência relativa é uma instrução como "duas casas à direita". Referência absoluta é um endereço completo que continua igual.',
    },
    {
      kind: 'table',
      headers: ['Tipo', 'Exemplo', 'Ao copiar'],
      rows: [
        ['Relativa', 'A2', 'Linha e coluna podem mudar.'],
        ['Absoluta', '$A$2', 'Linha e coluna ficam fixas.'],
        ['Mista', '$A2 ou A$2', 'Só coluna ou linha fica fixa.'],
      ],
    },
    { kind: 'heading', text: 'Fixe uma taxa com F4' },
    {
      kind: 'steps',
      items: [
        'Digite uma taxa fictícia em H1.',
        'Na primeira linha de cálculo, escreva =C2*$H$1.',
        'Enquanto edita H1, use F4 para alternar os tipos de referência.',
        'Copie a fórmula para baixo.',
        'Confirme que C2 virou C3, C4 e assim por diante, mas $H$1 continuou igual.',
      ],
    },
    { kind: 'heading', text: 'Escolha a função pela pergunta' },
    {
      kind: 'table',
      headers: ['Pergunta', 'Função', 'Exemplo'],
      rows: [
        ['Se acontecer, o que mostrar?', 'SE', '=SE(E2="Concluído";"OK";"Acompanhar")'],
        ['Quanto somou para um critério?', 'SOMASE', '=SOMASE(C2:C100;"Financeiro";F2:F100)'],
        [
          'Quanto somou para vários critérios?',
          'SOMASES',
          '=SOMASES(F2:F100;C2:C100;"Financeiro";E2:E100;"Aprovado")',
        ],
        ['Quantos atendem a um critério?', 'CONT.SE', '=CONT.SE(E2:E100;"Pendente")'],
        [
          'Quantos atendem a vários critérios?',
          'CONT.SES',
          '=CONT.SES(C2:C100;"Compras";E2:E100;"Pendente")',
        ],
      ],
    },
    {
      kind: 'warning',
      text: 'Em algumas instalações, os argumentos usam vírgula em vez de ponto e vírgula. Os nomes das funções também mudam conforme o idioma do Excel.',
    },
    { kind: 'heading', text: 'SEERRO com responsabilidade' },
    {
      kind: 'paragraph',
      text: 'SEERRO pode trocar um erro por uma mensagem planejada, como =SEERRO(B2/C2;"Verificar quantidade"). Use uma mensagem que ajude a investigar. Evite transformar todo erro em zero: um zero falso pode parecer um resultado válido e esconder um problema de cadastro ou fórmula.',
    },
    {
      kind: 'keyIdea',
      text: 'Confira uma linha do início, uma do meio e a última antes de aceitar o resultado.',
    },
  ],
  summary: [
    'Referência relativa muda ao copiar; referência absoluta permanece fixa.',
    'SE decide, SOMASES soma por regras e CONT.SES conta por regras.',
    'SEERRO deve melhorar a mensagem, não esconder um problema desconhecido.',
  ],
};

const CAP_6: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Capítulo 6 — Gráficos e indicadores que contam uma história',
    pages: '16–17',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Transforme resultados em mensagens visuais claras para reuniões e relatórios.',
    },
    { kind: 'heading', text: 'Comece pela pergunta' },
    {
      kind: 'table',
      headers: ['Pergunta', 'Gráfico indicado', 'Exemplo'],
      rows: [
        ['Como categorias se comparam?', 'Colunas ou barras', 'Solicitações por setor'],
        ['Como mudou ao longo do tempo?', 'Linhas', 'Despesas por mês'],
        ['Como poucas partes formam o total?', 'Pizza', 'Três tipos de gasto'],
      ],
    },
    {
      kind: 'warning',
      text: 'Pizza com muitas categorias fica difícil de ler. Para várias categorias, prefira barras ordenadas.',
    },
    { kind: 'heading', text: 'Crie um gráfico mensal' },
    {
      kind: 'analogy',
      text: 'A base é o estoque de informações. O gráfico é a vitrine: mostra o essencial, mas não deve inventar nem esconder o que existe.',
    },
    {
      kind: 'steps',
      items: [
        'Monte um resumo com Mês e Total.',
        'Selecione o resumo incluindo os cabeçalhos.',
        'Acesse Inserir e Gráficos Recomendados.',
        'Visualize as opções e escolha Linha para evolução no tempo.',
        'Troque o título por algo específico, como "Despesas administrativas — janeiro a junho de 2026".',
        'Confira unidade, período e origem dos valores.',
        'Remova elementos que não ajudam.',
        'Altere um valor fictício e confirme que o gráfico acompanha.',
      ],
    },
    { kind: 'heading', text: 'Indicadores simples' },
    {
      kind: 'paragraph',
      text: 'Um indicador é um número de destaque ligado a uma pergunta, como Total aprovado, Pedidos pendentes ou Percentual concluído. Coloque o nome, o valor e o período juntos. Evite um painel cheio de números sem contexto: três indicadores bem escolhidos podem comunicar melhor que quinze cartões coloridos.',
    },
    {
      kind: 'keyIdea',
      text: 'Você dominou o capítulo quando consegue justificar por que escolheu aquele tipo de gráfico.',
    },
  ],
  checklist: [
    'Existe título claro, período e unidade.',
    'A conclusão principal também aparece em texto.',
    'O gráfico não depende somente de vermelho e verde.',
    'O contraste permite leitura confortável.',
    'Efeitos 3D foram evitados.',
    'O eixo não foi cortado para exagerar diferenças.',
    'O arquivo passou por Revisão > Verificar Acessibilidade.',
  ],
  summary: [
    'Escolha o gráfico a partir da pergunta que precisa responder.',
    'Título, período, unidade e conclusão ajudam o leitor a interpretar.',
    'Não dependa apenas de cores e evite efeitos que distorçam a comparação.',
  ],
};

const CAP_7: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Capítulo 7 — Buscas e listas que se atualizam',
    pages: '19–20',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Relacione cadastros por código e crie listas que mudam conforme um critério.',
    },
    { kind: 'heading', text: 'O que é uma chave de busca' },
    {
      kind: 'paragraph',
      text: 'Uma chave é um valor que identifica o registro, como Código do fornecedor ou ID da solicitação. Para uma busca confiável, ela deve estar preenchida, seguir o mesmo formato e ser única quando o processo exige um único resultado.',
    },
    {
      kind: 'analogy',
      text: 'PROCX é um atendente de arquivo: recebe o número do protocolo, procura na lista correta e devolve a informação pedida.',
    },
    { kind: 'heading', text: 'PROCX passo a passo' },
    {
      kind: 'steps',
      items: [
        'Transforme o cadastro e a base de pedidos em Tabelas.',
        'Confirme que a coluna Código não tem espaços ou duplicidades.',
        'Na base de pedidos, crie a coluna Fornecedor.',
        'Digite =PROCX(A2;Cadastro[Código];Cadastro[Fornecedor];"Não encontrado").',
        'Teste um código conhecido.',
        'Teste um código inexistente.',
        'Confira amostras do início, meio e fim.',
      ],
    },
    {
      kind: 'warning',
      text: '"Não encontrado" é um aviso útil, mas não resolve o problema. Descubra se o código falta, está duplicado ou foi digitado em outro formato.',
    },
    { kind: 'heading', text: 'Quando aparece PROCV' },
    {
      kind: 'paragraph',
      text: 'PROCV ainda existe em muitos arquivos antigos. Ele procura na primeira coluna do intervalo e devolve uma coluna à direita. Em Excel para Microsoft 365 e Excel 2024, prefira PROCX quando disponível, porque a busca e o retorno ficam mais explícitos.',
    },
    { kind: 'heading', text: 'Crie uma lista dinâmica' },
    {
      kind: 'paragraph',
      text: 'FILTRO pode devolver apenas as linhas que atendem a uma regra. CLASSIFICAR pode ordenar o resultado sem mexer na base original.',
    },
    {
      kind: 'list',
      items: [
        '=FILTRO(Pedidos;Pedidos[Status]="Pendente";"Nenhum pedido")',
        '=CLASSIFICAR(FILTRO(Pedidos;Pedidos[Status]="Pendente";"Nenhum pedido");3;1)',
        'Deixe espaço livre abaixo e ao lado para o resultado se expandir.',
        'Se aparecer #DESPEJAR!, verifique se alguma célula está bloqueando a área de saída.',
      ],
    },
    {
      kind: 'keyIdea',
      text: 'Teste código válido, inválido e duplicado antes de aceitar o resultado.',
    },
  ],
  summary: [
    'Uma busca confiável começa por uma chave única e limpa.',
    'PROCX procura a chave e devolve a informação correspondente.',
    'FILTRO e CLASSIFICAR criam visões dinâmicas sem reorganizar a base original.',
  ],
};

const CAP_8: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Capítulo 8 — Tabelas Dinâmicas e segmentações',
    pages: '21–22',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Resuma muitas linhas arrastando campos e filtre a análise com botões.',
    },
    { kind: 'heading', text: 'O que a Tabela Dinâmica faz' },
    {
      kind: 'paragraph',
      text: 'Uma Tabela Dinâmica resume muitas linhas sem alterar a base original. Você pode reorganizar campos para responder perguntas diferentes.',
    },
    {
      kind: 'analogy',
      text: 'É como uma caixa de peças. Você reorganiza as mesmas peças em grupos diferentes sem mudar o estoque de origem.',
    },
    { kind: 'heading', text: 'Quatro áreas importantes' },
    {
      kind: 'table',
      headers: ['Área', 'Função', 'Exemplo'],
      rows: [
        ['Linhas', 'Organiza categorias verticalmente.', 'Setor'],
        ['Colunas', 'Cria subdivisões horizontais.', 'Mês'],
        ['Valores', 'Faz soma, contagem ou média.', 'Soma de Valor'],
        ['Filtros', 'Limita o relatório inteiro.', 'Status Aprovado'],
      ],
    },
    { kind: 'heading', text: 'Crie um resumo por setor' },
    {
      kind: 'steps',
      items: [
        'Confira se a base tem cabeçalhos e um registro por linha.',
        'Clique em uma célula da Tabela de origem.',
        'Acesse Inserir e Tabela Dinâmica.',
        'Escolha Nova Planilha.',
        'Arraste Setor para Linhas.',
        'Arraste Valor para Valores.',
        'Confirme que aparece Soma de Valor, não Contagem de Valor.',
        'Formate os valores como moeda.',
        'Compare o Total Geral com a base original.',
      ],
    },
    {
      kind: 'warning',
      text: 'Se o Excel contar em vez de somar, a coluna pode ter números armazenados como texto ou células com conteúdo inconsistente.',
    },
    { kind: 'heading', text: 'Segmentações e atualização' },
    {
      kind: 'steps',
      items: [
        'Clique dentro da Tabela Dinâmica.',
        'Insira uma Segmentação para Status.',
        'Clique nos botões para filtrar.',
        'Altere um valor fictício na origem.',
        'Volte à Tabela Dinâmica e escolha Atualizar.',
        'Confira o novo total.',
      ],
    },
    {
      kind: 'warning',
      text: 'A Tabela Dinâmica não adivinha que a origem mudou. Atualize antes de apresentar ou exportar.',
    },
    {
      kind: 'keyIdea',
      text: 'Você dominou o capítulo quando consegue explicar por que o Total Geral confere com a origem.',
    },
  ],
  summary: [
    'Linhas e colunas organizam categorias; Valores fazem o resumo.',
    'Confira se o Excel está somando ou apenas contando.',
    'Depois de alterar a origem, atualize a Tabela Dinâmica.',
  ],
};

const CAP_9: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Capítulo 9 — Validação, proteção e revisão final',
    pages: '23–25',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Controle entradas, reduza alterações acidentais e revise o arquivo antes de compartilhar.',
    },
    { kind: 'heading', text: 'Três tipos de controle' },
    {
      kind: 'table',
      headers: ['Recurso', 'O que faz', 'O que não faz'],
      rows: [
        [
          'Validação de dados',
          'Limita entradas e cria listas.',
          'Não corrige dados antigos automaticamente.',
        ],
        [
          'Proteção de planilha',
          'Controla células que podem ser editadas.',
          'Não impede a leitura do arquivo.',
        ],
        ['Proteção da pasta', 'Protege a estrutura das abas.', 'Não substitui criptografia.'],
        [
          'Criptografia do arquivo',
          'Exige senha para abrir.',
          'Não substitui política de acesso e cópia segura.',
        ],
      ],
    },
    { kind: 'heading', text: 'Crie uma lista suspensa' },
    {
      kind: 'analogy',
      text: 'A validação é uma catraca: aceita entradas previstas e avisa quando algo não segue a regra.',
    },
    {
      kind: 'steps',
      items: [
        'Crie uma pequena Tabela com Pendente, Em análise e Concluído.',
        'Selecione as células da coluna Status.',
        'Acesse Dados e Validação de Dados.',
        'Em Permitir, escolha Lista.',
        'Selecione a origem das opções.',
        'Configure uma mensagem de entrada e um alerta de erro.',
        'Teste uma opção válida e outra inválida.',
      ],
    },
    { kind: 'heading', text: 'Proteja sem bloquear o trabalho' },
    {
      kind: 'steps',
      items: [
        'Faça uma cópia do arquivo.',
        'Identifique as células que o usuário precisa preencher.',
        'Desbloqueie somente essas células.',
        'Acesse Revisão e Proteger Planilha.',
        'Escolha as ações permitidas.',
        'Teste como se fosse outra pessoa preenchendo.',
        'Guarde a senha em local autorizado.',
      ],
    },
    {
      kind: 'warning',
      text: 'Proteção reduz alterações acidentais. Para dados sensíveis, use permissões, canais autorizados e as políticas da organização.',
    },
    { kind: 'heading', text: 'Inspeção, acessibilidade e macros' },
    {
      kind: 'list',
      items: [
        'Use Revisão > Verificar Acessibilidade.',
        'Use o Inspetor de Documento em uma cópia, pois algumas remoções não podem ser desfeitas.',
        'Confira planilhas, linhas e colunas ocultas antes de remover qualquer conteúdo.',
        'Não habilite macros de arquivos desconhecidos. Macros podem executar código.',
        'Abra o XLSX e o PDF finais para uma última conferência.',
      ],
    },
    {
      kind: 'warning',
      text: 'Se uma mensagem pedir urgência, senha, código ou "Ativar Conteúdo" sem contexto, pare e confirme com o responsável ou suporte.',
    },
    {
      kind: 'keyIdea',
      text: 'Você dominou o capítulo quando diferencia validação, proteção e criptografia.',
    },
  ],
  checklist: [
    'A pasta foi recalculada e não apresenta erros inesperados.',
    'Fórmulas críticas foram comparadas com amostras manuais.',
    'Rastrear Precedentes e Dependentes foi usado quando necessário.',
    'Não existem referências circulares inesperadas.',
    'Tabelas Dinâmicas e consultas foram atualizadas.',
    'Filtros foram limpos ou identificados.',
    'Totais conferem com a base de origem.',
  ],
  summary: [
    'Validação limita entradas; proteção controla edição; criptografia controla abertura.',
    'Proteção de planilha não substitui permissões e controle de acesso.',
    'Audite fórmulas, filtros, dados ocultos, acessibilidade e segurança antes do envio.',
  ],
};

const GUIA_RAPIDO: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Guia de consulta rápida e Referências oficiais',
    pages: '29–31',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Use esta seção para relembrar conceitos. Volte aos capítulos quando precisar compreender o motivo ou o passo a passo completo.',
    },
    { kind: 'heading', text: 'Fórmulas essenciais' },
    {
      kind: 'table',
      headers: ['Necessidade', 'Exemplo'],
      rows: [
        ['Somar um intervalo', '=SOMA(D2:D10)'],
        ['Média de um intervalo', '=MÉDIA(D2:D10)'],
        ['Decidir entre dois resultados', '=SE(E2="Concluído";"OK";"Acompanhar")'],
        ['Somar por vários critérios', '=SOMASES(F2:F100;C2:C100;"Financeiro";E2:E100;"Aprovado")'],
        ['Contar por vários critérios', '=CONT.SES(C2:C100;"Compras";E2:E100;"Pendente")'],
        ['Buscar por chave', '=PROCX(A2;Cadastro[Código];Cadastro[Fornecedor];"Não encontrado")'],
        ['Listar por regra', '=FILTRO(Pedidos;Pedidos[Status]="Pendente";"Nenhum pedido")'],
        ['Tratar erro com mensagem útil', '=SEERRO(B2/C2;"Verificar quantidade")'],
      ],
    },
    { kind: 'heading', text: 'Antes de entregar' },
    {
      kind: 'list',
      items: [
        'A base tem uma linha por registro e uma coluna por característica.',
        'As fórmulas continuam sendo fórmulas, não valores digitados.',
        'Os filtros foram limpos ou estão identificados.',
        'As Tabelas Dinâmicas foram atualizadas.',
        'O gráfico tem título, período, unidade e conclusão em texto.',
        'O XLSX é a fonte e o PDF é a cópia de leitura, ambos conferidos.',
      ],
    },
    { kind: 'heading', text: 'Referências oficiais' },
    {
      kind: 'paragraph',
      text: 'Os procedimentos deste módulo foram conferidos com a documentação da Microsoft. Nomes de funções e separadores podem variar conforme o idioma e a versão instalada. Os endereços completos estão nas últimas páginas do e-book, em "Materiais de apoio".',
    },
  ],
};

/**
 * Rubrica do projeto final: critérios e pesos transcritos da tabela de
 * avaliação (páginas 27–28). O e-book fixa o corte em 70% e descreve a faixa
 * 70–89% como "Funcional: conclui com consultas pontuais e sem falha crítica".
 */
const RUBRICA_PROJETO_FINAL: ActivityRubric = {
  passingScore: 70,
  minWords: 250,
  criticalFailures: FALHAS_CRITICAS,
  criteria: [
    {
      id: 'estrutura-e-dados',
      title: 'Estrutura e dados',
      weight: 15,
      whatToObserve: 'Base limpa, registros completos e as abas Solicitações, Cadastros e Resumo.',
    },
    {
      id: 'formulas-basicas',
      title: 'Fórmulas básicas',
      weight: 15,
      whatToObserve: 'Totais por linha e total geral corretos, com as fórmulas preservadas.',
    },
    {
      id: 'organizacao-e-filtros',
      title: 'Organização e filtros',
      weight: 10,
      whatToObserve: 'Tabela criada, classificação, filtros conferidos e cabeçalho congelado.',
    },
    {
      id: 'funcoes-intermediarias',
      title: 'Funções intermediárias',
      weight: 15,
      whatToObserve: 'SOMASES, CONT.SES e SE com critérios e referências corretos.',
    },
    {
      id: 'visualizacao',
      title: 'Visualização',
      weight: 10,
      whatToObserve: 'Gráfico claro e acessível, com título, unidade e conclusão em texto.',
    },
    {
      id: 'busca-e-analise',
      title: 'Busca e análise',
      weight: 15,
      whatToObserve: 'PROCX e Tabela Dinâmica validados, com Total Geral conferindo com a origem.',
    },
    {
      id: 'validacao-e-protecao',
      title: 'Validação e proteção',
      weight: 10,
      whatToObserve: 'Entradas controladas por validação e fórmulas protegidas.',
    },
    {
      id: 'entrega',
      title: 'Entrega',
      weight: 10,
      whatToObserve: 'XLSX, PDF e checklist revisados.',
    },
  ],
};

const CONTEUDO: Record<string, LessonContent> = {
  'Capítulo 1 — O Excel como caderno inteligente': CAP_1,
  'Capítulo 2 — Formatação e contas que se atualizam': CAP_2,
  'Capítulo 3 — Tabelas, classificação, filtros e PDF': CAP_3,
  'Capítulo 4 — Dados limpos e alertas visuais': CAP_4,
  'Capítulo 5 — Referências e funções por critérios': CAP_5,
  'Capítulo 6 — Gráficos e indicadores que contam uma história': CAP_6,
  'Capítulo 7 — Buscas e listas que se atualizam': CAP_7,
  'Capítulo 8 — Tabelas Dinâmicas e segmentações': CAP_8,
  'Capítulo 9 — Validação, proteção e revisão final': CAP_9,
  'Guia de consulta rápida e referências oficiais': GUIA_RAPIDO,
};

const RUBRICAS: Record<string, Pick<SeedLesson, 'rubric' | 'rubricReference'>> = {
  'Projeto final integrado': {
    rubric: RUBRICA_PROJETO_FINAL,
    rubricReference: {
      module: EBOOK,
      chapter: 'Projeto final integrado — Regras e Avaliação',
      pages: '26–28',
    },
  },
};

/** Uma pergunta de múltipla escolha simples. */
const QUESTAO = (
  statement: string,
  explanation: string,
  options: [string, boolean][],
): SeedQuestion => ({
  statement,
  type: QuestionType.SINGLE_CHOICE,
  explanation,
  options: options.map(([text, isCorrect]) => ({ text, isCorrect })),
});

/** Questionário curto de fixação, ao fim de uma parte. */
const FIXACAO = (titulo: string, questions: SeedQuestion[]): SeedLesson => ({
  title: titulo,
  type: LessonType.QUIZ,
  estimatedMinutes: 8,
  passingScore: 70,
  summary: 'Confira o que ficou desta parte antes de avançar. Tentativas ilimitadas.',
  questions,
});

const QUESTIONARIOS: Record<string, SeedLesson> = {
  'Parte 1 — Excel Iniciante': FIXACAO('Fixação — Excel Iniciante', [
    QUESTAO(
      'O que é a célula C7?',
      'A célula é o encontro de uma coluna com uma linha: coluna C, linha 7.',
      [
        ['O encontro da coluna C com a linha 7.', true],
        ['A sétima aba da pasta de trabalho.', false],
        ['Um intervalo com sete células.', false],
        ['Uma fórmula que soma sete valores.', false],
      ],
    ),
    QUESTAO(
      'Você precisa registrar o valor de R$ 1.250,00 em uma coluna de preços. O que fazer?',
      'Digite o número e aplique o formato Moeda. Escrever R$ junto transforma o valor em texto.',
      [
        ['Digitar 1250 e aplicar o formato Moeda.', true],
        ['Digitar R$ 1.250,00 na célula.', false],
        ['Digitar 1250 e pintar a célula de verde.', false],
        ['Digitar 1250 como texto para não perder a formatação.', false],
      ],
    ),
    QUESTAO(
      'Uma célula guarda 0,15 e mostra 15%. O que aconteceu?',
      'O valor guardado e a aparência exibida são coisas diferentes: mudou apenas o formato.',
      [
        ['Apenas o formato mudou; o valor continua 0,15.', true],
        ['O Excel multiplicou o valor por 100.', false],
        ['A célula virou texto.', false],
        ['O valor foi arredondado.', false],
      ],
    ),
    QUESTAO(
      'Ao copiar =B2*C2 de D2 para D3, o que acontece com as referências?',
      'Referências relativas acompanham a linha: viram B3 e C3.',
      [
        ['Elas viram B3 e C3.', true],
        ['Elas continuam B2 e C2.', false],
        ['O Excel copia apenas o resultado.', false],
        ['A fórmula vira texto.', false],
      ],
    ),
    QUESTAO(
      'Uma coluna mostra #####. O que significa?',
      'A largura da coluna é insuficiente para exibir o valor. Aumente a largura.',
      [
        ['A coluna está estreita demais para mostrar o valor.', true],
        ['Existe um erro na fórmula.', false],
        ['O valor é negativo.', false],
        ['A planilha está protegida.', false],
      ],
    ),
    QUESTAO(
      'Você aplicou um filtro e quer excluir algumas linhas. Qual é o risco?',
      'Excluir com filtro ativo pode remover registros que você não está vendo. Confira o filtro antes.',
      [
        ['Excluir pode remover registros que estão ocultos pelo filtro.', true],
        ['O filtro impede qualquer exclusão.', false],
        ['As fórmulas param de calcular.', false],
        ['A tabela perde os cabeçalhos.', false],
      ],
    ),
  ]),

  'Parte 2 — Excel Intermediário': FIXACAO('Fixação — Excel Intermediário', [
    QUESTAO(
      'Por que uma base limpa é parte do cálculo?',
      'Se a base mistura datas, textos e números, até uma fórmula correta produz resposta ruim.',
      [
        ['Porque uma fórmula correta sobre dados inconsistentes dá resposta errada.', true],
        ['Porque o Excel fica mais rápido.', false],
        ['Porque o arquivo ocupa menos espaço.', false],
        ['Porque a impressão fica mais bonita.', false],
      ],
    ),
    QUESTAO(
      'Qual é a diferença entre célula vazia e célula com zero?',
      'Vazio significa não informado ou desconhecido; zero é um valor conhecido igual a zero.',
      [
        ['Vazio é não informado; zero é um valor conhecido.', true],
        ['São equivalentes para o Excel.', false],
        ['Vazio conta como zero em todas as funções.', false],
        ['Zero é sempre um erro de digitação.', false],
      ],
    ),
    QUESTAO(
      'A formatação condicional pintou de vermelho os prazos vencidos. Isso basta?',
      'Cor sozinha exclui quem não a distingue. Acrescente um rótulo de texto, como Atrasado.',
      [
        ['Não: acrescente também um rótulo de texto, como Atrasado.', true],
        ['Sim: a cor comunica o suficiente.', false],
        ['Sim, desde que o vermelho seja forte.', false],
        ['Não: é preciso excluir as linhas vencidas.', false],
      ],
    ),
    QUESTAO(
      'Você copiou =C2*$H$1 para baixo. O que acontece com $H$1?',
      'A referência absoluta fica fixa: continua $H$1 em todas as linhas.',
      [
        ['Continua $H$1 em todas as linhas.', true],
        ['Vira $H$2, $H$3 e assim por diante.', false],
        ['Vira um valor fixo digitado.', false],
        ['Gera erro de referência circular.', false],
      ],
    ),
    QUESTAO(
      'Qual função responde "quanto foi aprovado no setor Financeiro"?',
      'SOMASES soma valores que atendem a mais de um critério.',
      [
        ['SOMASES', true],
        ['CONT.SES', false],
        ['PROCX', false],
        ['SEERRO', false],
      ],
    ),
    QUESTAO(
      'Por que transformar todo erro em zero com SEERRO é uma má ideia?',
      'Um zero falso parece resultado válido e esconde um problema de cadastro ou de fórmula.',
      [
        ['Um zero falso parece válido e esconde o problema real.', true],
        ['SEERRO deixa a planilha lenta.', false],
        ['SEERRO não funciona com divisão.', false],
        ['Zero não pode aparecer em planilhas financeiras.', false],
      ],
    ),
  ]),

  'Parte 3 — Excel Avançado': FIXACAO('Fixação — Excel Avançado', [
    QUESTAO(
      'O que caracteriza uma boa chave de busca?',
      'Ela precisa estar preenchida, seguir o mesmo formato e ser única quando o processo exige um resultado só.',
      [
        ['Estar preenchida, ter formato padronizado e ser única.', true],
        ['Ser sempre numérica.', false],
        ['Estar na primeira coluna da planilha.', false],
        ['Ter no máximo dez caracteres.', false],
      ],
    ),
    QUESTAO(
      'O PROCX devolveu "Não encontrado" para vários pedidos. Qual é o próximo passo?',
      'O aviso é útil, mas não resolve: descubra se o código falta, está duplicado ou tem outro formato.',
      [
        ['Investigar se o código falta, está duplicado ou mudou de formato.', true],
        ['Trocar a mensagem por zero.', false],
        ['Apagar as linhas com o aviso.', false],
        ['Substituir PROCX por PROCV.', false],
      ],
    ),
    QUESTAO(
      'A Tabela Dinâmica está contando em vez de somar os valores. Qual é a causa provável?',
      'Números armazenados como texto, ou conteúdo inconsistente, fazem o Excel contar em vez de somar.',
      [
        ['A coluna tem números armazenados como texto.', true],
        ['A Tabela Dinâmica não soma moeda.', false],
        ['Falta aplicar negrito no cabeçalho.', false],
        ['O arquivo precisa ser salvo como .xls.', false],
      ],
    ),
    QUESTAO(
      'Você alterou valores na base de origem. O que precisa fazer na Tabela Dinâmica?',
      'A Tabela Dinâmica não percebe sozinha: é preciso atualizar antes de apresentar ou exportar.',
      [
        ['Atualizar a Tabela Dinâmica.', true],
        ['Nada: ela se atualiza sozinha.', false],
        ['Recriar a Tabela Dinâmica do zero.', false],
        ['Reabrir o arquivo.', false],
      ],
    ),
    QUESTAO(
      'Qual recurso limita as entradas de uma coluna a Pendente, Em análise e Concluído?',
      'Validação de dados com origem em lista aceita apenas as opções previstas.',
      [
        ['Validação de dados com lista.', true],
        ['Proteção de planilha.', false],
        ['Formatação condicional.', false],
        ['Criptografia do arquivo.', false],
      ],
    ),
    QUESTAO(
      'Uma mensagem pede para você habilitar macros de um arquivo recebido por e-mail. O que fazer?',
      'Macros executam código. O e-book manda parar e confirmar com o responsável ou o suporte.',
      [
        ['Não habilitar e confirmar com o responsável ou o suporte.', true],
        ['Habilitar, porque sem macros a planilha não abre.', false],
        ['Habilitar apenas se o remetente for conhecido.', false],
        ['Encaminhar o arquivo para um colega testar.', false],
      ],
    ),
  ]),
};

const ANEXOS: Record<string, ActivityAttachmentPolicyDto> = {
  'Projeto final integrado': {
    required: true,
    maxBytes: 1024 * 1024,
    extensions: ['.xlsx', '.csv'],
    hint:
      'Envie sua planilha em .xlsx (ou .csv, se preferir exportar só os dados), com até 1 MB. ' +
      'Use dados fictícios: o conteúdo é lido para conferir sua entrega.',
  },
};

const PERGUNTAS_EXTRAS: Record<string, SeedQuestion[]> = {
  'Questionário de conclusão': [
    QUESTAO(
      'Qual é a diferença entre classificar e filtrar?',
      'Classificar muda a ordem dos registros; filtrar apenas esconde temporariamente alguns deles.',
      [
        ['Classificar muda a ordem; filtrar esconde temporariamente.', true],
        ['Classificar apaga duplicados; filtrar não.', false],
        ['São o mesmo recurso.', false],
        ['Filtrar altera as fórmulas.', false],
      ],
    ),
    QUESTAO(
      'Para que serve Congelar Linha Superior?',
      'Mantém os nomes das colunas visíveis enquanto a lista é rolada.',
      [
        ['Manter os cabeçalhos visíveis ao rolar a lista.', true],
        ['Impedir a edição da primeira linha.', false],
        ['Ordenar automaticamente pela primeira coluna.', false],
        ['Repetir a linha na impressão apenas.', false],
      ],
    ),
    QUESTAO(
      'Qual gráfico responde melhor "como as despesas mudaram ao longo dos meses"?',
      'Linhas mostram evolução no tempo; barras comparam categorias.',
      [
        ['Linhas.', true],
        ['Pizza.', false],
        ['Dispersão.', false],
        ['Rosca.', false],
      ],
    ),
    QUESTAO(
      'O que fazer antes de aceitar o resultado de uma fórmula copiada para 500 linhas?',
      'Conferir uma linha do início, uma do meio e a última é a orientação repetida no e-book.',
      [
        ['Conferir uma linha do início, uma do meio e a última.', true],
        ['Conferir apenas a primeira linha.', false],
        ['Converter as fórmulas em valores.', false],
        ['Proteger a planilha imediatamente.', false],
      ],
    ),
    QUESTAO(
      'Qual é a função do FILTRO em uma lista dinâmica?',
      'FILTRO devolve apenas as linhas que atendem à regra, sem reorganizar a base original.',
      [
        ['Devolver apenas as linhas que atendem a uma regra.', true],
        ['Excluir as linhas que não atendem à regra.', false],
        ['Ordenar a base original.', false],
        ['Proteger as células filtradas.', false],
      ],
    ),
    QUESTAO(
      'Qual afirmação sobre proteção de planilha está correta?',
      'Ela controla quais células podem ser editadas, mas não impede a leitura do arquivo.',
      [
        ['Controla a edição, mas não impede a leitura do arquivo.', true],
        ['Criptografa o conteúdo da planilha.', false],
        ['Impede que o arquivo seja copiado.', false],
        ['Substitui a política de acesso da empresa.', false],
      ],
    ),
  ],
};

const EXEMPLOS: Record<string, ActivityExample> = {
  'Projeto final integrado': {
    scenario:
      'o controle de pedidos de uma padaria fictícia, e não as compras da Horizonte Serviços.',
    goodReport:
      'Entrega 1. Criei as abas Pedidos, Cadastros e Resumo. Registrei 20 pedidos fictícios com ID, data, ' +
      'setor, item, quantidade, preço e status. O total por linha saiu de =E2*F2 e o total geral de ' +
      '=SOMA(G2:G21). Transformei em Tabela e nomeei como Pedidos. Filtrei os pendentes e classifiquei ' +
      'pela data mais antiga. Congelei a linha superior. Ao gerar o PDF, a coluna de status ficou cortada ' +
      'na segunda página; troquei para paisagem e conferi de novo.\n\n' +
      'Entrega 2. Encontrei dois IDs duplicados e três datas gravadas como texto — alinhadas à esquerda, ' +
      'foi assim que percebi. Corrigi as duas coisas. Criei uma regra de formatação condicional para ' +
      'pedidos com mais de sete dias e acrescentei a palavra "Atrasado" numa coluna de status, para não ' +
      'depender só da cor. Calculei o total aprovado por setor com ' +
      '=SOMASES(G2:G21;D2:D21;"Confeitaria";H2:H21;"Aprovado") e contei as pendências com ' +
      '=CONT.SES(D2:D21;"Confeitaria";H2:H21;"Pendente"). Criei um indicador com ' +
      '=SE(H2="Concluído";"OK";"Acompanhar"). Montei o gráfico de linhas dos seis meses com título ' +
      '"Pedidos por mês — janeiro a junho de 2026", unidade em reais, e escrevi a conclusão abaixo. ' +
      'Rodei a verificação de acessibilidade.\n\n' +
      'Entrega 3. Usei =PROCX(D2;Cadastros[Setor];Cadastros[Responsável];"Não encontrado") para trazer o ' +
      'responsável. Dois pedidos voltaram "Não encontrado": o setor estava escrito com espaço no fim no ' +
      'cadastro. Corrigi na origem em vez de mudar a fórmula. Criei a lista dinâmica de pendências com ' +
      'FILTRO. Montei a Tabela Dinâmica com valor por setor e mês; ela veio contando em vez de somar, ' +
      'porque uma coluna tinha número como texto — corrigi e o Total Geral passou a bater com a base. ' +
      'Adicionei segmentação por status, criei validação de dados para a coluna Status e protegi a ' +
      'planilha deixando só as células de entrada editáveis. Testei preenchendo como se fosse outra ' +
      'pessoa. Todos os dados são inventados.',
    whyItWorks: [
      'Mostra as fórmulas de verdade, não "usei SOMASES".',
      'Três erros reais foram encontrados e corrigidos: coluna cortada no PDF, datas como texto, espaço no fim do setor.',
      'Corrigiu a origem em vez de contornar a fórmula — é a diferença entre resolver e disfarçar.',
      'A Tabela Dinâmica só foi aceita depois de o Total Geral bater com a base.',
      'A proteção foi testada do ponto de vista de quem vai preencher.',
    ],
    weakReport:
      'Montei as três abas, registrei os pedidos e calculei os totais. Usei SOMASES, CONT.SES e PROCX, criei a Tabela Dinâmica e o gráfico. Protegi a planilha e gerei o PDF. Os números bateram.',
    whyItFails: [
      'Cita os nomes das funções sem mostrar nenhuma fórmula.',
      '"Os números bateram" não diz com o que foram comparados.',
      'Não menciona nenhum problema encontrado na base — uma base fictícia com duplicados e datas em texto foi montada justamente para isso.',
      'Não diz o que a validação limita nem quais células ficaram editáveis.',
    ],
  },
};

export const MODULE_03_ENRICHMENT: SectionEnrichment = {
  conteudo: CONTEUDO,
  rubricas: RUBRICAS,
  anexos: ANEXOS,
  exemplos: EXEMPLOS,
  questionarios: QUESTIONARIOS,
  perguntas: PERGUNTAS_EXTRAS,
};
