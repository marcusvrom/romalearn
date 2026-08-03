import { ActivityAttachmentPolicyDto, LessonType, QuestionType } from '@romalearn/contracts';
import type { SeedLesson, SeedQuestion } from '../catalog-data';
import type { SectionEnrichment } from './apply-content';
import { ActivityExample, ActivityRubric, LessonContent } from './content-types';

/**
 * Módulo 1 — Introdução à Computação e ao Windows.
 *
 * Conteúdo extraído do e-book oficial (Edição 2026, 32 páginas). A rubrica do
 * projeto final reproduz a tabela "Como avaliar" (página 29); as demais vêm
 * das listas "Conferir:" e dos blocos "Pratique agora" de cada capítulo.
 */

const EBOOK = 'Módulo 1';

/** Falhas críticas do módulo: derivadas dos avisos "Atenção" do e-book. */
const FALHAS_CRITICAS = [
  'Usar documentos verdadeiros da escola ou da empresa em vez de arquivos de treinamento.',
  'Expor dado pessoal ou sensível em captura de tela, nome de arquivo ou compartilhamento.',
  'Descrever exclusão definitiva sem conferência, ou esvaziar a Lixeira sem autorização.',
  'Compartilhar arquivo, link ou permissão sem conferir destinatário e conteúdo.',
  'Converter um arquivo apenas trocando a extensão do nome.',
];

// ---------------------------------------------------------------------------
// Parte 1 — Conhecendo o computador
// ---------------------------------------------------------------------------

const CAP_1: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Capítulo 1 — O computador como escritório digital',
    pages: '6–7',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Entenda o que o computador faz e aprenda a diferenciar equipamento, programa e Windows.',
    },
    { kind: 'heading', text: 'O que um computador faz' },
    {
      kind: 'paragraph',
      text: 'Um computador é uma máquina que ajuda a trabalhar com informações. Ele pode receber um texto digitado, fazer um cálculo, guardar um documento e mostrar o resultado na tela.',
    },
    {
      kind: 'analogy',
      text: 'Ao fazer um bolo, os ingredientes entram, a receita orienta o preparo, o bolo pode ser guardado e, no fim, é servido. O computador também recebe, trabalha, guarda e entrega um resultado.',
    },
    {
      kind: 'steps',
      items: [
        'Entrada: a informação chega pelo teclado, mouse, câmera, microfone ou scanner.',
        'Processamento: o programa trabalha com a informação.',
        'Armazenamento: o conteúdo é guardado como arquivo.',
        'Saída: o resultado aparece na tela, no som ou na impressora.',
      ],
    },
    { kind: 'heading', text: 'Hardware, software e Windows' },
    {
      kind: 'analogy',
      text: 'O hardware é como os móveis e equipamentos de um escritório. Os programas são as ferramentas de trabalho. O Windows é como a pessoa que organiza a sala e entrega cada ferramenta quando ela é necessária.',
    },
    {
      kind: 'table',
      headers: ['Nome', 'Explicação fácil', 'Exemplos'],
      rows: [
        [
          'Hardware',
          'Parte física: podemos tocar.',
          'Teclado, mouse, monitor, notebook, impressora',
        ],
        [
          'Software',
          'Programa ou instrução usada pelo computador.',
          'Navegador, Word, Excel, aplicativo de desenho',
        ],
        [
          'Windows',
          'Sistema principal que organiza o computador.',
          'Abre programas, controla janelas e ajuda a encontrar arquivos',
        ],
      ],
    },
    { kind: 'heading', text: 'Quando algo não funciona' },
    {
      kind: 'paragraph',
      text: 'Em vez de dizer apenas "o computador quebrou", observe o que aconteceu. Isso ajuda você e quem oferece suporte.',
    },
    {
      kind: 'list',
      items: [
        'O problema acontece em um único programa ou em todos?',
        'A internet parou ou o computador inteiro parou?',
        'Existe alguma mensagem na tela? Anote ou faça uma captura sem mostrar dados pessoais.',
        'O cabo, o volume ou a energia estão conectados corretamente?',
      ],
    },
    {
      kind: 'warning',
      text: 'Não desmonte equipamentos e não force o desligamento sem orientação. Em escola ou empresa, peça ajuda ao responsável.',
    },
    { kind: 'heading', text: 'Pratique agora' },
    {
      kind: 'paragraph',
      text: 'Olhe ao redor e encontre três exemplos de hardware. Depois, cite três programas que você já viu. Por fim, explique com suas palavras para que serve o Windows.',
    },
  ],
  summary: [
    'Hardware é a parte que podemos tocar; software é o conjunto de programas.',
    'O Windows organiza programas, arquivos e equipamentos.',
    'O computador recebe informações, trabalha com elas, guarda e mostra resultados.',
  ],
};

const CAP_2: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Capítulo 2 — Mouse, teclado e interação sem medo',
    pages: '8–9',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Aprenda os movimentos e as teclas que ajudam a conversar com o computador.',
    },
    { kind: 'heading', text: 'O mouse é como um dedo na tela' },
    {
      kind: 'warning',
      text: 'Se o computador estiver demorando, não clique muitas vezes. Aguarde alguns segundos para não abrir várias janelas sem querer.',
    },
    {
      kind: 'table',
      headers: ['Ação', 'O que costuma fazer', 'Dica'],
      rows: [
        ['Um clique', 'Seleciona um item ou aperta um botão.', 'Clique uma vez e observe.'],
        [
          'Duplo clique',
          'Normalmente abre arquivo, pasta ou programa.',
          'Faça dois cliques rápidos no mesmo lugar.',
        ],
        ['Botão direito', 'Mostra opções para o item escolhido.', 'Leia o menu antes de clicar.'],
        [
          'Arrastar',
          'Leva um item ou seleciona uma área.',
          'Mantenha o botão pressionado e mova devagar.',
        ],
        [
          'Rolar',
          'Move a página para cima ou para baixo.',
          'Use a rodinha ou dois dedos no touchpad.',
        ],
      ],
    },
    { kind: 'heading', text: 'Seleção e cursor' },
    {
      kind: 'paragraph',
      text: 'Seleção é a forma de dizer "quero trabalhar com este item". O item selecionado pode mudar de cor ou ganhar um contorno. No texto, o cursor é a pequena linha que pisca: ela mostra onde a próxima letra aparecerá.',
    },
    {
      kind: 'analogy',
      text: 'Antes de entregar um caderno a alguém, você aponta qual caderno é. Selecionar faz o mesmo dentro da tela.',
    },
    { kind: 'heading', text: 'Teclas especiais mais úteis' },
    {
      kind: 'table',
      headers: ['Tecla', 'Função mais comum'],
      rows: [
        ['Enter', 'Confirma uma ação ou cria um novo parágrafo.'],
        ['Tab', 'Avança para o próximo campo de um formulário.'],
        ['Shift + Tab', 'Volta ao campo anterior.'],
        ['Esc', 'Cancela ou fecha um pequeno menu.'],
        ['Backspace', 'Apaga o caractere à esquerda do cursor.'],
        ['Delete', 'Apaga o item selecionado ou o caractere à direita.'],
        ['Shift', 'Faz uma letra maiúscula temporária ou acessa o símbolo superior.'],
        ['Caps Lock', 'Mantém as letras maiúsculas ligadas até ser desligado.'],
      ],
    },
    { kind: 'heading', text: 'Conforto e acessibilidade' },
    {
      kind: 'paragraph',
      text: 'Se estiver difícil enxergar ou controlar o ponteiro, isso não significa que você não sabe usar o computador. O Windows permite aumentar textos, ponteiro e contraste, além de oferecer lupa, teclado virtual e leitor de tela.',
    },
    {
      kind: 'list',
      items: [
        'Abra Configurações e procure por Acessibilidade.',
        'Ajuste tamanho do texto e do ponteiro até a leitura ficar confortável.',
        'Faça pausas, mantenha os braços apoiados e evite forçar a visão.',
      ],
    },
    { kind: 'heading', text: 'Pratique agora' },
    {
      kind: 'paragraph',
      text: 'Abra uma pasta de treinamento. Selecione um item com um clique, abra-o com duplo clique e veja suas opções com o botão direito. Em um formulário de teste, avance com Tab e volte com Shift + Tab.',
    },
  ],
  summary: [
    'Um clique seleciona; o duplo clique normalmente abre; o botão direito mostra opções.',
    'O item selecionado é aquele que receberá a próxima ação.',
    'Teclas como Enter, Tab, Esc, Backspace e Delete têm funções diferentes.',
  ],
};

