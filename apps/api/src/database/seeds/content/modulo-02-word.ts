import { ActivityAttachmentPolicyDto, LessonType, QuestionType } from '@romalearn/contracts';
import type { SeedLesson, SeedQuestion } from '../catalog-data';
import type { SectionEnrichment } from './apply-content';
import { ActivityRubric, LessonContent } from './content-types';

/**
 * Módulo 2 — Microsoft Word para Administração.
 *
 * Conteúdo extraído do e-book oficial (Edição 2026, 29 páginas). A rubrica do
 * projeto final reproduz a tabela "Critérios de avaliação" (página 27) e as
 * falhas críticas listadas nas regras do projeto (página 26).
 */

const EBOOK = 'Módulo 2';

/** Falhas críticas transcritas das regras do projeto final (página 26). */
const FALHAS_CRITICAS = [
  'Sobrescrever o modelo oficial em vez de gerar uma nova cópia a partir dele.',
  'Misturar dados entre destinatários na mala direta.',
  'Enviar o documento com comentários, marcações de revisão ou campos desatualizados.',
  'Expor dado pessoal ou sensível em imagem, propriedade do arquivo ou fonte de dados.',
  'Usar dados reais de fornecedores ou colaboradores em vez de registros fictícios.',
];

const CAP_1: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Capítulo 1 — Primeiros passos, edição e salvamento seguro',
    pages: '5–7',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Conheça a interface do Word, edite com segurança e proteja o arquivo original.',
    },
    { kind: 'heading', text: 'O Word como bancada de documentos' },
    {
      kind: 'paragraph',
      text: 'O Microsoft Word é um processador de texto: ele combina conteúdo, estrutura e aparência em um arquivo editável. Na rotina administrativa, serve para comunicados, atas, relatórios, procedimentos, contratos, declarações e formulários.',
    },
    {
      kind: 'analogy',
      text: 'Pense no Word como uma bancada. A página é a folha; o cursor é a ponta da caneta; a Faixa de Opções é o armário de ferramentas; o arquivo DOCX é a pasta editável guardada no arquivo da empresa.',
    },
    {
      kind: 'list',
      items: [
        'Barra de título: mostra o nome do arquivo e o estado de salvamento.',
        'Faixa de Opções: organiza comandos por guias, como Página Inicial, Inserir, Layout, Referências e Revisão.',
        'Área do documento: espaço em que o conteúdo é criado.',
        'Barra de status: informa página, contagem de palavras, idioma e zoom.',
      ],
    },
    { kind: 'heading', text: 'Fluxo seguro para iniciar um documento' },
    {
      kind: 'steps',
      items: [
        'Defina o objetivo, o destinatário e a saída esperada antes de formatar.',
        'Abra um documento em branco ou um modelo aprovado pela organização.',
        'Salve imediatamente no local correto com nome descritivo.',
        'Se partiu de um arquivo existente, use Salvar uma Cópia antes de editar para preservar o original.',
        'Digite primeiro a estrutura principal; refine a aparência depois.',
        'Confirme periodicamente o nome do arquivo, o local e o indicador de salvamento.',
      ],
    },
    { kind: 'heading', text: 'Edição sem medo' },
    {
      kind: 'paragraph',
      text: 'Selecione apenas o trecho que deseja alterar. Antes de excluir, substituir ou formatar uma grande seleção, confirme o início e o fim. O Word aplica a maioria dos comandos ao texto selecionado; sem seleção, aplica ao ponto do cursor ou ao texto que será digitado.',
    },
    {
      kind: 'table',
      headers: ['Ação', 'Atalho', 'Uso administrativo'],
      rows: [
        ['Desfazer', 'Ctrl + Z', 'Reverter exclusão ou formatação acidental'],
        ['Refazer', 'Ctrl + Y', 'Reaplicar a última ação desfeita'],
        ['Copiar', 'Ctrl + C', 'Reutilizar trecho sem remover o original'],
        ['Recortar', 'Ctrl + X', 'Mover um trecho'],
        ['Colar', 'Ctrl + V', 'Inserir o conteúdo copiado ou recortado'],
        ['Localizar', 'Ctrl + F', 'Encontrar nome, número ou termo'],
        ['Substituir', 'Ctrl + H', 'Atualizar termo repetido com revisão'],
        ['Salvar', 'Ctrl + S', 'Registrar alterações'],
      ],
    },
    { kind: 'heading', text: 'Salvar, AutoSave e versões' },
    {
      kind: 'paragraph',
      text: 'Salvar atualiza o arquivo atual. Salvar uma Cópia cria outro arquivo e é a escolha segura para preservar um modelo ou uma versão recebida. Em arquivos no OneDrive ou SharePoint, o salvamento automático pode registrar alterações continuamente; isso reduz perda de trabalho, mas aumenta o risco de alterar o original se uma cópia não for criada antes.',
    },
    {
      kind: 'list',
      items: [
        'Use DOCX para continuar editando.',
        'Use PDF para distribuir uma versão de leitura com layout preservado.',
        'Não dependa de Recuperação Automática como sistema de versões.',
        'Quando disponível, consulte o Histórico de Versões antes de recriar um arquivo perdido.',
      ],
    },
    { kind: 'heading', text: 'Erros comuns e boas práticas' },
    {
      kind: 'table',
      headers: ['Erro', 'Boa prática'],
      rows: [
        ['Editar diretamente o modelo oficial.', 'Criar uma cópia antes da primeira alteração.'],
        [
          'Usar espaços para alinhar texto.',
          'Usar alinhamento, tabulação ou tabela quando apropriado.',
        ],
        ['Fechar ignorando o local do arquivo.', 'Conferir nome, pasta e estado de salvamento.'],
      ],
    },
    {
      kind: 'keyIdea',
      text: 'Critério de domínio: criar, editar, localizar, salvar e recuperar uma versão sem sobrescrever o original.',
    },
  ],
  summary: [
    'Salve o documento no local correto antes de começar a formatar.',
    'Use seleção, Desfazer e atalhos para corrigir sem medo.',
    'Mantenha o DOCX para edição e gere PDF para distribuição.',
  ],
};