const CAP_3: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Capítulo 3 — Conhecendo o Windows e suas janelas',
    pages: '10–11',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Use a Área de Trabalho, o Menu Iniciar e a barra de tarefas para abrir e organizar programas.',
    },
    { kind: 'heading', text: 'Os espaços principais do Windows' },
    {
      kind: 'analogy',
      text: 'A Área de Trabalho é o tampo da mesa. A barra de tarefas é a bandeja com o que está em uso. O Menu Iniciar é o armário onde você procura uma ferramenta.',
    },
    {
      kind: 'table',
      headers: ['Espaço', 'Para que serve'],
      rows: [
        [
          'Área de Trabalho',
          'Tela principal. Use-a como apoio temporário, não como depósito de tudo.',
        ],
        ['Menu Iniciar', 'Abre aplicativos, pesquisa, configurações e opções de energia.'],
        ['Barra de tarefas', 'Mostra programas fixados e programas que estão abertos.'],
        ['Área de notificações', 'Mostra relógio, internet, som, bateria e avisos.'],
        ['Configurações', 'Ajusta tela, som, rede, contas e acessibilidade.'],
      ],
    },
    { kind: 'heading', text: 'Abra um programa pela pesquisa' },
    {
      kind: 'steps',
      items: [
        'Pressione a tecla Windows.',
        'Digite parte do nome, como Calculadora.',
        'Confira se o resultado é o aplicativo esperado.',
        'Pressione Enter ou clique no aplicativo.',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Esse caminho é mais fácil que procurar o ícone em várias telas. Você também pode pesquisar por Explorador de Arquivos, Bloco de Notas ou Configurações.',
    },
    { kind: 'heading', text: 'Entenda os botões de uma janela' },
    {
      kind: 'analogy',
      text: 'Minimizar é colocar uma folha na bandeja para usar depois. Fechar é terminar o trabalho com aquela folha e tirá-la da mesa.',
    },
    {
      kind: 'table',
      headers: ['Ação', 'O que acontece'],
      rows: [
        ['Minimizar', 'A janela some da frente, mas continua aberta na barra de tarefas.'],
        ['Maximizar', 'A janela ocupa quase toda a tela.'],
        ['Restaurar', 'A janela volta ao tamanho anterior.'],
        ['Fechar', 'A janela é encerrada; pode aparecer uma pergunta para salvar.'],
      ],
    },
    { kind: 'heading', text: 'Use duas janelas' },
    {
      kind: 'steps',
      items: [
        'Abra os dois programas que deseja usar.',
        'Ative a primeira janela.',
        'Pressione Windows + Seta para a esquerda.',
        'Escolha a segunda janela para ocupar o outro lado.',
      ],
    },
    {
      kind: 'tip',
      text: 'Para trocar rapidamente de janela, mantenha Alt pressionado, toque em Tab até chegar ao programa desejado e solte Alt.',
    },
    { kind: 'heading', text: 'Se um programa parecer travado' },
    {
      kind: 'list',
      items: [
        'Aguarde alguns segundos; o programa pode estar terminando uma tarefa.',
        'Veja se outras janelas ainda respondem.',
        'Evite apertar o mesmo botão muitas vezes.',
        'Em escola ou empresa, avise o responsável antes de desligar à força.',
      ],
    },
    { kind: 'heading', text: 'Pratique agora' },
    {
      kind: 'paragraph',
      text: 'Abra Calculadora e Bloco de Notas. Minimize e restaure uma janela, troque entre as duas com Alt + Tab e coloque-as lado a lado.',
    },
  ],
  summary: [
    'O Menu Iniciar e a pesquisa ajudam a encontrar aplicativos e configurações.',
    'Minimizar guarda a janela por um momento; fechar encerra seu uso.',
    'Duas janelas lado a lado facilitam comparações e cópias.',
  ],
};

// ---------------------------------------------------------------------------
// Parte 2 — Cuidando dos arquivos
// ---------------------------------------------------------------------------

const CAP_4: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Capítulo 4 — Arquivos, pastas e tipos de documento',
    pages: '13–14',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Descubra onde os documentos ficam e o que partes como .docx, .xlsx e .pdf significam.',
    },
    { kind: 'heading', text: 'Documento, gaveta e endereço' },
    {
      kind: 'analogy',
      text: 'O arquivo é uma folha. A pasta é uma gaveta. O caminho é o endereço que leva até a gaveta. A extensão é a etiqueta que informa o tipo do documento.',
    },
    {
      kind: 'table',
      headers: ['Conceito', 'Explicação fácil'],
      rows: [
        ['Arquivo', 'Guarda um conteúdo, como texto, planilha, imagem ou PDF.'],
        ['Pasta', 'Agrupa arquivos e outras pastas.'],
        ['Caminho', 'Mostra o endereço completo de um item.'],
        ['Extensão', 'Final do nome que ajuda a reconhecer o tipo do arquivo.'],
        ['Atalho', 'Caminho rápido que aponta para outro item.'],
        ['Propriedades', 'Informações como tamanho, localização e data.'],
      ],
    },
    { kind: 'heading', text: 'Leia um caminho de arquivo' },
    {
      kind: 'paragraph',
      text: 'No caminho Documentos > Financeiro > 2026 > Boletos > Energia_Julho_2026.pdf, cada parte indica uma gaveta dentro da anterior. O último item é o arquivo, e .pdf mostra seu formato.',
    },
    {
      kind: 'list',
      items: [
        'Documentos é o local principal.',
        'Financeiro, 2026 e Boletos são pastas.',
        'Energia_Julho_2026 é o nome do arquivo.',
        '.pdf é a extensão.',
      ],
    },
    { kind: 'heading', text: 'Formatos comuns' },
    {
      kind: 'warning',
      text: 'Não transforme um arquivo apenas trocando o final do nome. Para criar um PDF, use Exportar, Salvar como PDF ou Imprimir em PDF.',
    },
    {
      kind: 'table',
      headers: ['Extensão', 'Conteúdo comum', 'Uso simples'],
      rows: [
        ['.docx', 'Documento de texto editável', 'Cartas, relatórios e comunicados'],
        ['.xlsx', 'Planilha editável', 'Controles, listas e cálculos'],
        ['.pptx', 'Apresentação editável', 'Aulas e reuniões'],
        ['.pdf', 'Documento com aparência preservada', 'Leitura, envio e impressão'],
        ['.txt', 'Texto simples', 'Anotações rápidas'],
        ['.jpg ou .png', 'Imagem', 'Foto, captura de tela ou ilustração'],
        ['.zip', 'Pacote compactado', 'Vários arquivos reunidos'],
        ['.csv', 'Dados em linhas e colunas', 'Troca de dados entre sistemas'],
      ],
    },
    { kind: 'heading', text: 'Pratique agora' },
    {
      kind: 'paragraph',
      text: 'Escolha cinco arquivos de treinamento. Para cada um, identifique o nome, a extensão, a pasta onde está e a data de modificação.',
    },
  ],
  summary: [
    'Arquivo guarda conteúdo; pasta organiza arquivos e outras pastas.',
    'O caminho mostra o endereço completo de um item.',
    'A extensão ajuda a reconhecer o tipo do arquivo; trocar apenas o nome não converte o formato.',
  ],
};

const CAP_5: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Capítulo 5 — Organizando itens no Explorador de Arquivos',
    pages: '15–16',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Crie pastas e aprenda a copiar, mover, renomear, excluir e restaurar itens com segurança.',
    },
    { kind: 'heading', text: 'Abra e navegue pelo Explorador' },
    {
      kind: 'paragraph',
      text: 'O Explorador de Arquivos é o lugar usado para localizar e organizar documentos. Pressione Windows + E para abri-lo.',
    },
    {
      kind: 'steps',
      items: [
        'Observe o painel lateral com locais como Documentos e Downloads.',
        'Clique em uma pasta para ver o que existe dentro dela.',
        'Use a seta Voltar para retornar ao local anterior.',
        'Confira o caminho antes de alterar um item.',
      ],
    },
    { kind: 'heading', text: 'Selecione um ou vários itens' },
    {
      kind: 'table',
      headers: ['Objetivo', 'Ação'],
      rows: [
        ['Um item', 'Clique uma vez.'],
        ['Todos os itens', 'Pressione Ctrl + A.'],
        ['Itens separados', 'Segure Ctrl e clique em cada item.'],
        ['Um intervalo', 'Clique no primeiro, segure Shift e clique no último.'],
      ],
    },
    { kind: 'heading', text: 'Crie e renomeie uma pasta' },
    {
      kind: 'steps',
      items: [
        'Abra o local em que a pasta deve ficar.',
        'Pressione Ctrl + Shift + N ou use botão direito > Novo > Pasta.',
        'Digite um nome claro.',
        'Pressione Enter para confirmar.',
        'Para mudar o nome depois, selecione a pasta e pressione F2.',
      ],
    },
    { kind: 'heading', text: 'Copiar ou mover?' },
    {
      kind: 'analogy',
      text: 'Copiar é tirar uma fotocópia. Mover é retirar uma pasta de um armário e colocá-la em outro.',
    },
    {
      kind: 'warning',
      text: 'Antes de mover, pergunte: o item também precisa continuar no local atual? Se a resposta for sim, copie.',
    },
    {
      kind: 'table',
      headers: ['Ação', 'O que acontece', 'Atalhos'],
      rows: [
        ['Copiar', 'Cria outra cópia; o original continua no lugar.', 'Ctrl + C e Ctrl + V'],
        ['Mover', 'Troca o item de lugar; continua existindo apenas um.', 'Ctrl + X e Ctrl + V'],
      ],
    },
    { kind: 'heading', text: 'Excluir e restaurar' },
    {
      kind: 'warning',
      text: 'Evite Shift + Delete enquanto estiver aprendendo, pois essa ação pode pular a Lixeira. Nunca esvazie a Lixeira de uma escola ou empresa sem autorização.',
    },
    {
      kind: 'steps',
      items: [
        'Selecione o item de treinamento e pressione Delete.',
        'Abra a Lixeira.',
        'Localize e selecione o item.',
        'Use o botão direito e escolha Restaurar.',
        'Confira se ele voltou ao local original.',
      ],
    },
    { kind: 'heading', text: 'Pratique agora' },
    {
      kind: 'paragraph',
      text: 'Crie a pasta Treinamento_Administrativo. Copie três arquivos para ela, renomeie um, mova outro para uma subpasta, exclua o terceiro e restaure-o.',
    },
  ],
  summary: [
    'Copiar cria outra cópia; mover troca o item de lugar.',
    'Renomear muda a etiqueta, não o conteúdo.',
    'A Lixeira pode recuperar muitos itens excluídos, mas não substitui um backup.',
  ],
};

const CAP_6: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Capítulo 6 — Pastas e nomes que todos entendem',
    pages: '17–18',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Monte uma organização simples para encontrar o documento certo sem depender da memória.',
    },
    { kind: 'heading', text: 'As três perguntas de uma boa organização' },
    {
      kind: 'steps',
      items: [
        'O que é este documento?',
        'A qual assunto, pessoa, processo ou período ele pertence?',
        'Esta é a versão correta?',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Se o nome e a pasta respondem essas perguntas, outra pessoa consegue encontrar o arquivo mesmo quando você não está por perto.',
    },
    { kind: 'heading', text: 'Uma estrutura simples' },
    {
      kind: 'paragraph',
      text: 'Comece com poucas pastas e crie novos níveis apenas quando forem realmente úteis.',
    },
    {
      kind: 'table',
      headers: ['Caminho sugerido', 'O que guardar'],
      rows: [
        [
          'Administrativo > 01_Financeiro > 2026 > 07_Julho',
          'Boletos, notas e comprovantes de julho',
        ],
        [
          'Administrativo > 02_Recursos_Humanos > Colaboradores',
          'Documentos de colaboradores com acesso restrito',
        ],
        ['Administrativo > 03_Fornecedores > Ativos', 'Cadastros e contratos vigentes'],
        ['Administrativo > 99_Temporarios', 'Itens de passagem que serão revisados toda semana'],
      ],
    },
    { kind: 'heading', text: 'Dê nomes claros aos arquivos' },
    {
      kind: 'template',
      label: 'Padrão de nome',
      text: 'Data_Tipo_Assunto_Versão.extensão',
    },
    {
      kind: 'tip',
      text: 'Use datas como 2026-07-31. Nesse formato, os arquivos ficam naturalmente em ordem do mais antigo para o mais novo.',
    },
    {
      kind: 'list',
      items: [
        '2026-07-31_Ata_Reuniao_Comercial_v01.docx',
        '2026-07_Controle_Despesas_v03.xlsx',
        '2026-07-15_Contrato_Fornecedor_Alfa_ASSINADO.pdf',
      ],
    },
    { kind: 'heading', text: 'Regras fáceis de lembrar' },
    {
      kind: 'list',
      items: [
        'Use nomes curtos, mas específicos.',
        'Evite documento-novo, final2 e agora-final.',
        'Durante a edição, use versões como v01, v02 e v03.',
        'Quando necessário, marque RASCUNHO, APROVADO ou ASSINADO.',
        'Não crie muitas pastas dentro de pastas.',
        'Não coloque dados pessoais em vários lugares sem necessidade.',
      ],
    },
    { kind: 'heading', text: 'Rotina de cinco minutos' },
    {
      kind: 'steps',
      items: [
        'Abra Downloads e a pasta Temporários.',
        'Exclua somente o que você tem certeza de que não é necessário.',
        'Renomeie os arquivos importantes.',
        'Mova cada item para a pasta correta.',
        'Confirme se os documentos principais estão em local autorizado e protegido.',
      ],
    },
    { kind: 'heading', text: 'Pratique agora' },
    {
      kind: 'paragraph',
      text: 'Organize dez arquivos fictícios usando no máximo quatro níveis de pastas. Depois, peça para outra pessoa encontrar um deles apenas pelo nome e pela estrutura criada.',
    },
  ],
  summary: [
    'Uma boa pasta responde onde o documento pertence; um bom nome diz o que ele é.',
    'Datas no formato ano-mês-dia ficam em ordem com facilidade.',
    'Versões como v01 e v02 são mais claras que nomes como final2 ou agora-vai.',
  ],
};