const CAP_2: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Capítulo 2 — Formatação profissional de textos e listas',
    pages: '8–9',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Transforme texto bruto em um documento claro, legível e visualmente consistente.',
    },
    { kind: 'heading', text: 'Formatação é sinalização' },
    {
      kind: 'paragraph',
      text: 'Formatar é dar sinais visuais ao leitor. O objetivo não é decorar a página, mas indicar o que é título, destaque, sequência, alerta e conteúdo normal.',
    },
    {
      kind: 'analogy',
      text: 'Em um escritório físico, etiquetas, divisórias e marcadores ajudam a localizar informações. No Word, fonte, espaçamento, alinhamento e listas cumprem a mesma função.',
    },
    { kind: 'heading', text: 'Texto versus parágrafo' },
    {
      kind: 'table',
      headers: ['Camada', 'Controla', 'Exemplos'],
      rows: [
        ['Caractere', 'Aparência do trecho selecionado', 'Fonte, tamanho, negrito, itálico, cor'],
        ['Parágrafo', 'Comportamento do bloco inteiro', 'Alinhamento, recuo, espaçamento, linhas'],
        ['Lista', 'Relação entre itens', 'Marcadores, números, níveis'],
      ],
    },
    { kind: 'heading', text: 'Hierarquia visual básica' },
    {
      kind: 'list',
      items: [
        'Título: identifica o documento e deve ser o elemento mais evidente.',
        'Subtítulo ou cabeçalho: separa assuntos sem competir com o título.',
        'Corpo: usa fonte legível e tamanho consistente.',
        'Negrito: destaca termos ou conclusões curtas.',
        'Itálico: marca observações, termos ou títulos, com moderação.',
        'Sublinhado: evite em texto digital quando puder parecer link.',
        'Caixa alta: use apenas em rótulos curtos; blocos inteiros ficam mais difíceis de ler.',
      ],
    },
    { kind: 'heading', text: 'Procedimento para formatar um documento curto' },
    {
      kind: 'steps',
      items: [
        'Selecione o título e aplique uma aparência consistente.',
        'Separe parágrafos por espaçamento, não por várias linhas vazias.',
        'Ajuste alinhamento e recuo do parágrafo conforme a função do texto.',
        'Transforme sequências em listas numeradas e itens sem ordem em marcadores.',
        'Use o Pincel de Formatação apenas para repetir uma formatação correta.',
        'Ative Mostrar/Ocultar para diagnosticar espaços, tabulações e marcas de parágrafo quando o layout parecer estranho.',
        'Revise a página em zoom de leitura e depois em visualização de impressão.',
      ],
    },
    { kind: 'heading', text: 'Listas e tabulações' },
    {
      kind: 'paragraph',
      text: 'Use lista numerada quando a ordem importa, como um procedimento. Use marcadores quando os itens são equivalentes. Para alinhar colunas curtas, prefira tabulações configuradas ou uma tabela simples; várias barras de espaço quebram quando a fonte ou a margem muda.',
    },
    { kind: 'heading', text: 'Erros comuns e boas práticas' },
    {
      kind: 'table',
      headers: ['Erro', 'Boa prática'],
      rows: [
        ['Apertar Enter várias vezes para criar espaço.', 'Usar Espaçamento Antes/Depois.'],
        [
          'Formatar cada título manualmente de forma diferente.',
          'No nível iniciante, copiar um padrão; no intermediário, usar Estilos.',
        ],
      ],
    },
    {
      kind: 'keyIdea',
      text: 'Critério de domínio: produzir documento curto com hierarquia clara, alinhamentos corretos e ausência de espaços artificiais.',
    },
  ],
  summary: [
    'Formatação deve orientar a leitura, não apenas decorar a página.',
    'Diferencie formatação de caracteres, parágrafos e listas.',
    'Use espaçamento, recuos e listas reais em vez de espaços e linhas vazias.',
  ],
};

const CAP_3: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Capítulo 3 — Tabelas, imagens, página e exportação em PDF',
    pages: '10–11',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Insira elementos úteis, organize a página e prepare uma saída pronta para leitura ou impressão.',
    },
    {
      kind: 'analogy',
      text: 'Uma tabela é uma prateleira com nichos; cada informação tem uma posição previsível. Uma imagem é um anexo visual; só deve entrar se ajudar o leitor a entender ou agir.',
    },
    {
      kind: 'table',
      headers: ['Elemento', 'Use quando', 'Evite quando'],
      rows: [
        [
          'Tabela',
          'Há dados com linhas e colunas comparáveis',
          'O conteúdo é apenas um parágrafo longo',
        ],
        ['Imagem', 'Ela explica, comprova ou orienta', 'É apenas decorativa e aumenta o arquivo'],
        [
          'Link',
          'O leitor precisa acessar uma fonte ou sistema',
          'O endereço é temporário ou não confiável',
        ],
        [
          'Cabeçalho/rodapé',
          'A informação deve repetir em páginas',
          'O documento tem uma única página',
        ],
      ],
    },
    { kind: 'heading', text: 'Inserir uma tabela simples' },
    {
      kind: 'steps',
      items: [
        'Defina quais campos precisam ser comparados.',
        'Na guia Inserir, escolha Tabela e a quantidade inicial de linhas e colunas.',
        'Use a primeira linha como cabeçalho com rótulos curtos.',
        'Ajuste larguras conforme o conteúdo; não deixe todas iguais por hábito.',
        'Revise bordas, alinhamento e quebra de texto.',
        'Se a tabela atravessar páginas, confirme que o cabeçalho se repete e que nenhuma linha foi cortada visualmente.',
      ],
    },
    { kind: 'heading', text: 'Inserir imagem sem quebrar o layout' },
    {
      kind: 'list',
      items: [
        'Em Linha com o Texto é a opção mais previsível para iniciantes.',
        'Use quebra de texto apenas quando souber onde a imagem deve permanecer.',
        'Redimensione pelos cantos para preservar a proporção.',
        'Corte áreas irrelevantes e nunca exponha dados pessoais em capturas.',
        'Adicione uma descrição no corpo ou texto alternativo quando a imagem for informativa.',
      ],
    },
    { kind: 'heading', text: 'Página e quebras' },
    {
      kind: 'paragraph',
      text: 'Margens definem o espaço útil da folha. Orientação retrato favorece texto; paisagem pode acomodar tabelas largas. Uma quebra de página inicia uma nova página de forma controlada. Pressionar Enter repetidamente cria um layout frágil que muda quando o texto anterior cresce.',
    },
    {
      kind: 'steps',
      items: [
        'Escolha tamanho e orientação conforme o canal de entrega.',
        'Defina margens antes de ajustar elementos largos.',
        'Use Ctrl + Enter para uma nova página planejada.',
        'Insira cabeçalho, rodapé e número de página quando o documento tiver várias páginas.',
        'Confira a visualização de impressão antes de gerar a saída.',
      ],
    },
    { kind: 'heading', text: 'Impressão e PDF' },
    {
      kind: 'paragraph',
      text: 'A impressão transforma o documento em papel; o PDF cria uma cópia digital de distribuição com layout preservado. O DOCX continua sendo a fonte editável. Antes de exportar, revise páginas em branco, cortes de tabela, imagens, links, comentários, marcações e dados ocultos relevantes.',
    },
    {
      kind: 'keyIdea',
      text: 'Critério de domínio: entregar DOCX editável e PDF revisado, sem quebra visual ou página vazia.',
    },
  ],
  checklist: [
    'Tamanho do papel, margens e orientação corretos.',
    'Número e ordem das páginas corretos.',
    'Sem texto cortado, página vazia ou objeto fora da margem.',
    'Versão e estado do documento identificados.',
    'PDF aberto e conferido depois da exportação.',
  ],
  summary: [
    'Use tabelas para dados comparáveis e imagens que realmente ajudem a explicar.',
    'Prefira quebras de página e configurações de layout a ajustes feitos com Enter.',
    'Revise a visualização de impressão e abra o PDF antes de enviá-lo.',
  ],
};

const CAP_4: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Capítulo 4 — Estilos, hierarquia, navegação e sumário',
    pages: '13–14',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Estruture documentos longos para que sejam consistentes, navegáveis e fáceis de atualizar.',
    },
    { kind: 'heading', text: 'Estilo é regra, não pintura' },
    {
      kind: 'paragraph',
      text: 'Um estilo é um conjunto nomeado de regras para um papel estrutural. Em vez de formatar cada título manualmente, aplica-se Título 1, Título 2 ou Título 3. Se a identidade visual mudar, o estilo é atualizado uma vez e o documento inteiro acompanha.',
    },
    {
      kind: 'analogy',
      text: 'Um estilo é como o uniforme de cada função no escritório. Ao identificar alguém como gestor, analista ou visitante, você sabe o papel antes de observar detalhes. O Word usa estilos para reconhecer a estrutura, não apenas a aparência.',
    },
    { kind: 'heading', text: 'Hierarquia recomendada' },
    {
      kind: 'table',
      headers: ['Estilo', 'Função', 'Exemplo'],
      rows: [
        ['Título', 'Nome do documento', 'Relatório de Desempenho - 2º Trimestre'],
        ['Título 1', 'Seção principal', '1. Resultados'],
        ['Título 2', 'Subseção', '1.1 Vendas'],
        ['Título 3', 'Detalhe interno', '1.1.1 Região Sudeste'],
        ['Normal', 'Texto do corpo', 'Análise, contexto e recomendações'],
      ],
    },
    {
      kind: 'warning',
      text: 'Não pule níveis sem motivo. Título 3 deve estar dentro de um Título 2. Cabeçalhos colocados dentro de tabelas, caixas de texto, cabeçalhos ou rodapés podem não aparecer no Painel de Navegação.',
    },
    { kind: 'heading', text: 'Fluxo para estruturar um documento longo' },
    {
      kind: 'steps',
      items: [
        'Aplique Título 1, Título 2 e Título 3 conforme a lógica do conteúdo.',
        'Abra o Painel de Navegação com Ctrl + F ou pela guia Exibir.',
        'Confira se todos os títulos aparecem no nível correto.',
        'Arraste um título no painel apenas depois de confirmar que todo o bloco deve se mover com ele.',
        'Insira o sumário automático pela guia Referências.',
        'Depois de qualquer alteração estrutural, atualize o sumário inteiro.',
        'Antes da entrega, confira numeração, títulos e links do sumário no PDF.',
      ],
    },
    { kind: 'heading', text: 'Modificar estilos com segurança' },
    {
      kind: 'list',
      items: [
        'Defina fonte, tamanho, cor, espaçamento e paginação do estilo.',
        'Use Manter com o próximo para evitar título isolado no final da página.',
        'Evite aplicar formatação direta por cima do estilo; ela cria exceções difíceis de manter.',
        'Teste uma mudança em cópia do documento quando o arquivo for corporativo ou muito longo.',
        'Use temas para harmonizar fontes e cores, mas valide se respeitam a identidade visual da organização.',
      ],
    },
    { kind: 'heading', text: 'Erros comuns e boas práticas' },
    {
      kind: 'table',
      headers: ['Erro', 'Boa prática'],
      rows: [
        [
          'Deixar um título visualmente grande no estilo Normal.',
          'Atribuir um estilo de título real.',
        ],
        [
          'Editar manualmente o texto do sumário.',
          'Corrigir o título de origem e atualizar o sumário.',
        ],
      ],
    },
    {
      kind: 'keyIdea',
      text: 'Critério de domínio: todo título aparece no nível correto, o sumário atualiza e a reorganização não perde conteúdo.',
    },
  ],
  summary: [
    'Estilos funcionam como regras reutilizáveis para títulos e texto normal.',
    'A hierarquia correta alimenta o Painel de Navegação e o sumário.',
    'Corrija o título de origem e atualize o sumário; não edite o sumário manualmente.',
  ],
};