const CAP_7: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Capítulo 7 — Salvar, baixar, anexar, compartilhar e criar PDF',
    pages: '19–20',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Leve arquivos de um lugar para outro e confira tudo antes de enviar.',
    },
    { kind: 'heading', text: 'Palavras que parecem iguais, mas não são' },
    {
      kind: 'analogy',
      text: 'Anexo é colocar uma cópia em um envelope. Link é entregar o endereço do armário onde o arquivo está. Quem recebe o endereço ainda precisa ter permissão para abrir a porta.',
    },
    {
      kind: 'table',
      headers: ['Ação', 'Explicação fácil'],
      rows: [
        ['Salvar', 'Registra as mudanças no mesmo arquivo.'],
        ['Salvar como', 'Cria outro arquivo ou escolhe novo nome, local ou formato.'],
        ['Download', 'Traz um arquivo da internet ou sistema para o dispositivo.'],
        ['Upload', 'Envia um arquivo do dispositivo para um site ou sistema.'],
        ['Anexo', 'Envia uma cópia dentro da mensagem.'],
        ['Link', 'Entrega o endereço do arquivo guardado em outro local.'],
        ['Permissão', 'Define se alguém pode ver, comentar ou editar.'],
        ['Exportar para PDF', 'Cria uma versão com aparência mais estável para leitura.'],
      ],
    },
    { kind: 'heading', text: 'Cuide de um arquivo baixado' },
    {
      kind: 'tip',
      text: 'Downloads é uma caixa de entrada, não o armário definitivo. Organize o que chegou.',
    },
    {
      kind: 'steps',
      items: [
        'Antes de baixar, confirme quem enviou e por quê.',
        'Localize o item na pasta Downloads.',
        'Confira o nome e o tipo do arquivo.',
        'Abra somente se a origem e o tipo forem esperados.',
        'Renomeie usando o padrão combinado.',
        'Mova o arquivo para a pasta definitiva.',
      ],
    },
    { kind: 'heading', text: 'Antes de enviar um anexo ou link' },
    {
      kind: 'steps',
      items: [
        'Confirme o destinatário.',
        'Confira se escolheu o arquivo correto.',
        'Abra o anexo ou teste o link.',
        'Veja se existem dados pessoais ou confidenciais.',
        'Confirme se a versão é a certa.',
        'No link, conceda apenas a permissão necessária.',
        'Leia a mensagem uma última vez e só então envie.',
      ],
    },
    { kind: 'heading', text: 'Crie um PDF sem perder o editável' },
    {
      kind: 'paragraph',
      text: 'Mantenha o arquivo editável, como .docx ou .xlsx, para mudanças futuras. Gere uma cópia em PDF quando desejar preservar melhor a aparência para leitura ou impressão.',
    },
    {
      kind: 'warning',
      text: 'PDF não é uma proteção absoluta. Informações sensíveis ainda precisam de permissões e canais autorizados.',
    },
    {
      kind: 'steps',
      items: [
        'Abra o documento e salve as últimas alterações.',
        'Use Exportar ou Salvar como PDF no programa.',
        'Escolha o nome e a pasta corretos.',
        'Abra o PDF criado e confira todas as páginas.',
        'Envie apenas depois da revisão.',
      ],
    },
    { kind: 'heading', text: 'Pratique agora' },
    {
      kind: 'paragraph',
      text: 'Crie um documento de teste, preserve o original editável, gere um PDF e simule a conferência do destinatário, do arquivo e da permissão.',
    },
  ],
  summary: [
    'Salvar atualiza o arquivo; Salvar como cria uma nova versão, nome, local ou formato.',
    'Download traz um arquivo; upload envia um arquivo.',
    'Anexos são cópias; links apontam para um arquivo e dependem de permissão.',
  ],
};

// ---------------------------------------------------------------------------
// Parte 3 — Rapidez, recuperação e segurança
// ---------------------------------------------------------------------------

const CAP_8: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Capítulo 8 — Pesquisa e atalhos que economizam tempo',
    pages: '22–23',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Encontre arquivos e aprenda poucos atalhos por vez, sempre entendendo o que eles fazem.',
    },
    { kind: 'heading', text: 'Encontre um arquivo' },
    {
      kind: 'analogy',
      text: 'A pesquisa é o índice do armário digital. Ela funciona muito melhor quando as etiquetas dos documentos são claras.',
    },
    {
      kind: 'steps',
      items: [
        'Pesquise uma palavra específica do nome.',
        'Se houver muitos resultados, acrescente assunto, pessoa ou período.',
        'Quando souber o formato, use .pdf, .docx ou .xlsx na pesquisa.',
        'Ordene por data de modificação para procurar itens recentes.',
        'Confira o caminho antes de abrir ou alterar.',
      ],
    },
    { kind: 'heading', text: 'Atalhos para aprender primeiro' },
    {
      kind: 'warning',
      text: 'Confira a janela ativa e o item selecionado antes de usar um atalho. O comando será aplicado exatamente ali.',
    },
    {
      kind: 'table',
      headers: ['Atalho', 'Ação'],
      rows: [
        ['Ctrl + C', 'Copiar texto ou arquivo'],
        ['Ctrl + V', 'Colar o que foi copiado'],
        ['Ctrl + X', 'Recortar para mover'],
        ['Ctrl + Z', 'Desfazer a última ação quando permitido'],
        ['Ctrl + S', 'Salvar alterações'],
        ['Ctrl + A', 'Selecionar tudo'],
        ['Alt + Tab', 'Trocar de janela'],
        ['Windows + E', 'Abrir o Explorador de Arquivos'],
        ['Windows + S', 'Abrir a pesquisa'],
        ['Windows + L', 'Bloquear o computador'],
        ['Windows + Shift + S', 'Capturar uma parte da tela'],
        ['F2', 'Renomear o item selecionado'],
        ['Ctrl + Shift + N', 'Criar uma nova pasta'],
      ],
    },
    { kind: 'heading', text: 'Aprenda aos poucos' },
    {
      kind: 'paragraph',
      text: 'Use cada atalho em uma tarefa real. Repetição com sentido ensina melhor que tentar decorar uma lista inteira.',
    },
    {
      kind: 'list',
      items: [
        'Primeiros dias: Ctrl + C, Ctrl + V, Ctrl + S e Alt + Tab.',
        'Depois: Windows + E, Windows + S, Windows + L e F2.',
        'Quando estiver confortável: Ctrl + Z, Ctrl + A, captura de tela e encaixe de janelas.',
      ],
    },
    { kind: 'heading', text: 'Captura de tela com cuidado' },
    {
      kind: 'paragraph',
      text: 'Windows + Shift + S permite capturar apenas uma região. Isso é útil para mostrar um erro ao suporte.',
    },
    {
      kind: 'warning',
      text: 'Antes de enviar a imagem, confira se ela mostra senha, CPF, salário, endereço, conversa particular ou outro dado desnecessário.',
    },
    { kind: 'heading', text: 'Pratique agora' },
    {
      kind: 'paragraph',
      text: 'Sem usar menus, tente copiar, colar, salvar, trocar de janela, abrir o Explorador, criar uma pasta, renomear um item e bloquear a tela.',
    },
  ],
  summary: [
    'A pesquisa funciona melhor quando arquivos têm nomes claros.',
    'Ctrl + C, Ctrl + V, Ctrl + S e Alt + Tab são um ótimo começo.',
    'Antes de usar um atalho, confira qual janela ou item está ativo.',
  ],
};