const CAP_5: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Capítulo 5 — Seções, cabeçalhos, tabelas e imagens',
    pages: '15–16',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Controle partes diferentes do mesmo documento sem desorganizar o restante do arquivo.',
    },
    { kind: 'heading', text: 'Página versus seção' },
    {
      kind: 'paragraph',
      text: 'Quebra de página apenas inicia outra página. Quebra de seção cria uma nova zona de configuração: permite mudar orientação, margens, colunas, cabeçalho, rodapé e numeração a partir daquele ponto.',
    },
    {
      kind: 'analogy',
      text: 'Uma quebra de página vira a folha dentro da mesma pasta. Uma quebra de seção abre uma nova divisória, capaz de ter regras próprias.',
    },
    {
      kind: 'table',
      headers: ['Necessidade', 'Recurso'],
      rows: [
        ['Iniciar conteúdo na próxima página mantendo o mesmo layout', 'Quebra de página'],
        ['Usar paisagem apenas em uma tabela larga', 'Quebra de seção antes e depois'],
        ['Remover cabeçalho de uma parte', 'Nova seção e desligar Vincular ao Anterior'],
        ['Reiniciar numeração no corpo', 'Seção e Formatar Números de Página'],
      ],
    },
    { kind: 'heading', text: 'Procedimento: página paisagem no meio do relatório' },
    {
      kind: 'steps',
      items: [
        'Ative Mostrar/Ocultar para enxergar as marcas estruturais.',
        'Posicione o cursor antes da tabela e insira quebra de seção - Próxima Página.',
        'Posicione o cursor depois da tabela e repita a quebra de seção.',
        'Clique na seção da tabela e altere a orientação para Paisagem.',
        'Confira se as seções anterior e posterior continuam em Retrato.',
        'Revise cabeçalhos, rodapés e numeração nas três seções.',
      ],
    },
    { kind: 'heading', text: 'Cabeçalhos, rodapés e Vincular ao Anterior' },
    {
      kind: 'paragraph',
      text: 'Por padrão, uma nova seção pode herdar cabeçalho e rodapé da anterior. Para ter conteúdo diferente, abra a área e desative Vincular ao Anterior na seção que deve mudar. Primeira Página Diferente é útil para capas. Pares e Ímpares Diferentes atende documentos impressos frente e verso.',
    },
    {
      kind: 'warning',
      text: 'Alterar ou apagar um cabeçalho vinculado pode modificar seções anteriores. Confirme a seção atual e o estado de Vincular ao Anterior antes de editar.',
    },
    { kind: 'heading', text: 'Tabelas profissionais' },
    {
      kind: 'list',
      items: [
        'Use cabeçalho repetido em tabelas que atravessam páginas.',
        'Dimensione colunas pelo conteúdo e deixe colunas narrativas mais largas.',
        'Alinhe números e estados de forma previsível.',
        'Evite altura fixa de linha, que pode cortar texto.',
        'Não use tabelas para empacotar parágrafos comuns ou criar layout decorativo.',
        'Considere texto alternativo ou descrição quando a tabela for complexa e o público exigir acessibilidade.',
      ],
    },
    { kind: 'heading', text: 'Imagens e legendas' },
    {
      kind: 'list',
      items: [
        'Em Linha com o Texto é mais estável; objetos flutuantes exigem ancoragem e revisão.',
        'Use quebra Quadrado ou Superior e Inferior apenas quando melhorar a leitura.',
        'Insira legenda pela guia Referências para numeração automática.',
        'Mantenha imagem e legenda juntas e cite a figura no texto quando ela for essencial.',
        'Comprima imagens com critério e preserve uma cópia de melhor qualidade quando necessário.',
      ],
    },
    {
      kind: 'keyIdea',
      text: 'Critério de domínio: alterar uma seção sem afetar as demais e manter tabelas, imagens e numeração estáveis.',
    },
  ],
  summary: [
    'Quebra de página muda a folha; quebra de seção cria uma nova zona de configuração.',
    'Confira Vincular ao Anterior antes de alterar cabeçalhos ou rodapés.',
    'Mantenha tabelas, imagens e legendas estáveis e acessíveis.',
  ],
};

const CAP_6: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Capítulo 6 — Revisão, colaboração e acessibilidade',
    pages: '17–18',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Revise em equipe com rastreabilidade e entregue documentos utilizáveis por públicos diversos.',
    },
    { kind: 'heading', text: 'Três camadas de colaboração' },
    {
      kind: 'analogy',
      text: 'Comentário é um post-it; Controlar Alterações é a caneta vermelha que registra cada edição; Histórico de Versões é o arquivo cronológico das cópias anteriores.',
    },
    {
      kind: 'table',
      headers: ['Recurso', 'Registra', 'Use para'],
      rows: [
        [
          'Comentário',
          'Conversa ligada a um trecho',
          'Pergunta, justificativa ou decisão pendente',
        ],
        [
          'Controlar Alterações',
          'Inserções, exclusões e formatações',
          'Revisão que precisa ser aceita ou rejeitada',
        ],
        [
          'Histórico de Versões',
          'Estados anteriores do arquivo',
          'Recuperar ou comparar uma versão anterior',
        ],
      ],
    },
    { kind: 'heading', text: 'Fluxo de revisão rastreável' },
    {
      kind: 'steps',
      items: [
        'Confirme que o arquivo correto e a versão correta estão abertos.',
        'Ative Controlar Alterações para todos ou apenas para você, conforme o processo.',
        'Use comentários para perguntas; não use comentários para substituir toda a edição textual.',
        'Filtre a exibição por revisor ou tipo quando o documento estiver muito marcado.',
        'Aceite ou rejeite alterações uma a uma quando houver impacto de conteúdo.',
        'Resolva comentários somente depois da decisão estar incorporada.',
        'Salve uma cópia limpa e confira se não restaram marcações antes da distribuição final.',
      ],
    },
    { kind: 'heading', text: 'Coautoria e versões' },
    {
      kind: 'list',
      items: [
        'Prefira um único arquivo compartilhado em local autorizado.',
        'Evite trocar várias cópias por e-mail com nomes final, final2 e final_agora.',
        'Use menções em comentários quando a plataforma permitir e houver responsável claro.',
        'Não restaure uma versão sem verificar quais alterações posteriores seriam perdidas.',
        'Documentos com recursos ou formatos antigos podem limitar coautoria; mantenha formato DOCX moderno quando possível.',
      ],
    },
    { kind: 'heading', text: 'Qualidade antes da entrega' },
    {
      kind: 'steps',
      items: [
        'Revisar conteúdo, nomes, números, datas e referências.',
        'Executar verificação ortográfica e confirmar o idioma.',
        'Atualizar sumário, legendas e campos.',
        'Revisar comentários e alterações pendentes.',
        'Executar Verificador de Acessibilidade.',
        'Abrir a visualização de impressão e exportar PDF de teste.',
        'Abrir o PDF e conferir páginas, links e legibilidade.',
      ],
    },
    {
      kind: 'keyIdea',
      text: 'Critério de domínio: entregar cópia limpa, rastreabilidade preservada e verificação de acessibilidade concluída.',
    },
  ],
  checklist: [
    'Títulos usam estilos e seguem hierarquia lógica.',
    'Listas são listas reais, não símbolos digitados manualmente.',
    'Imagens informativas possuem texto alternativo útil; decorativas são marcadas como decorativas quando suportado.',
    "Links usam texto descritivo, não apenas 'clique aqui'.",
    'Tabelas possuem cabeçalho claro e leitura previsível.',
    'Cor não é o único meio de transmitir estado ou prioridade.',
    'Idioma de revisão corresponde ao texto.',
    'Verificador de Acessibilidade foi executado e os alertas relevantes foram tratados.',
  ],
  summary: [
    'Comentários registram conversas; Controlar Alterações registra edições.',
    'Trabalhe em um único arquivo compartilhado e preserve o histórico de versões.',
    'Antes da entrega, trate acessibilidade, ortografia, campos e marcações pendentes.',
  ],
};

const CAP_7: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Capítulo 7 — Modelos, blocos, campos e referências',
    pages: '20–21',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Reutilize estruturas aprovadas e mantenha informações dinâmicas atualizadas.',
    },
    { kind: 'heading', text: 'Reutilizar sem duplicar erros' },
    {
      kind: 'paragraph',
      text: 'Um documento reutilizável separa estrutura estável de conteúdo variável. O modelo define estilos, margens, cabeçalhos, blocos e orientações; a nova instância recebe os dados do caso concreto.',
    },
    {
      kind: 'analogy',
      text: 'Um modelo é um formulário mestre guardado no arquivo central. Cada uso gera uma nova cópia preenchida, sem escrever sobre a matriz.',
    },
    {
      kind: 'table',
      headers: ['Recurso', 'Função'],
      rows: [
        ['DOTX', 'Cria novos documentos a partir de uma estrutura padrão'],
        ['Partes Rápidas / AutoTexto', 'Reutiliza blocos aprovados de texto ou layout'],
        ['Propriedades do documento', 'Centraliza metadados como título, assunto e autor'],
        ['Campo', 'Exibe valor calculado ou referenciado que pode ser atualizado'],
        ['Legenda', 'Numera figuras e tabelas automaticamente'],
        ['Referência cruzada', 'Aponta para título, legenda ou marcador e acompanha mudanças'],
      ],
    },
    { kind: 'heading', text: 'Criar um modelo governado' },
    {
      kind: 'steps',
      items: [
        'Mapeie o que é fixo, variável, opcional e proibido.',
        'Defina estilos, página, cabeçalho, rodapé e blocos obrigatórios.',
        'Inclua instruções curtas ou placeholders inequívocos para os campos variáveis.',
        'Salve como modelo DOTX em local controlado.',
        'Abra o modelo para gerar um novo documento e confirme que a matriz não é sobrescrita.',
        'Teste casos curtos, longos e sem dados opcionais.',
        'Versione e publique com responsável, data e critério de substituição.',
      ],
    },
    { kind: 'heading', text: 'Campos e atualização' },
    {
      kind: 'paragraph',
      text: 'Campos podem representar página, número total de páginas, data, propriedade, sequência ou referência. O valor exibido pode ficar desatualizado até que o campo seja atualizado. Antes da entrega, selecione o documento e atualize campos; depois, confirme visualmente o resultado.',
    },
    {
      kind: 'warning',
      text: 'Data automática pode mudar quando o arquivo for aberto no futuro. Para registrar a data de emissão, use valor fixo ou processo que preserve o momento correto.',
    },
    { kind: 'heading', text: 'Legendas e referências cruzadas' },
    {
      kind: 'steps',
      items: [
        'Insira a figura ou tabela no local definitivo.',
        'Use Inserir Legenda para gerar número automático.',
        "No texto, use Referência Cruzada em vez de digitar 'Figura 3' manualmente.",
        'Depois de mover ou inserir elementos, atualize todos os campos.',
        'Verifique se a referência aponta para o item correto no DOCX e no PDF.',
      ],
    },
    {
      kind: 'keyIdea',
      text: 'Critério de domínio: gerar nova instância sem alterar a matriz e atualizar todos os elementos dinâmicos sem referência quebrada.',
    },
  ],
  summary: [
    'Separe estrutura fixa de conteúdo variável em modelos DOTX.',
    'Use blocos reutilizáveis para reduzir retrabalho e inconsistência.',
    'Atualize campos, legendas e referências cruzadas antes de publicar.',
  ],
};

const CAP_8: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Capítulo 8 — Mala direta e documentos em lote',
    pages: '22–23',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Combine um modelo com uma fonte de dados para gerar documentos personalizados com controle.',
    },
    { kind: 'heading', text: 'Modelo, dados e resultado' },
    {
      kind: 'paragraph',
      text: 'A mala direta conecta um documento principal a uma fonte de dados. Os campos de mesclagem indicam onde o Word deve inserir nome, endereço, vencimento, valor ou outro dado de cada registro.',
    },
    {
      kind: 'analogy',
      text: 'É como ter um carimbo inteligente: o corpo da carta permanece, mas os campos variáveis recebem os dados corretos de cada linha da lista.',
    },
    {
      kind: 'table',
      headers: ['Parte', 'Exemplo'],
      rows: [
        ['Documento principal', 'Carta de renovação de contrato'],
        ['Fonte de dados', 'Planilha com uma linha por fornecedor'],
        ['Campo de mesclagem', 'Nome, Empresa, Data, Valor'],
        ['Regra ou filtro', 'Somente contratos que vencem em 30 dias'],
        ['Saída', 'Um documento personalizado por destinatário'],
      ],
    },
    { kind: 'heading', text: 'Fluxo completo da mala direta' },
    {
      kind: 'steps',
      items: [
        'Crie uma cópia de teste do documento principal e da fonte de dados.',
        'Na guia Correspondências, escolha o tipo de mala direta.',
        'Selecione a lista de destinatários e confirme a planilha ou tabela correta.',
        'Insira campos de mesclagem nos locais apropriados.',
        'Filtre ou ordene registros quando o processo exigir.',
        'Use Visualizar Resultados e percorra registros curtos, longos, vazios e com caracteres especiais.',
        'Conclua primeiro em um novo documento para revisão, quando possível.',
        'Confira amostra, total de registros, destinatários e formato antes de imprimir ou enviar.',
        'Registre a versão da fonte e arquive a evidência conforme a política da organização.',
      ],
    },
    { kind: 'heading', text: 'Controles de risco' },
    {
      kind: 'list',
      items: [
        'Nunca use dados reais no primeiro teste; prefira registros fictícios.',
        'Não envie diretamente sem visualizar os resultados e contar os registros.',
        'Teste campos vazios para evitar saudações incompletas.',
        'Separe o processo de gerar do processo de autorizar o envio quando houver impacto financeiro, jurídico ou de privacidade.',
        'Proteja a planilha de origem e remova cópias temporárias conforme a política interna.',
      ],
    },
    {
      kind: 'keyIdea',
      text: 'Critério de domínio: total de saídas corresponde ao filtro, campos estão corretos e nenhum destinatário recebe dados de outro registro.',
    },
  ],
  checklist: [
    'Uma linha representa um destinatário ou registro.',
    'A primeira linha contém nomes de colunas claros e únicos.',
    'Não há linhas ou colunas vazias dentro do intervalo principal.',
    'CEP, código, CPF ou identificador que pode começar com zero está armazenado como texto.',
    'Datas, moedas e percentuais foram testados no formato de saída.',
    'Dados desnecessários ou sensíveis foram removidos da cópia usada na mesclagem.',
    'A lista foi validada quanto a duplicidade, destinatário e autorização de uso.',
  ],
  summary: [
    'A qualidade da mala direta depende da limpeza e da estabilidade da fonte de dados.',
    'Visualize registros diferentes e aplique filtros antes de concluir a mesclagem.',
    'Valide destinatários, dados sensíveis e amostras antes de imprimir ou enviar.',
  ],
};