const CAP_9: LessonContent = {
  reference: { module: EBOOK, chapter: 'Capítulo 9 — Nuvem, backup e recuperação', pages: '24–25' },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Entenda onde os arquivos ficam e o que fazer quando algo parece ter desaparecido.',
    },
    { kind: 'heading', text: 'Onde um arquivo pode ficar' },
    {
      kind: 'table',
      headers: ['Local', 'Explicação fácil', 'Cuidado principal'],
      rows: [
        [
          'Computador',
          'Arquivo guardado no próprio dispositivo.',
          'Pode ficar indisponível se o aparelho falhar.',
        ],
        [
          'Dispositivo externo',
          'Arquivo em pendrive ou HD externo.',
          'Pode ser perdido, danificado ou não ser autorizado.',
        ],
        [
          'Nuvem',
          'Arquivo em serviço acessado pela internet.',
          'Exige conta, permissão e serviço autorizado.',
        ],
      ],
    },
    { kind: 'heading', text: 'Sincronização não é backup' },
    {
      kind: 'analogy',
      text: 'Sincronização é como dois quadros brancos ligados: apagar em um pode apagar no outro. Backup é uma foto do quadro guardada em outro lugar.',
    },
    {
      kind: 'table',
      headers: ['Sincronização', 'Backup'],
      rows: [
        ['Mantém locais conectados e atualizados.', 'Mantém uma cópia separada para recuperação.'],
        [
          'Uma exclusão pode aparecer em todos os locais.',
          'A cópia pode permitir recuperar algo perdido.',
        ],
        [
          'Ajuda a trabalhar em mais de um dispositivo.',
          'Ajuda a voltar depois de erro, falha ou perda.',
        ],
      ],
    },
    { kind: 'heading', text: 'Se um arquivo desaparecer' },
    {
      kind: 'steps',
      items: [
        'Pesquise pelo nome; o arquivo pode ter sido movido ou renomeado.',
        'Confira a Lixeira do Windows.',
        'Se houver nuvem, confira também a lixeira do serviço.',
        'Procure o histórico de versões, quando disponível.',
        'Peça ajuda ao suporte ou responsável pelo backup.',
        'Evite criar outro arquivo com o mesmo nome antes de entender o que aconteceu.',
      ],
    },
    { kind: 'heading', text: 'Uma regra para documentos importantes' },
    {
      kind: 'warning',
      text: 'Não copie documentos de empresa para e-mail pessoal, conta particular ou pendrive sem autorização.',
    },
    {
      kind: 'list',
      items: [
        'Guarde o arquivo de trabalho em um local autorizado.',
        'Use versionamento ou cópia de segurança em outro meio autorizado.',
        'Saiba quem pode restaurar e como pedir a recuperação.',
        'Teste o processo de restauração quando a organização permitir.',
      ],
    },
    { kind: 'heading', text: 'Pratique agora' },
    {
      kind: 'paragraph',
      text: 'Desenhe três caixas: arquivo principal, sincronização e backup. Explique em qual caixa ficaria um contrato importante e o que aconteceria se ele fosse apagado.',
    },
  ],
  summary: [
    'Arquivos podem ficar no computador, em um dispositivo externo ou na nuvem.',
    'Sincronização mantém locais conectados; backup cria uma cópia para recuperação.',
    'Pesquise, confira lixeiras e histórico de versões antes de desistir de um arquivo.',
  ],
};

const CAP_10: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Capítulo 10 — Segurança digital para todos',
    pages: '26–27',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Proteja sua conta, seus documentos e outras pessoas com hábitos simples.',
    },
    { kind: 'heading', text: 'Três cuidados com a informação' },
    {
      kind: 'table',
      headers: ['Cuidado', 'Pergunta simples'],
      rows: [
        ['Confidencialidade', 'Somente pessoas autorizadas conseguem ver?'],
        ['Integridade', 'O conteúdo está correto e sem mudanças indevidas?'],
        ['Disponibilidade', 'O documento estará acessível quando for necessário?'],
      ],
    },
    { kind: 'heading', text: 'Proteja sua conta e sua tela' },
    {
      kind: 'analogy',
      text: 'A senha é a chave da porta. A autenticação em duas etapas é como usar chave e crachá. Bloquear a tela é fechar a porta ao sair.',
    },
    {
      kind: 'list',
      items: [
        'Use uma senha diferente em cada serviço e nunca compartilhe a senha.',
        'Ative a autenticação em duas etapas quando estiver disponível.',
        'Não informe códigos recebidos por mensagem ou aplicativo.',
        'Pressione Windows + L ao se afastar do computador.',
        'Em dispositivo compartilhado, saia da conta ao terminar.',
      ],
    },
    { kind: 'heading', text: 'Antes de abrir um link ou anexo' },
    {
      kind: 'warning',
      text: 'Uma mensagem pode usar o nome ou a foto de alguém conhecido. Confirme pedidos inesperados por telefone, pessoalmente ou pelo canal oficial.',
    },
    {
      kind: 'steps',
      items: [
        'Eu esperava receber esta mensagem?',
        'Conheço a pessoa e o endereço do remetente parece correto?',
        'A mensagem tenta criar medo, pressa ou curiosidade exagerada?',
        'Ela pede senha, código, dinheiro ou dados pessoais?',
        'O nome e o tipo do arquivo fazem sentido?',
        'Posso confirmar o pedido por outro canal?',
      ],
    },
    { kind: 'heading', text: 'O que fazer quando desconfiar' },
    {
      kind: 'steps',
      items: [
        'Não clique, não abra e não responda com dados.',
        'Guarde a mensagem para análise.',
        'Avise o responsável, professor, gestor ou suporte.',
        'Se você já clicou ou informou algo, conte imediatamente. Pedir ajuda rápido reduz o problema.',
      ],
    },
    {
      kind: 'tip',
      text: 'Crianças e adolescentes devem pedir ajuda a um adulto responsável antes de criar contas, instalar programas, fazer compras, conversar com desconhecidos ou enviar informações pessoais.',
    },
    { kind: 'heading', text: 'Compartilhe somente o necessário' },
    {
      kind: 'list',
      items: [
        'Dê acesso apenas a quem realmente precisa.',
        'Use permissão de leitura quando edição não for necessária.',
        'Confira destinatário, anexo e link antes de enviar.',
        'Evite mostrar dados pessoais em capturas de tela.',
        'Remova acessos quando a atividade ou o projeto terminar.',
      ],
    },
    { kind: 'heading', text: 'Pratique agora' },
    {
      kind: 'paragraph',
      text: 'Leia três mensagens fictícias: uma esperada, uma urgente pedindo senha e uma com anexo desconhecido. Para cada uma, diga o que parece normal, o que causa dúvida e com quem você confirmaria.',
    },
  ],
  summary: [
    'Bloqueie a tela ao se afastar e use autenticação em duas etapas quando disponível.',
    'Desconfie de pedidos inesperados, urgentes ou que solicitam senha, dinheiro ou códigos.',
    'Na dúvida, pare e confirme com um adulto responsável, professor, gestor ou suporte.',
  ],
};

const GUIA_RAPIDO: LessonContent = {
  reference: {
    module: EBOOK,
    chapter: 'Guia rápido, glossário e Referências oficiais',
    pages: '30–32',
  },
  blocks: [
    {
      kind: 'paragraph',
      text: 'Use esta seção quando precisar lembrar uma ação, um atalho ou uma palavra.',
    },
    { kind: 'heading', text: 'Checklist de autonomia' },
    {
      kind: 'list',
      items: [
        'Diferenciar hardware, software e Windows.',
        'Usar clique, duplo clique, botão direito e rolagem.',
        'Abrir programas e organizar duas janelas.',
        'Diferenciar arquivo, pasta, caminho, extensão e atalho.',
        'Criar, copiar, mover, renomear, excluir e restaurar itens.',
        'Criar pastas e nomes fáceis de entender.',
        'Diferenciar salvar, salvar como, download, upload, anexo e link.',
        'Gerar e conferir um PDF.',
        'Pesquisar arquivos e usar os atalhos principais.',
        'Explicar a diferença entre sincronização e backup.',
        'Reconhecer sinais básicos de uma mensagem suspeita.',
        'Conferir destinatário, arquivo e permissão antes de compartilhar.',
      ],
    },
    { kind: 'heading', text: 'Glossário simples' },
    {
      kind: 'table',
      headers: ['Palavra', 'Significado'],
      rows: [
        ['Aplicativo ou programa', 'Ferramenta digital criada para realizar uma tarefa.'],
        ['Área de Trabalho', 'Tela principal do Windows.'],
        ['Atalho', 'Acesso rápido para item, programa ou comando.'],
        ['Backup', 'Cópia separada usada para recuperação.'],
        ['Barra de tarefas', 'Área que mostra programas fixados e abertos.'],
        ['Caminho', 'Endereço que leva até um arquivo ou pasta.'],
        ['Cursor', 'Marca que mostra onde a próxima letra será digitada.'],
        ['Download', 'Transferência de um sistema ou da internet para o dispositivo.'],
        ['Extensão', 'Parte final do nome que indica o formato do arquivo.'],
        ['Hardware', 'Parte física do computador.'],
        ['Ícone', 'Pequena imagem que representa um item ou comando.'],
        ['Janela', 'Área visual de um programa ou documento aberto.'],
        ['Nuvem', 'Serviço que guarda ou trabalha com dados pela internet.'],
        ['Pasta', 'Recipiente digital usado para organizar itens.'],
        ['PDF', 'Formato comum para leitura e distribuição de documentos.'],
        ['Phishing', 'Tentativa de enganar alguém para obter dados, dinheiro ou acesso.'],
        ['Sincronização', 'Atualização coordenada de dados entre locais.'],
        ['Software', 'Programa ou conjunto de instruções.'],
        ['Upload', 'Transferência do dispositivo para um sistema ou serviço.'],
        ['Windows', 'Sistema que organiza programas, arquivos e equipamentos.'],
      ],
    },
    { kind: 'heading', text: 'Referências oficiais' },
    {
      kind: 'paragraph',
      text: 'Os procedimentos deste módulo foram conferidos com materiais oficiais da Microsoft. A posição de alguns botões pode mudar entre versões do Windows, mas o objetivo de cada ação permanece o mesmo.',
    },
    {
      kind: 'list',
      items: [
        'Atalhos do teclado no Windows',
        'Explorador de Arquivos no Windows',
        'Restaurar arquivos ou pastas excluídos no OneDrive',
        'Fazer backup e restaurar com o Histórico de Arquivos',
        'Restaurar uma versão anterior no OneDrive',
      ],
    },
    {
      kind: 'paragraph',
      text: 'Os endereços completos estão na última página do e-book, em "Materiais de apoio".',
    },
  ],
};