const CAP_9: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Capítulo 9 — Formulários, proteção e finalização',
    pages: '24–25',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Crie documentos preenchíveis, compare versões e faça uma inspeção completa antes da entrega.',
    },
    { kind: 'heading', text: 'Formulário estruturado' },
    {
      kind: 'paragraph',
      text: 'Controles de conteúdo criam áreas previsíveis para texto, data, seleção, caixa de verificação ou imagem. Eles reduzem a variação de preenchimento e facilitam a validação, mas não substituem um sistema quando há fluxo, banco de dados, regras complexas ou grande volume.',
    },
    {
      kind: 'analogy',
      text: 'Um controle de conteúdo é um campo impresso com limite e instrução. O usuário sabe onde escrever e qual tipo de resposta é esperado.',
    },
    {
      kind: 'warning',
      text: 'Proteção no Word controla edição, mas não deve ser tratada automaticamente como criptografia ou controle de acesso. Para dados sigilosos, aplique também as políticas corporativas de armazenamento e permissão.',
    },
    { kind: 'heading', text: 'Construir um formulário preenchível' },
    {
      kind: 'steps',
      items: [
        'Mapeie campos, tipos, obrigatoriedade, validação e destino dos dados.',
        'Habilite a guia Desenvolvedor no Word para Windows.',
        'Insira controles adequados: texto, data, lista, caixa de seleção ou imagem.',
        'Defina título, tag, texto de instrução e opções de cada controle.',
        'Organize o formulário com estilos, rótulos claros e ordem de leitura lógica.',
        'Restrinja a edição apenas depois de testar todos os campos.',
        'Teste com teclado, campos vazios, respostas longas e cópia em outro computador compatível.',
        'Documente como desbloquear e manter o modelo.',
      ],
    },
    { kind: 'heading', text: 'Comparar e combinar' },
    {
      kind: 'paragraph',
      text: 'Comparar mostra diferenças entre original e revisado em um resultado separado, preservando o original por padrão. Combinar consolida alterações de cópias revisadas. Em ambos os casos, defina corretamente qual arquivo é o original e qual é o revisado.',
    },
    {
      kind: 'steps',
      items: [
        'Faça cópia dos arquivos e identifique original e revisado.',
        'Na guia Revisão, escolha Comparar ou Combinar.',
        'Selecione os arquivos e os tipos de mudança que devem ser analisados.',
        'Gere o resultado em novo documento.',
        'Revise alterações críticas individualmente.',
        'Salve o resultado com nome que indique origem, data e estado.',
      ],
    },
    {
      kind: 'keyIdea',
      text: 'Critério de domínio: formulário preenchível sem quebra, comparação rastreável e pacote final sem dados ocultos indevidos.',
    },
  ],
  checklist: [
    'Crie uma cópia antes de remover dados, pois algumas remoções não podem ser desfeitas.',
    'Verifique comentários, revisões, versões, propriedades e informações pessoais.',
    'Verifique texto oculto, cabeçalhos, rodapés e objetos incorporados.',
    'Remova somente o que foi analisado e autorizado.',
    'Atualize campos, sumário, legendas e referências.',
    'Execute acessibilidade, ortografia e visualização de impressão.',
    'Exporte PDF e revise a cópia final.',
    'Arquive o DOCX-fonte, o PDF distribuído e a evidência de aprovação conforme o processo.',
  ],
  summary: [
    'Escolha o controle de conteúdo conforme o tipo de resposta esperada.',
    'Proteção reduz alterações acidentais, mas não substitui segurança e permissões.',
    'Compare versões, inspecione dados ocultos e teste o pacote final em DOCX e PDF.',
  ],
};

/**
 * Rubrica do projeto final: critérios e pesos transcritos da tabela
 * "Critérios de avaliação" (página 27). O e-book fixa o corte em 70% e
 * descreve a faixa 70–89% como "Funcional: conclui com consultas pontuais e
 * sem falha crítica".
 */
const RUBRICA_PROJETO_FINAL: ActivityRubric = {
  passingScore: 70,
  minWords: 250,
  criticalFailures: FALHAS_CRITICAS,
  criteria: [
    {
      id: 'conteudo-e-clareza',
      title: 'Conteúdo e clareza',
      weight: 15,
      whatToObserve: 'Texto adequado ao público e ao objetivo de cada entrega.',
    },
    {
      id: 'estrutura-e-estilos',
      title: 'Estrutura e estilos',
      weight: 15,
      whatToObserve: 'Hierarquia navegável com Título 1, 2 e 3 e sumário automático correto.',
    },
    {
      id: 'layout-e-elementos',
      title: 'Layout e elementos',
      weight: 15,
      whatToObserve: 'Páginas, seções, tabelas e imagens estáveis, incluindo a seção paisagem.',
    },
    {
      id: 'revisao-e-acessibilidade',
      title: 'Revisão e acessibilidade',
      weight: 15,
      whatToObserve: 'Cópia limpa, sem marcações pendentes, e alertas de acessibilidade tratados.',
    },
    {
      id: 'reutilizacao-e-automacao',
      title: 'Reutilização e automação',
      weight: 15,
      whatToObserve: 'Modelo DOTX e campos funcionais, gerando nova instância sem tocar a matriz.',
    },
    {
      id: 'mala-direta-e-formularios',
      title: 'Mala direta e formulários',
      weight: 15,
      whatToObserve: 'Dados corretos por destinatário e controles de conteúdo testados.',
    },
    {
      id: 'governanca-e-entrega',
      title: 'Governança e entrega',
      weight: 10,
      whatToObserve: 'Versões, PDF conferido e aprovações rastreáveis.',
    },
  ],
};

const CONTEUDO: Record<string, LessonContent> = {
  'Capítulo 1 — Primeiros passos, edição e salvamento seguro': CAP_1,
  'Capítulo 2 — Formatação profissional de textos e listas': CAP_2,
  'Capítulo 3 — Tabelas, imagens, página e exportação em PDF': CAP_3,
  'Capítulo 4 — Estilos, hierarquia, navegação e sumário': CAP_4,
  'Capítulo 5 — Seções, cabeçalhos, tabelas e imagens': CAP_5,
  'Capítulo 6 — Revisão, colaboração e acessibilidade': CAP_6,
  'Capítulo 7 — Modelos, blocos, campos e referências': CAP_7,
  'Capítulo 8 — Mala direta e documentos em lote': CAP_8,
  'Capítulo 9 — Formulários, proteção e finalização': CAP_9,
};