// ---------------------------------------------------------------------------
// Rubricas
// ---------------------------------------------------------------------------

const RUBRICA_ORGANIZACAO: ActivityRubric = {
  passingScore: 70,
  minWords: 100,
  criticalFailures: FALHAS_CRITICAS,
  criteria: [
    {
      id: 'estrutura-de-pastas',
      title: 'Estrutura de pastas',
      weight: 30,
      whatToObserve:
        'O relato descreve a hierarquia criada, com no máximo quatro níveis e nomes claros.',
    },
    {
      id: 'nomes-de-arquivo',
      title: 'Nomes de arquivo',
      weight: 30,
      whatToObserve: 'Os nomes seguem data, assunto e versão, com data no formato ano-mês-dia.',
    },
    {
      id: 'operacoes',
      title: 'Cópia, movimentação e restauração',
      weight: 25,
      whatToObserve:
        'Copiar, mover, renomear, excluir e restaurar aparecem descritos, sem perda de arquivo.',
    },
    {
      id: 'pdf-e-envio',
      title: 'PDF e conferência antes do envio',
      weight: 15,
      whatToObserve:
        'O editável foi preservado, o PDF conferido e destinatário, arquivo e permissão revisados.',
    },
  ],
};

/**
 * Rubrica do projeto final: pesos e critérios transcritos da tabela
 * "Como avaliar" do e-book (página 29). O texto confirma o corte: "70% ou
 * mais mostra que você já realiza a rotina com poucas consultas".
 */
const RUBRICA_PROJETO_FINAL: ActivityRubric = {
  passingScore: 70,
  minWords: 220,
  criticalFailures: FALHAS_CRITICAS,
  criteria: [
    {
      id: 'pastas',
      title: 'Pastas',
      weight: 15,
      whatToObserve:
        'Estrutura simples e clara, com Administrativo > Financeiro > 2026 > 07_Julho e subpastas.',
    },
    {
      id: 'nomes',
      title: 'Nomes',
      weight: 15,
      whatToObserve: 'Data, assunto e versão identificáveis em cada arquivo renomeado.',
    },
    {
      id: 'operacoes',
      title: 'Operações',
      weight: 20,
      whatToObserve: 'Cópia, movimento, exclusão e restauração realizados sem perda de arquivo.',
    },
    {
      id: 'janelas-e-atalhos',
      title: 'Janelas e atalhos',
      weight: 15,
      whatToObserve:
        'Troca e organização de janelas com segurança, com a planilha e o relatório lado a lado.',
    },
    {
      id: 'salvamento-e-pdf',
      title: 'Salvamento e PDF',
      weight: 15,
      whatToObserve: 'Arquivo editável preservado e PDF gerado e conferido página a página.',
    },
    {
      id: 'seguranca',
      title: 'Segurança',
      weight: 10,
      whatToObserve:
        'Destinatário, dados e permissões revisados; captura sem informação desnecessária.',
    },
    {
      id: 'recuperacao',
      title: 'Recuperação',
      weight: 10,
      whatToObserve: 'Item excluído restaurado pela Lixeira ao local correto.',
    },
  ],
};

// ---------------------------------------------------------------------------
// Aulas com conteúdo, na ordem do e-book
// ---------------------------------------------------------------------------

/** Conteúdo dos capítulos, indexado pelo título da aula. */
const CONTEUDO: Record<string, LessonContent> = {
  'Capítulo 1 — O computador como escritório digital': CAP_1,
  'Capítulo 2 — Mouse, teclado e interação sem medo': CAP_2,
  'Capítulo 3 — Conhecendo o Windows e suas janelas': CAP_3,
  'Capítulo 4 — Arquivos, pastas e tipos de documento': CAP_4,
  'Capítulo 5 — Organizando itens no Explorador de Arquivos': CAP_5,
  'Capítulo 6 — Pastas e nomes que todos entendem': CAP_6,
  'Capítulo 7 — Salvar, baixar, anexar, compartilhar e criar PDF': CAP_7,
  'Capítulo 8 — Pesquisa e atalhos que economizam tempo': CAP_8,
  'Capítulo 9 — Nuvem, backup e recuperação': CAP_9,
  'Capítulo 10 — Segurança digital para todos': CAP_10,
  'Guia rápido, glossário e referências oficiais': GUIA_RAPIDO,
};

/** Rubricas das atividades práticas, indexadas pelo título da aula. */
const RUBRICAS: Record<string, Pick<SeedLesson, 'rubric' | 'rubricReference'>> = {
  'Prática — Organize e envie um documento': {
    rubric: RUBRICA_ORGANIZACAO,
    rubricReference: {
      module: EBOOK,
      chapter: 'Capítulos 5 a 7 — blocos "Pratique agora"',
      pages: '16–20',
    },
  },
  'Projeto final — Organize um pequeno escritório': {
    rubric: RUBRICA_PROJETO_FINAL,
    rubricReference: {
      module: EBOOK,
      chapter: 'Projeto final — Conferência final e Como avaliar',
      pages: '28–29',
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
  'Parte 1 — Conhecendo o computador': FIXACAO('Fixação — Conhecendo o computador', [
    QUESTAO(
      'Qual destes é hardware?',
      'Hardware é a parte física, que podemos tocar: teclado, mouse, monitor, impressora.',
      [
        ['A impressora.', true],
        ['O navegador.', false],
        ['O Windows.', false],
        ['Um arquivo .docx.', false],
      ],
    ),
    QUESTAO(
      'Qual é o papel do Windows?',
      'O Windows é o sistema que organiza programas, arquivos e equipamentos.',
      [
        ['Organizar programas, arquivos e equipamentos.', true],
        ['Criar planilhas e gráficos.', false],
        ['Guardar a energia do computador.', false],
        ['Substituir o teclado.', false],
      ],
    ),
    QUESTAO(
      'O que o botão direito do mouse costuma fazer?',
      'Ele mostra as opções disponíveis para o item escolhido.',
      [
        ['Mostrar opções para o item escolhido.', true],
        ['Abrir o item selecionado.', false],
        ['Excluir o item.', false],
        ['Salvar o arquivo aberto.', false],
      ],
    ),
    QUESTAO(
      'Você minimizou uma janela. O que aconteceu com o programa?',
      'Minimizar tira a janela da frente, mas o programa continua aberto na barra de tarefas.',
      [
        ['Continua aberto, na barra de tarefas.', true],
        ['Foi encerrado.', false],
        ['Foi salvo automaticamente.', false],
        ['Foi movido para a Lixeira.', false],
      ],
    ),
    QUESTAO(
      'Está difícil enxergar o texto na tela. O que o capítulo sugere?',
      'O Windows permite aumentar texto, ponteiro e contraste em Configurações > Acessibilidade.',
      [
        ['Ajustar tamanho do texto e do ponteiro em Acessibilidade.', true],
        ['Comprar um monitor maior antes de continuar.', false],
        ['Aproximar o rosto da tela.', false],
        ['Desistir e pedir para outra pessoa usar.', false],
      ],
    ),
    QUESTAO(
      'Um programa parece travado. Qual é o primeiro passo?',
      'Aguarde alguns segundos: o programa pode estar terminando uma tarefa. Evite clicar várias vezes.',
      [
        ['Aguardar alguns segundos antes de qualquer ação.', true],
        ['Clicar várias vezes no mesmo botão.', false],
        ['Desligar o computador pelo botão de energia.', false],
        ['Desconectar o cabo de força.', false],
      ],
    ),
  ]),

  'Parte 2 — Cuidando dos arquivos': FIXACAO('Fixação — Cuidando dos arquivos', [
    QUESTAO(
      'No caminho Documentos > Financeiro > 2026 > Boletos > Energia_Julho_2026.pdf, o que é ".pdf"?',
      'A extensão é a parte final do nome e indica o formato do arquivo.',
      [
        ['A extensão, que indica o formato.', true],
        ['O nome do arquivo.', false],
        ['A pasta principal.', false],
        ['A data de criação.', false],
      ],
    ),
    QUESTAO(
      'Você renomeou "planilha.xlsx" para "planilha.pdf". O arquivo virou PDF?',
      'Trocar o final do nome não converte o formato. Use Exportar ou Salvar como PDF.',
      [
        ['Não: é preciso exportar ou salvar como PDF pelo programa.', true],
        ['Sim: a extensão define o formato.', false],
        ['Sim, desde que o arquivo seja pequeno.', false],
        ['Só no Windows mais recente.', false],
      ],
    ),
    QUESTAO(
      'Você vai mover um arquivo, mas ele também precisa continuar na pasta atual. O que fazer?',
      'Se o item precisa continuar no local atual, a operação correta é copiar, não mover.',
      [
        ['Copiar em vez de mover.', true],
        ['Mover e depois desfazer.', false],
        ['Criar um atalho e excluir o original.', false],
        ['Renomear antes de mover.', false],
      ],
    ),
    QUESTAO(
      'Qual nome de arquivo segue o padrão recomendado?',
      'O padrão é Data_Tipo_Assunto_Versão, com data no formato ano-mês-dia.',
      [
        ['2026-07-31_Ata_Reuniao_Comercial_v01.docx', true],
        ['documento-novo.docx', false],
        ['ata final2 agora vai.docx', false],
        ['ATA.DOCX', false],
      ],
    ),
    QUESTAO(
      'Qual é a diferença entre anexo e link?',
      'Anexo envia uma cópia dentro da mensagem; link entrega o endereço e depende de permissão.',
      [
        ['Anexo envia uma cópia; link aponta para o arquivo e depende de permissão.', true],
        ['São a mesma coisa.', false],
        ['Anexo é sempre mais seguro que link.', false],
        ['Link só funciona dentro da empresa.', false],
      ],
    ),
    QUESTAO(
      'Você gerou o PDF de um relatório. O que fazer com o arquivo editável?',
      'Mantenha o DOCX ou XLSX como fonte para mudanças futuras e distribua o PDF para leitura.',
      [
        ['Guardar o editável como fonte para mudanças futuras.', true],
        ['Excluir, porque o PDF substitui.', false],
        ['Renomear com a extensão .pdf.', false],
        ['Mover para a Lixeira.', false],
      ],
    ),
  ]),

  'Parte 3 — Rapidez, recuperação e segurança': FIXACAO(
    'Fixação — Rapidez, recuperação e segurança',
    [
      QUESTAO(
        'Qual atalho bloqueia a tela ao se afastar do computador?',
        'Windows + L bloqueia o computador — o equivalente a fechar a porta ao sair.',
        [
          ['Windows + L', true],
          ['Ctrl + L', false],
          ['Alt + Tab', false],
          ['Ctrl + Shift + N', false],
        ],
      ),
      QUESTAO(
        'Antes de enviar uma captura de tela ao suporte, o que conferir?',
        'Confira se a imagem não mostra senha, CPF, salário, endereço ou conversa particular.',
        [
          ['Se a imagem não mostra dados pessoais ou sensíveis.', true],
          ['Se a imagem está em preto e branco.', false],
          ['Se a captura pegou a tela inteira.', false],
          ['Se o arquivo é maior que 1 MB.', false],
        ],
      ),
      QUESTAO(
        'Qual afirmação sobre sincronização e backup está correta?',
        'Sincronização mantém locais conectados: uma exclusão pode se propagar. Backup é uma cópia separada para recuperação.',
        [
          ['Sincronização propaga exclusões; backup guarda uma cópia para recuperar.', true],
          ['São a mesma coisa com nomes diferentes.', false],
          ['Backup mantém os locais sempre iguais.', false],
          ['Sincronização substitui o backup.', false],
        ],
      ),
      QUESTAO(
        'Um arquivo importante sumiu. Qual é a sequência recomendada?',
        'Pesquise pelo nome, confira a Lixeira do Windows e a do serviço de nuvem, e procure o histórico de versões.',
        [
          ['Pesquisar pelo nome, conferir as lixeiras e o histórico de versões.', true],
          ['Criar imediatamente outro arquivo com o mesmo nome.', false],
          ['Formatar o computador.', false],
          ['Esvaziar a Lixeira para reorganizar.', false],
        ],
      ),
      QUESTAO(
        'Uma mensagem inesperada pede seu código de acesso com urgência. O que fazer?',
        'Pressa, medo e pedido de código são sinais de golpe. Não responda com dados e confirme por outro canal.',
        [
          ['Não responder e confirmar pelo canal oficial.', true],
          ['Responder rápido para não perder o prazo.', false],
          ['Encaminhar para um colega decidir.', false],
          ['Clicar no link para verificar se é verdadeiro.', false],
        ],
      ),
      QUESTAO(
        'Ao compartilhar uma planilha que o colega só precisa ler, qual permissão usar?',
        'Use permissão de leitura quando edição não for necessária, e remova o acesso quando terminar.',
        [
          ['Somente leitura.', true],
          ['Edição, por precaução.', false],
          ['Controle total.', false],
          ['Link público sem senha.', false],
        ],
      ),
    ],
  ),
};

const ANEXOS: Record<string, ActivityAttachmentPolicyDto> = {
  'Projeto final — Organize um pequeno escritório': {
    required: false,
    maxBytes: 1024 * 1024,
    extensions: ['.png', '.jpg', '.pdf'],
    hint:
      'Se quiser, envie uma captura de tela da estrutura de pastas que você montou (.png, .jpg ou ' +
      '.pdf, até 1 MB). Confira antes se a imagem não mostra nenhum dado pessoal.',
  },
};

const PERGUNTAS_EXTRAS: Record<string, SeedQuestion[]> = {
  'Questionário de conclusão': [
    QUESTAO(
      'Qual sequência descreve o que um computador faz?',
      'Entrada, processamento, armazenamento e saída são os quatro passos descritos no capítulo 1.',
      [
        ['Entrada, processamento, armazenamento e saída.', true],
        ['Ligar, digitar, imprimir e desligar.', false],
        ['Hardware, software, Windows e internet.', false],
        ['Abrir, salvar, fechar e excluir.', false],
      ],
    ),
    QUESTAO(
      'Qual atalho cria uma nova pasta no Explorador de Arquivos?',
      'Ctrl + Shift + N cria uma nova pasta; F2 renomeia o item selecionado.',
      [
        ['Ctrl + Shift + N', true],
        ['F2', false],
        ['Ctrl + N', false],
        ['Windows + E', false],
      ],
    ),
    QUESTAO(
      'Por que datas no formato 2026-07-31 são recomendadas nos nomes de arquivo?',
      'Nesse formato os arquivos ficam naturalmente em ordem, do mais antigo para o mais novo.',
      [
        ['Os arquivos ficam em ordem cronológica automaticamente.', true],
        ['O Windows exige esse formato.', false],
        ['Ocupam menos espaço no disco.', false],
        ['É o único formato aceito em PDF.', false],
      ],
    ),
    QUESTAO(
      'Qual é o cuidado principal ao guardar um arquivo na nuvem?',
      'A nuvem exige conta, permissão e serviço autorizado pela organização.',
      [
        ['Exige conta, permissão e serviço autorizado.', true],
        ['O arquivo fica mais lento para abrir.', false],
        ['Não é possível recuperar nada.', false],
        ['A nuvem substitui o backup.', false],
      ],
    ),
    QUESTAO(
      'Quais são os três cuidados com a informação apresentados no capítulo de segurança?',
      'Confidencialidade, integridade e disponibilidade são os três cuidados citados.',
      [
        ['Confidencialidade, integridade e disponibilidade.', true],
        ['Velocidade, espaço e organização.', false],
        ['Senha, antivírus e firewall.', false],
        ['Backup, nuvem e pendrive.', false],
      ],
    ),
    QUESTAO(
      'Você já clicou em um link suspeito e informou um dado. O que fazer?',
      'Contar imediatamente ao responsável: pedir ajuda rápido reduz o problema.',
      [
        ['Avisar imediatamente o responsável ou o suporte.', true],
        ['Esperar para ver se algo acontece.', false],
        ['Trocar apenas a foto do perfil.', false],
        ['Apagar a mensagem e não comentar.', false],
      ],
    ),
  ],
};

const EXEMPLOS: Record<string, ActivityExample> = {
  'Prática — Organize e envie um documento': {
    scenario:
      'a organização das fotos de uma viagem em família, e não os documentos de um escritório.',
    goodReport:
      'Criei a estrutura Viagens > 2026 > 03_Marco, e dentro dela três pastas: Fotos, Comprovantes e ' +
      'Temporarios. Parei em três níveis porque mais que isso eu mesma me perderia.\n\n' +
      'Renomeei os arquivos seguindo data, assunto e versão: 2026-03-14_Foto_Praia_v01.jpg, ' +
      '2026-03-15_Comprovante_Hotel.pdf e 2026-03_Roteiro_Viagem_v02.docx. Usei a data no formato ' +
      'ano-mês-dia porque assim os arquivos ficam em ordem sozinhos — testei rolando a lista e ' +
      'realmente ficaram do mais antigo para o mais novo.\n\n' +
      'Copiei o roteiro em branco antes de preencher, para não perder o modelo. Movi cada comprovante ' +
      'para a pasta certa. Havia uma foto duplicada: comparei o tamanho e a data das duas, apaguei a ' +
      'menor com Delete e depois restaurei pela Lixeira só para conferir que voltava ao lugar certo. ' +
      'Voltou para a pasta Fotos, e aí sim exclui de novo.\n\n' +
      'Salvei o roteiro em .docx e gerei um PDF por Exportar. Abri o PDF e conferi as duas páginas — a ' +
      'segunda tinha ficado quase vazia, então ajustei o texto e gerei de novo.\n\n' +
      'Antes de mandar para minha irmã, conferi três coisas: se o destinatário era ela mesma, se o ' +
      'arquivo anexado era o PDF e não o rascunho, e se o PDF não mostrava o número do meu cartão que ' +
      'aparecia no comprovante do hotel. Aparecia, então tirei esse comprovante do envio. Tudo isso foi ' +
      'feito com arquivos meus, de treinamento.',
    whyItWorks: [
      'A estrutura de pastas aparece escrita, com o motivo de parar em três níveis.',
      'Os nomes seguem o padrão e o aluno testou a ordenação em vez de só afirmar.',
      'Copiar, mover, excluir e restaurar aparecem descritos como ações reais, com o resultado de cada uma.',
      'O editável foi preservado e o PDF foi conferido — e uma correção real saiu dessa conferência.',
      'A conferência antes do envio encontrou um dado sensível e o aluno agiu.',
    ],
    weakReport:
      'Criei as pastas e organizei os arquivos com nomes melhores. Copiei, movi e excluí o que era duplicado, e depois restaurei. Gerei o PDF e conferi antes de enviar. Deu tudo certo.',
    whyItFails: [
      'Não mostra a estrutura nem um nome de arquivo sequer.',
      'Não diz como conferiu que a ordenação por data funcionou.',
      '"Restaurei" não diz de onde nem se voltou ao lugar certo.',
      'A conferência antes do envio não menciona destinatário, arquivo nem dados sensíveis.',
    ],
  },
  'Projeto final — Organize um pequeno escritório': {
    scenario:
      'a organização dos documentos de uma oficina mecânica fictícia, e não da Horizonte Serviços.',
    goodReport:
      'Pastas: criei Oficina > Financeiro > 2026 > 05_Maio e, dentro de maio, as subpastas Notas_Fiscais, ' +
      'Recibos, Orcamentos e Temporarios. Escolhi separar orçamento de nota fiscal porque são momentos ' +
      'diferentes do processo e eu confundia os dois.\n\n' +
      'Nomes: renomeei os oito arquivos de treinamento. Exemplos: ' +
      '2026-05-08_NotaFiscal_Fornecedor_Alfa_v01.pdf, 2026-05-12_Recibo_Servico_Cliente_Beta.pdf e ' +
      '2026-05_Controle_Mensal_v03.xlsx. Marquei um deles como APROVADO no nome, porque era o orçamento ' +
      'que tinha sido aceito.\n\n' +
      'Operações: copiei o modelo de relatório antes de preencher, para a matriz continuar em branco — ' +
      'conferi depois abrindo o original e ele estava intacto. Movi cada arquivo para a subpasta certa. ' +
      'Encontrei um duplicado e uma versão antiga: comparei as datas de modificação antes de decidir, ' +
      'apaguei a antiga com Delete, abri a Lixeira e restaurei para confirmar que voltava para a pasta ' +
      'Orcamentos. Voltou.\n\n' +
      'Janelas e atalhos: abri a planilha e o relatório lado a lado com Windows + Seta, e troquei entre ' +
      'eles com Alt + Tab para copiar dois valores sem digitar errado.\n\n' +
      'Salvamento e PDF: salvei o relatório em .docx e exportei o PDF. Abri o PDF e conferi as três ' +
      'páginas: a numeração estava certa e nenhuma tabela ficou cortada.\n\n' +
      'Segurança: fiz a captura da mensagem de erro com Windows + Shift + S, recortando só a caixa do ' +
      'aviso. A primeira tentativa pegou a barra de tarefas com o nome de um cliente, então refiz. Na ' +
      'simulação de envio conferi destinatário, arquivo e permissão de leitura.\n\n' +
      'Recuperação: o item excluído voltou para Orcamentos, o local original. Bloqueei a tela com ' +
      'Windows + L ao terminar. Todos os arquivos eram fictícios.',
    whyItWorks: [
      'Cada um dos sete critérios da rubrica aparece tratado, na ordem.',
      'As decisões vêm com motivo: separar orçamento de nota fiscal, comparar datas antes de excluir.',
      'A conferência é sempre concreta — "abri o original e ele estava intacto", "voltou para Orcamentos".',
      'A captura de tela teve um problema real de dado exposto, e o aluno refez.',
    ],
    weakReport:
      'Organizei tudo conforme pedido: criei as pastas, renomeei os arquivos, copiei o modelo, movi cada um para o lugar, gerei o PDF e fiz a captura. Restaurei o item excluído e bloqueei a tela no final.',
    whyItFails: [
      'Enumera as tarefas sem mostrar nenhum resultado.',
      'Nenhum nome de pasta ou de arquivo aparece.',
      'Não diz como conferiu que o modelo continuou intacto nem para onde o item restaurado voltou.',
      'Não menciona a conferência de dados sensíveis na captura.',
    ],
  },
};

export const MODULE_01_ENRICHMENT: SectionEnrichment = {
  conteudo: CONTEUDO,
  rubricas: RUBRICAS,
  anexos: ANEXOS,
  exemplos: EXEMPLOS,
  questionarios: QUESTIONARIOS,
  perguntas: PERGUNTAS_EXTRAS,
};