const RUBRICAS: Record<string, Pick<SeedLesson, 'rubric' | 'rubricReference'>> = {
  'Projeto final integrado': {
    rubric: RUBRICA_PROJETO_FINAL,
    rubricReference: {
      module: EBOOK,
      chapter: 'Projeto final integrado — Regras e Critérios de avaliação',
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
  'Parte 1 — Word Iniciante': FIXACAO('Fixação — Word Iniciante', [
    QUESTAO(
      'Você recebeu o modelo oficial de ata da empresa e precisa preencher a ata de hoje. Qual é o primeiro passo seguro?',
      'Editar direto o modelo sobrescreve a matriz. Use Salvar uma Cópia antes da primeira alteração.',
      [
        ['Usar Salvar uma Cópia antes de qualquer alteração.', true],
        ['Editar o modelo e depois desfazer com Ctrl + Z.', false],
        ['Editar o modelo e salvar com o mesmo nome.', false],
        ['Exportar o modelo em PDF e editar o PDF.', false],
      ],
    ),
    QUESTAO(
      'Qual é a diferença entre Salvar e Salvar como?',
      'Salvar registra as mudanças no mesmo arquivo; Salvar como cria outro arquivo ou muda nome, local ou formato.',
      [
        ['Salvar atualiza o arquivo atual; Salvar como cria outro arquivo.', true],
        ['São a mesma coisa, com nomes diferentes.', false],
        ['Salvar gera PDF; Salvar como gera DOCX.', false],
        ['Salvar como apaga a versão anterior.', false],
      ],
    ),
    QUESTAO(
      'Para separar dois parágrafos com mais espaço, o que o capítulo recomenda?',
      'Várias linhas vazias criam um layout frágil. Use Espaçamento Antes/Depois do parágrafo.',
      [
        ['Usar o Espaçamento Antes/Depois do parágrafo.', true],
        ['Apertar Enter três vezes.', false],
        ['Aumentar a fonte do parágrafo anterior.', false],
        ['Inserir uma quebra de página.', false],
      ],
    ),
    QUESTAO(
      'Quando usar lista numerada em vez de marcadores?',
      'Numeração indica ordem. Use quando a sequência importa, como em um procedimento.',
      [
        ['Quando a ordem dos itens importa, como em um procedimento.', true],
        ['Sempre, porque fica mais organizado.', false],
        ['Quando há mais de cinco itens.', false],
        ['Quando o texto será exportado em PDF.', false],
      ],
    ),
    QUESTAO(
      'Uma tabela do relatório atravessa duas páginas. O que conferir?',
      'O cabeçalho precisa se repetir na página seguinte e nenhuma linha pode ficar cortada.',
      [
        ['Se o cabeçalho se repete e nenhuma linha foi cortada.', true],
        ['Se todas as colunas têm a mesma largura.', false],
        ['Se a tabela tem bordas coloridas.', false],
        ['Se a tabela cabe em uma página ao reduzir a fonte para 6.', false],
      ],
    ),
    QUESTAO(
      'Depois de exportar o PDF do comunicado, qual é o último passo antes de enviar?',
      'O e-book pede para abrir o PDF criado e conferir todas as páginas antes do envio.',
      [
        ['Abrir o PDF e conferir todas as páginas.', true],
        ['Excluir o DOCX para não confundir as versões.', false],
        ['Renomear o PDF com a data de hoje e enviar direto.', false],
        ['Compactar o PDF em .zip.', false],
      ],
    ),
  ]),

  'Parte 2 — Word Intermediário': FIXACAO('Fixação — Word Intermediário', [
    QUESTAO(
      'O título de uma seção está grande e em negrito, mas no estilo Normal. Qual é o problema?',
      'Sem um estilo de título real, o texto não aparece no Painel de Navegação nem no sumário automático.',
      [
        ['Ele não entra no Painel de Navegação nem no sumário automático.', true],
        ['Nenhum: a aparência é o que importa.', false],
        ['O arquivo fica maior.', false],
        ['O Word não consegue imprimir a página.', false],
      ],
    ),
    QUESTAO(
      'Um título do sumário está com erro de digitação. Onde corrigir?',
      'O sumário é gerado a partir dos títulos. Corrija o título de origem e atualize o sumário.',
      [
        ['No título de origem, atualizando o sumário depois.', true],
        ['Direto no texto do sumário.', false],
        ['Excluindo e recriando o documento.', false],
        ['No cabeçalho da página.', false],
      ],
    ),
    QUESTAO(
      'Você precisa de uma única página em paisagem no meio do relatório. Qual recurso usar?',
      'Quebra de página só vira a folha. Só a quebra de seção cria uma zona com orientação própria.',
      [
        ['Quebra de seção antes e depois da página.', true],
        ['Quebra de página antes da tabela.', false],
        ['Diminuir as margens da página.', false],
        ['Inserir a tabela dentro de uma caixa de texto.', false],
      ],
    ),
    QUESTAO(
      'Você apagou o cabeçalho de uma seção e ele sumiu também das seções anteriores. Por quê?',
      'A seção estava com Vincular ao Anterior ativo, então as seções compartilhavam o mesmo cabeçalho.',
      [
        ['A opção Vincular ao Anterior estava ativa.', true],
        ['O documento estava corrompido.', false],
        ['Cabeçalhos são sempre iguais em todo o documento.', false],
        ['Faltou salvar antes de editar.', false],
      ],
    ),
    QUESTAO(
      'Qual recurso registra cada inserção e exclusão para serem aceitas ou rejeitadas depois?',
      'Comentário guarda conversa; Controlar Alterações registra as edições.',
      [
        ['Controlar Alterações.', true],
        ['Comentário.', false],
        ['Histórico de Versões.', false],
        ['Pincel de Formatação.', false],
      ],
    ),
    QUESTAO(
      'Qual destes itens faz parte da checagem de acessibilidade do capítulo?',
      'Links precisam de texto descritivo; "clique aqui" não diz para onde leva.',
      [
        ['Links com texto descritivo, em vez de "clique aqui".', true],
        ['Usar apenas cor para indicar prioridade.', false],
        ['Escrever títulos em caixa alta.', false],
        ['Trocar listas por símbolos digitados manualmente.', false],
      ],
    ),
  ]),

  'Parte 3 — Word Avançado': FIXACAO('Fixação — Word Avançado', [
    QUESTAO(
      'Qual é a função de um arquivo DOTX?',
      'O modelo guarda a estrutura padrão e gera uma nova cópia a cada uso, sem ser sobrescrito.',
      [
        ['Criar novos documentos a partir de uma estrutura padrão.', true],
        ['Guardar o documento em formato compactado.', false],
        ['Proteger o documento com senha.', false],
        ['Converter o documento em PDF automaticamente.', false],
      ],
    ),
    QUESTAO(
      'Por que registrar a data de emissão com um campo de data automática pode ser um problema?',
      'O campo pode ser atualizado quando o arquivo for aberto no futuro, mudando a data registrada.',
      [
        ['A data pode mudar quando o arquivo for aberto depois.', true],
        ['Campos de data não funcionam em PDF.', false],
        ['O Word não aceita datas em português.', false],
        ['A data automática deixa o arquivo mais pesado.', false],
      ],
    ),
    QUESTAO(
      'Na fonte de dados da mala direta, um CEP começa com zero. Como ele deve estar armazenado?',
      'Identificadores que podem começar com zero precisam ser texto, ou o zero inicial se perde.',
      [
        ['Como texto, para preservar o zero à esquerda.', true],
        ['Como número, para permitir ordenação.', false],
        ['Como data, porque é um dado de endereço.', false],
        ['Como moeda, para manter oito dígitos.', false],
      ],
    ),
    QUESTAO(
      'Qual é o controle de risco mais importante ao testar uma mala direta pela primeira vez?',
      'O e-book é explícito: nunca use dados reais no primeiro teste; prefira registros fictícios.',
      [
        ['Usar registros fictícios em vez de dados reais.', true],
        ['Enviar direto para dois destinatários de confiança.', false],
        ['Imprimir todas as cartas para conferir depois.', false],
        ['Desativar a visualização para agilizar.', false],
      ],
    ),
    QUESTAO(
      'A proteção de edição do Word substitui o controle de acesso ao arquivo?',
      'Proteção controla edição, mas não é criptografia nem permissão. Dados sigilosos exigem as políticas da organização.',
      [
        ['Não: ela reduz alterações acidentais, mas não substitui permissões.', true],
        ['Sim: o arquivo fica criptografado.', false],
        ['Sim, desde que a senha seja forte.', false],
        ['Não se aplica: o Word não tem proteção.', false],
      ],
    ),
    QUESTAO(
      'Antes de usar o Inspetor de Documento, qual cuidado o capítulo pede?',
      'Algumas remoções não podem ser desfeitas. Rode a inspeção sempre em uma cópia.',
      [
        ['Fazer uma cópia, porque algumas remoções não podem ser desfeitas.', true],
        ['Desativar o Controlar Alterações.', false],
        ['Converter o arquivo para .doc antigo.', false],
        ['Remover todas as imagens do documento.', false],
      ],
    ),
  ]),
};

const ANEXOS: Record<string, ActivityAttachmentPolicyDto> = {
  'Projeto final integrado': {
    required: true,
    maxBytes: 1024 * 1024,
    extensions: ['.docx'],
    hint:
      'Envie o documento do Word que você produziu, em .docx, com até 1 MB. Use dados fictícios: ' +
      'o arquivo é lido para conferir sua entrega.',
  },
};

const PERGUNTAS_EXTRAS: Record<string, SeedQuestion[]> = {
  'Questionário de conclusão': [
    QUESTAO(
      'Qual é a diferença entre formatação de caractere e de parágrafo?',
      'Caractere controla a aparência do trecho selecionado; parágrafo controla o bloco inteiro.',
      [
        ['Caractere afeta o trecho selecionado; parágrafo, o bloco inteiro.', true],
        ['São a mesma coisa em documentos curtos.', false],
        ['Caractere só funciona com negrito.', false],
        ['Parágrafo só afeta a primeira linha.', false],
      ],
    ),
    QUESTAO(
      'Para que serve o recurso Mostrar/Ocultar?',
      'Ele revela espaços, tabulações e marcas de parágrafo, ajudando a diagnosticar um layout estranho.',
      [
        ['Diagnosticar espaços, tabulações e marcas de parágrafo.', true],
        ['Esconder imagens para imprimir mais rápido.', false],
        ['Alternar entre DOCX e PDF.', false],
        ['Ocultar comentários dos revisores.', false],
      ],
    ),
    QUESTAO(
      'Qual é a vantagem de uma referência cruzada em vez de digitar "Figura 3"?',
      'A referência cruzada acompanha mudanças: se a figura mudar de número, o texto acompanha.',
      [
        ['Ela acompanha automaticamente mudanças de numeração.', true],
        ['Ela deixa o texto em negrito.', false],
        ['Ela reduz o tamanho do arquivo.', false],
        ['Ela impede que a figura seja movida.', false],
      ],
    ),
    QUESTAO(
      'Qual é a saída recomendada da mala direta para revisão antes do envio?',
      'Concluir em um novo documento permite revisar antes de imprimir ou enviar.',
      [
        ['Concluir em um novo documento e revisar.', true],
        ['Imprimir direto todas as cartas.', false],
        ['Enviar por e-mail e conferir depois.', false],
        ['Salvar apenas o documento principal.', false],
      ],
    ),
    QUESTAO(
      'Quando usar Comparar em vez de Combinar?',
      'Comparar mostra as diferenças entre original e revisado; Combinar consolida alterações de várias cópias.',
      [
        ['Para ver as diferenças entre um original e um revisado.', true],
        ['Para juntar cinco versões de revisores diferentes.', false],
        ['Para converter o documento em PDF.', false],
        ['Para proteger o documento com senha.', false],
      ],
    ),
    QUESTAO(
      'O pacote final de entrega do projeto inclui o quê?',
      'DOCX-fonte, PDFs revisados, fonte de dados de teste e checklist de aprovação.',
      [
        ['DOCX-fonte, PDF revisado, fonte de teste e checklist.', true],
        ['Apenas o PDF final.', false],
        ['Apenas o modelo DOTX.', false],
        ['O arquivo com as marcações de revisão ativas.', false],
      ],
    ),
  ],
};

export const MODULE_02_ENRICHMENT: SectionEnrichment = {
  conteudo: CONTEUDO,
  rubricas: RUBRICAS,
  anexos: ANEXOS,
  questionarios: QUESTIONARIOS,
  perguntas: PERGUNTAS_EXTRAS,
};
