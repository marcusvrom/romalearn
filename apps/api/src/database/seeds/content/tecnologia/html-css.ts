import type { TechCourseContent } from './tech-types';

/**
 * HTML e CSS do Zero.
 *
 * Acessibilidade não é uma aula no fim do curso: aparece desde a primeira,
 * porque marcar o documento pelo significado é mais fácil do que consertar
 * depois. O aluno termina com uma página que funciona no celular, no teclado
 * e no leitor de tela.
 */
export const HTML_CSS: TechCourseContent = {
  'Como a web funciona': {
    problem:
      'Você digita um endereço, aperta Enter e a página aparece. Entre esses dois momentos acontecem várias etapas — e é nelas que moram quase todos os problemas que você vai depurar.',
    outcome:
      'Descrever o caminho entre digitar um endereço e ver a página, sabendo o papel do navegador, do servidor e de cada arquivo.',
    blocks: [
      {
        kind: 'paragraph',
        text: 'A web funciona por pedido e resposta. Seu navegador pede um documento; um computador em algum lugar responde com ele. Nada acontece sem que alguém peça — o servidor nunca envia nada por conta própria.',
      },
      {
        kind: 'analogy',
        text: 'É como pedir um documento por correspondência. Você envia uma carta com o endereço exato e aguarda. O destinatário pode responder com o documento, dizer que ele não existe naquele endereço ou informar que mudou de lugar. O navegador faz o mesmo, milhares de vezes por dia.',
      },
      { kind: 'heading', text: 'As partes de um endereço' },
      {
        kind: 'code',
        language: 'text',
        lines: ['https://www.exemplo.com.br/cursos/excel?nivel=basico'],
      },
      {
        kind: 'table',
        headers: ['Parte', 'Valor', 'Função'],
        rows: [
          ['Protocolo', 'https', 'Como conversar; o "s" indica conexão criptografada'],
          ['Domínio', 'www.exemplo.com.br', 'Com quem conversar'],
          ['Caminho', '/cursos/excel', 'Qual recurso está sendo pedido'],
          ['Consulta', '?nivel=basico', 'Informação extra sobre o pedido'],
        ],
      },
      {
        kind: 'warning',
        text: 'Sem o "s" do https, o que trafega pode ser lido por quem estiver no meio do caminho. Nunca envie senha ou dado pessoal por uma conexão sem ele.',
      },
      { kind: 'heading', text: 'Os três arquivos e seus papéis' },
      {
        kind: 'table',
        headers: ['Arquivo', 'Responsável por', 'Analogia'],
        rows: [
          ['HTML', 'Estrutura e significado', 'A planta da casa'],
          ['CSS', 'Aparência e layout', 'Acabamento, cor, disposição'],
          ['JavaScript', 'Comportamento', 'Interruptores e automações'],
        ],
      },
      {
        kind: 'paragraph',
        text: 'Manter os três separados não é preciosismo. É o que permite trocar toda a aparência sem tocar no conteúdo, e o que faz a página continuar legível quando o CSS não carrega — situação mais comum do que parece em conexões instáveis.',
      },
      { kind: 'heading', text: 'Códigos de resposta que você vai encontrar' },
      {
        kind: 'table',
        headers: ['Código', 'Significa', 'De quem costuma ser a causa'],
        rows: [
          ['200', 'Deu certo', '—'],
          ['301 / 302', 'Mudou de endereço', 'Configuração do servidor'],
          ['404', 'Não existe nesse endereço', 'Link errado ou arquivo removido'],
          ['403', 'Existe, mas você não pode ver', 'Permissão'],
          ['500', 'O servidor quebrou ao processar', 'Defeito no código do servidor'],
        ],
      },
      {
        kind: 'keyIdea',
        text: 'Erros na casa dos 400 apontam para o pedido; erros na casa dos 500 apontam para o servidor. Essa única distinção já diz de que lado procurar o problema.',
      },
    ],
    reflection: [
      'Abra as ferramentas do desenvolvedor, aba de rede, e recarregue uma página. Quantos pedidos foram feitos para montar uma página só?',
      'Por que separar estrutura, aparência e comportamento facilita a manutenção?',
      'Se um link seu retorna 404, o problema está no seu pedido ou no servidor?',
    ],
    checklist: [
      'Sei nomear as partes de uma URL.',
      'Sei o papel de HTML, CSS e JavaScript.',
      'Sei diferenciar erro de pedido de erro de servidor.',
    ],
  },

  'Estrutura de um documento HTML': {
    problem:
      'Você escreveu o texto da página, abriu no navegador e os acentos viraram símbolos estranhos. O conteúdo estava certo; faltava avisar o navegador como lê-lo.',
    outcome:
      'Montar a base de um documento HTML válido, entendendo o que vai no cabeçalho invisível e o que vai no corpo visível.',
    blocks: [
      {
        kind: 'code',
        language: 'html',
        caption: 'A base mínima de qualquer página:',
        lines: [
          '<!doctype html>',
          '<html lang="pt-BR">',
          '  <head>',
          '    <meta charset="utf-8" />',
          '    <meta name="viewport" content="width=device-width, initial-scale=1" />',
          '    <title>Curso de Excel para Administração</title>',
          '    <meta name="description" content="Aprenda planilhas aplicadas a rotinas de escritório." />',
          '  </head>',
          '  <body>',
          '    <h1>Curso de Excel para Administração</h1>',
          '  </body>',
          '</html>',
        ],
      },
      { kind: 'heading', text: 'Linha por linha, o que cada uma resolve' },
      {
        kind: 'table',
        headers: ['Linha', 'Resolve'],
        rows: [
          [
            'doctype html',
            'Faz o navegador usar as regras modernas em vez de um modo de compatibilidade antigo',
          ],
          [
            'lang="pt-BR"',
            'Informa o idioma; o leitor de tela escolhe a pronúncia correta por causa dela',
          ],
          [
            'charset="utf-8"',
            'Faz os acentos aparecerem — é a linha que faltava no problema desta aula',
          ],
          ['viewport', 'Faz o celular usar a largura real da tela em vez de fingir ser um desktop'],
          ['title', 'Nomeia a aba e é o texto azul do resultado de busca'],
          ['description', 'É o resumo exibido abaixo do título na busca'],
        ],
      },
      {
        kind: 'paragraph',
        text: 'O `head` guarda informação sobre a página; o `body` guarda a página. Um erro frequente de quem começa é colocar conteúdo visível dentro do head e estranhar que ele não apareça.',
      },
      {
        kind: 'warning',
        text: 'Sem a linha do viewport, o celular renderiza a página como se a tela tivesse cerca de 980 pixels e depois encolhe tudo. O resultado é um texto ilegível — e nenhum ajuste de CSS resolve enquanto essa linha não existir.',
      },
      { kind: 'heading', text: 'Aninhamento e fechamento' },
      {
        kind: 'code',
        language: 'html',
        caption: 'Errado — as tags se cruzam:',
        lines: ['<p>Texto <strong>importante</p></strong>'],
      },
      {
        kind: 'code',
        language: 'html',
        caption: 'Certo — a de dentro fecha primeiro:',
        lines: ['<p>Texto <strong>importante</strong></p>'],
      },
      {
        kind: 'tip',
        text: 'Indente uma camada a cada nível de aninhamento. O alinhamento visual mostra o erro de fechamento antes de o navegador reclamar.',
      },
      {
        kind: 'keyIdea',
        text: 'O navegador tenta consertar HTML malformado e quase sempre consegue. O problema é que cada navegador conserta de um jeito — por isso o certo é escrever válido, e não confiar no conserto.',
      },
    ],
    reflection: [
      'Remova a linha do charset e recarregue uma página com acentos. O que aparece?',
      'Por que o atributo de idioma importa para quem usa leitor de tela?',
      'O que acontece com a mesma página no celular sem a linha do viewport?',
    ],
    checklist: [
      'Minha página tem doctype, idioma, charset e viewport.',
      'O título descreve o conteúdo da página.',
      'Todas as tags abrem e fecham na ordem correta.',
    ],
  },

  'HTML semântico e acessibilidade': {
    problem:
      'Uma pessoa cega quer se inscrever no seu curso. O leitor de tela dela anuncia "div, div, div, botão sem nome" e ela desiste.',
    outcome:
      'Escolher elementos pelo significado, de modo que a página funcione para quem enxerga, para quem usa teclado e para quem ouve a página.',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Todo elemento HTML tem um significado, e tecnologias assistivas dependem dele. Uma `div` não significa nada: é uma caixa neutra. Um `button` significa "aqui se aciona uma ação" — e por causa disso já recebe foco pelo teclado, responde ao Enter e é anunciado como botão.',
      },
      {
        kind: 'analogy',
        text: 'É a diferença entre um prédio com placas e um prédio onde tudo é porta branca sem identificação. Quem enxerga se vira pelo contexto; quem não enxerga fica preso. As placas são gratuitas — basta usar o elemento certo.',
      },
      { kind: 'heading', text: 'Elementos por significado' },
      {
        kind: 'table',
        headers: ['Em vez de', 'Use', 'Ganho imediato'],
        rows: [
          ['div do topo', 'header', 'Leitor de tela permite pular direto para o conteúdo'],
          ['div de menu', 'nav', 'Anunciado como navegação'],
          ['div do conteúdo', 'main', 'Vira o destino do atalho "pular para o conteúdo"'],
          ['div clicável', 'button', 'Foco, Enter e barra de espaço funcionam sem código'],
          ['span estilizado', 'h1 a h6', 'Cria a estrutura pela qual se navega por títulos'],
        ],
      },
      {
        kind: 'paragraph',
        text: 'A última linha merece atenção. Usuários de leitor de tela navegam pela lista de títulos como quem passa os olhos por uma página. Se os títulos forem `span` com fonte grande, essa lista fica vazia e a pessoa precisa ouvir tudo, do começo.',
      },
      { kind: 'heading', text: 'Hierarquia de títulos' },
      {
        kind: 'code',
        language: 'html',
        lines: [
          '<h1>Curso de Excel</h1>',
          '  <h2>Conteudo</h2>',
          '    <h3>Parte 1 - Fundamentos</h3>',
          '    <h3>Parte 2 - Formulas</h3>',
          '  <h2>Certificado</h2>',
        ],
      },
      {
        kind: 'warning',
        text: 'Não pule níveis para conseguir um tamanho de fonte. Ir de h2 direto para h4 cria um buraco na estrutura. Tamanho é assunto do CSS; o número do título é assunto do significado.',
      },
      { kind: 'heading', text: 'Formulários: o rótulo precisa estar ligado ao campo' },
      {
        kind: 'code',
        language: 'html',
        caption: 'Errado — o texto está perto, mas não ligado:',
        lines: ['<p>E-mail</p>', '<input type="email" />'],
      },
      {
        kind: 'code',
        language: 'html',
        caption: 'Certo — o for aponta para o id:',
        lines: [
          '<label for="email">E-mail</label>',
          '<input type="email" id="email" name="email" required />',
        ],
      },
      {
        kind: 'paragraph',
        text: 'A ligação traz dois ganhos: o leitor de tela anuncia "E-mail, campo de edição" ao chegar no campo, e clicar no texto passa o foco para o campo — o que ajuda quem tem dificuldade motora a acertar um alvo pequeno.',
      },
      { kind: 'heading', text: 'Imagens e texto alternativo' },
      {
        kind: 'table',
        headers: ['Situação', 'O que escrever'],
        rows: [
          [
            'Imagem que informa',
            'Descreva a informação: alt="Gráfico: matrículas cresceram de 120 para 300"',
          ],
          ['Imagem decorativa', 'alt vazio, para o leitor ignorar: alt=""'],
          ['Imagem que é link', 'Descreva o destino, não a figura: alt="Página inicial"'],
        ],
      },
      {
        kind: 'warning',
        text: 'Omitir o atributo é diferente de deixá-lo vazio. Sem o atributo, muitos leitores de tela leem o nome do arquivo — e ouvir "img underscore 4 3 2 ponto png" é pior do que não ouvir nada.',
      },
      {
        kind: 'keyIdea',
        text: 'Acessibilidade feita desde o começo custa quase nada: é escolher a tag certa. Adicionada depois, vira reescrita. Não é um extra para o fim do projeto — é a ordem correta de fazer.',
      },
    ],
    reflection: [
      'Navegue numa página sua usando só o Tab. É possível chegar a tudo e saber onde o foco está?',
      'Por que um botão feito com div exige código extra para funcionar com teclado?',
      'Escreva o texto alternativo de uma foto de perfil que também é link para o perfil.',
    ],
    checklist: [
      'Usei header, nav, main e footer no lugar de divs genéricas.',
      'Meus títulos seguem hierarquia sem pular níveis.',
      'Todo campo de formulário tem label ligado por for e id.',
      'Toda imagem tem alt, vazio quando for decorativa.',
      'Consigo percorrer a página inteira com o teclado.',
    ],
  },

  'Seletores, cascata e especificidade': {
    problem:
      'Você escreveu a regra que deixa o botão verde. O botão continua azul. Você acrescenta mais uma regra, e ele continua azul.',
    outcome:
      'Prever qual regra o navegador aplica quando várias disputam o mesmo elemento, e resolver conflitos sem recorrer a força bruta.',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Quando duas regras dizem coisas diferentes sobre o mesmo elemento, o navegador decide por critérios fixos, nesta ordem: origem, especificidade e ordem de aparição. Quase todo "o CSS não funciona" é na verdade "outra regra ganhou".',
      },
      { kind: 'heading', text: 'Especificidade: quem tem mais peso' },
      {
        kind: 'table',
        headers: ['Seletor', 'Exemplo', 'Peso'],
        rows: [
          ['Elemento', 'button', 'baixo'],
          ['Classe', '.botao-primario', 'médio'],
          ['Identificador', '#enviar', 'alto'],
          ['Estilo na tag', 'style="..."', 'muito alto'],
        ],
      },
      {
        kind: 'code',
        language: 'css',
        caption: 'A segunda regra perde, mesmo vindo depois:',
        lines: [
          '#enviar {',
          '  background: blue;',
          '}',
          '',
          '.botao-primario {',
          '  background: green;',
          '}',
        ],
      },
      {
        kind: 'paragraph',
        text: 'A ordem só desempata entre regras de mesma especificidade. Como identificador pesa mais que classe, escrever a regra verde depois não adianta — e é exatamente o que acontece no problema desta aula.',
      },
      {
        kind: 'analogy',
        text: 'É como uma hierarquia de autorizações. Um pedido do diretor prevalece sobre o do coordenador, independentemente de qual chegou primeiro. Repetir o pedido do coordenador em voz mais alta não muda nada.',
      },
      { kind: 'heading', text: 'Como resolver sem força bruta' },
      {
        kind: 'list',
        items: [
          'Prefira classes para estilo e deixe identificadores para âncoras e ligação com formulários.',
          'Quando precisar de mais peso, use uma classe mais específica em vez de subir para identificador.',
          'Mantenha a folha de estilo em ordem: base, componentes, variações.',
        ],
      },
      {
        kind: 'warning',
        text: 'A palavra-chave que força prioridade resolve na hora e cria dívida. Depois dela, a única forma de sobrepor é usar outra igual — e em poucos meses a folha inteira vira uma disputa de exclamações. Use apenas quando não houver como alterar o CSS que está atrapalhando.',
      },
      { kind: 'heading', text: 'Herança' },
      {
        kind: 'paragraph',
        text: 'Algumas propriedades passam de pai para filho — cor, fonte, altura de linha. Outras não — margem, borda, fundo. Definir tipografia uma vez no elemento raiz e deixar herdar economiza dezenas de regras.',
      },
      {
        kind: 'tip',
        text: 'Clique com o botão direito no elemento, inspecione e olhe o painel de estilos: ele mostra todas as regras que tentaram valer e risca as que perderam. Cinco segundos ali economizam meia hora de tentativa e erro.',
      },
    ],
    reflection: [
      'No exemplo do botão, cite duas formas de fazer o verde vencer sem usar a palavra-chave de prioridade.',
      'Por que usar identificador para estilo cria problema mais adiante?',
      'Cite duas propriedades que se herdam e duas que não.',
    ],
    checklist: [
      'Sei ordenar elemento, classe e identificador por peso.',
      'Uso classes para estilo e identificadores para âncora.',
      'Consigo usar o inspetor para descobrir qual regra venceu.',
    ],
  },

  'Box model, tipografia e cores': {
    problem:
      'Você definiu que a caixa tem 300 pixels de largura, acrescentou espaçamento interno e borda. Ela agora ocupa 340 e quebrou o layout.',
    outcome:
      'Controlar tamanho e espaçamento de forma previsível e escolher cores que qualquer pessoa consiga ler.',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Todo elemento é uma caixa com quatro camadas: conteúdo, espaçamento interno, borda e margem. A confusão do problema acima vem de como a largura é contada por padrão.',
      },
      {
        kind: 'code',
        language: 'css',
        caption: 'A linha que torna o tamanho previsível:',
        lines: ['*,', '*::before,', '*::after {', '  box-sizing: border-box;', '}'],
      },
      {
        kind: 'table',
        headers: [
          'Valor',
          'A largura declarada inclui',
          'Resultado com 300px + 16px interno + 2px borda',
        ],
        rows: [
          ['content-box (padrão)', 'Só o conteúdo', '336px na tela'],
          ['border-box', 'Conteúdo, espaçamento e borda', '300px na tela'],
        ],
      },
      {
        kind: 'paragraph',
        text: 'Com border-box, 300 significa 300. É por isso que praticamente todo projeto começa com essas cinco linhas — vale colocá-las antes de qualquer outra coisa.',
      },
      { kind: 'heading', text: 'Espaçamento interno ou externo' },
      {
        kind: 'table',
        headers: ['Pergunta', 'Resposta'],
        rows: [
          ['Preciso de ar dentro da caixa, junto ao fundo colorido?', 'Espaçamento interno'],
          ['Preciso de distância entre esta caixa e a vizinha?', 'Margem'],
          [
            'Preciso de distância entre itens de uma lista ou grade?',
            'Espaço da grade ou do flex, não margem',
          ],
        ],
      },
      { kind: 'heading', text: 'Tipografia legível' },
      {
        kind: 'list',
        items: [
          'Corpo do texto a partir de 16 pixels; abaixo disso o celular oferece zoom e o leitor se cansa.',
          'Altura de linha entre 1,5 e 1,7 no texto corrido.',
          'Largura de linha entre 45 e 75 caracteres: linha longa demais faz o olho perder a próxima.',
        ],
      },
      {
        kind: 'code',
        language: 'css',
        lines: [
          'body {',
          '  font-size: 1rem;',
          '  line-height: 1.6;',
          '}',
          '',
          'p {',
          '  max-width: 65ch;',
          '}',
        ],
      },
      {
        kind: 'tip',
        text: 'A unidade `ch` equivale à largura do caractere zero da fonte em uso. Usar `65ch` expressa a intenção — sessenta e cinco caracteres — em vez de um número de pixels que muda de sentido a cada fonte.',
      },
      { kind: 'heading', text: 'Contraste é requisito, não gosto' },
      {
        kind: 'table',
        headers: ['Conteúdo', 'Contraste mínimo'],
        rows: [
          ['Texto normal', '4,5 para 1'],
          ['Texto grande (a partir de 24px, ou 19px em negrito)', '3 para 1'],
          ['Bordas de campo, ícones que carregam informação', '3 para 1'],
        ],
      },
      {
        kind: 'warning',
        text: 'Cinza-claro sobre branco é a escolha estética que mais exclui gente: quem tem baixa visão, quem está no sol, quem usa uma tela antiga. Meça o contraste em vez de julgar a olho — o inspetor do navegador informa a razão ao lado de cada cor.',
      },
      {
        kind: 'keyIdea',
        text: 'Nunca use apenas cor para informar. Um campo com erro precisa de ícone ou texto além da borda vermelha, porque parte das pessoas não distingue vermelho de verde.',
      },
    ],
    reflection: [
      'Meça o contraste do texto secundário do seu projeto. Ele passa em 4,5 para 1?',
      'Por que definir largura máxima em `ch` comunica melhor a intenção do que em pixels?',
      'Como você indicaria um campo com erro sem depender da cor?',
    ],
    checklist: [
      'Apliquei border-box no início da folha de estilo.',
      'Meu texto tem altura de linha confortável e largura limitada.',
      'Medi o contraste das combinações de cor que usei.',
      'Nenhuma informação depende só de cor.',
    ],
  },

  'Flexbox e Grid': {
    problem:
      'Três cartões precisam ficar lado a lado, com a mesma altura, e virar uma coluna no celular. Com as ferramentas antigas do CSS isso levava horas.',
    outcome:
      'Escolher entre as duas ferramentas de layout conforme o problema e montar uma grade que se adapta sem escrever pontos de quebra.',
    blocks: [
      {
        kind: 'table',
        headers: ['Ferramenta', 'Pensa em', 'Use quando'],
        rows: [
          [
            'Flexbox',
            'Uma direção: linha ou coluna',
            'Barra de navegação, grupo de botões, cartão por dentro',
          ],
          ['Grid', 'Duas direções: linhas e colunas', 'Grade de cartões, layout da página inteira'],
        ],
      },
      {
        kind: 'paragraph',
        text: 'A regra prática: se você consegue descrever o arranjo como "um do lado do outro" ou "um embaixo do outro", é Flexbox. Se precisar dizer "três por linha", é Grid.',
      },
      { kind: 'heading', text: 'Flexbox: distribuir em uma direção' },
      {
        kind: 'code',
        language: 'css',
        lines: [
          '.barra {',
          '  display: flex;',
          '  align-items: center;      /* alinha no eixo transversal */',
          '  justify-content: space-between;  /* distribui no eixo principal */',
          '  gap: 1rem;',
          '}',
        ],
      },
      {
        kind: 'paragraph',
        text: 'Os dois nomes confundem porque dependem da direção. Em linha, `justify-content` distribui na horizontal e `align-items` alinha na vertical. Se a direção virar coluna, os dois trocam de papel — e é aí que quase todo mundo erra na primeira vez.',
      },
      {
        kind: 'tip',
        text: 'A propriedade `gap` substitui margens entre filhos e evita o espaço sobrando na ponta. Ela funciona tanto em Flexbox quanto em Grid.',
      },
      { kind: 'heading', text: 'Grid: a grade que se adapta sozinha' },
      {
        kind: 'code',
        language: 'css',
        lines: [
          '.cartoes {',
          '  display: grid;',
          '  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));',
          '  gap: 1.5rem;',
          '}',
        ],
      },
      {
        kind: 'paragraph',
        text: 'Esta única linha resolve o problema da aula. Ela diz: cada coluna tem no mínimo 260 pixels; caiba quantas couberem; o espaço que sobrar é dividido igualmente. Em uma tela larga saem quatro cartões por linha, em um tablet dois, no celular um — sem nenhum ponto de quebra escrito.',
      },
      {
        kind: 'analogy',
        text: 'É a diferença entre marcar no chão exatamente onde cada mesa vai e dizer ao garçom "mesas de no mínimo um metro, encha o salão". A segunda instrução funciona em qualquer salão, inclusive nos que você não visitou.',
      },
      { kind: 'heading', text: 'Altura igual sem esforço' },
      {
        kind: 'paragraph',
        text: 'Tanto Flexbox quanto Grid esticam os filhos para a mesma altura por padrão. Para que o rodapé de cada cartão fique alinhado mesmo com textos de tamanhos diferentes, faça o cartão ser flexível por dentro e empurre o rodapé para baixo.',
      },
      {
        kind: 'code',
        language: 'css',
        lines: [
          '.cartao {',
          '  display: flex;',
          '  flex-direction: column;',
          '}',
          '',
          '.cartao__rodape {',
          '  margin-top: auto;   /* consome o espaco que sobra */',
          '}',
        ],
      },
      {
        kind: 'warning',
        text: 'As duas ferramentas mudam a apresentação, não a ordem do documento. Reordenar visualmente com CSS deixa a ordem do teclado diferente da ordem que se vê — e quem navega por Tab pula pela tela sem lógica. Se a ordem importa, mude o HTML.',
      },
    ],
    reflection: [
      'A barra de navegação do seu projeto é Flexbox ou Grid? Justifique.',
      'O que muda em `justify-content` quando a direção passa de linha para coluna?',
      'Por que a grade com auto-fit dispensa pontos de quebra?',
    ],
    checklist: [
      'Sei escolher entre uma e duas direções.',
      'Montei uma grade que se adapta sem media query.',
      'Usei gap no lugar de margens entre filhos.',
      'Confirmei que a ordem visual bate com a ordem do teclado.',
    ],
  },

  'Mobile first e media queries': {
    problem:
      'Sua página ficou ótima no notebook. No celular, o texto sai da tela e é preciso arrastar para o lado para ler cada linha.',
    outcome:
      'Projetar primeiro para a tela pequena e acrescentar ajustes conforme sobra espaço, em vez de tentar espremer um layout grande.',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Mobile first é escrever o CSS base para a tela pequena e usar media queries só para acrescentar. A ordem inversa — desenhar para o desktop e ir removendo — gera folhas cheias de exceções que se anulam.',
      },
      {
        kind: 'analogy',
        text: 'É mais fácil acrescentar cômodos a uma casa pequena do que serrar uma casa grande até caber no terreno. O que sobra do corte fica no caminho, e é isso que acontece com CSS feito ao contrário.',
      },
      { kind: 'heading', text: 'A estrutura' },
      {
        kind: 'code',
        language: 'css',
        lines: [
          '/* Base: vale para todas as telas, comecando pela menor */',
          '.conteudo {',
          '  padding: 1rem;',
          '}',
          '',
          '/* A partir de 768px, acrescenta */',
          '@media (min-width: 768px) {',
          '  .conteudo {',
          '    padding: 2rem;',
          '  }',
          '}',
        ],
      },
      {
        kind: 'tip',
        text: 'Escolha o ponto de quebra onde o layout começa a ficar feio, arrastando a janela — não por modelo de aparelho. A lista de tamanhos de celular muda todo ano; o ponto em que o seu conteúdo quebra, não.',
      },
      { kind: 'heading', text: 'Unidades que se adaptam' },
      {
        kind: 'table',
        headers: ['Unidade', 'Relativa a', 'Boa para'],
        rows: [
          [
            'rem',
            'Fonte base do navegador',
            'Espaçamento e tipografia — respeita quem aumentou a fonte',
          ],
          ['%', 'Elemento pai', 'Larguras dentro de um contêiner'],
          ['vw / vh', 'Tamanho da janela', 'Seções de tela cheia — com cuidado'],
          ['clamp()', 'Mínimo, ideal e máximo', 'Tipografia que cresce sem estourar'],
        ],
      },
      {
        kind: 'code',
        language: 'css',
        caption: 'Título que acompanha a tela sem ficar minúsculo nem gigante:',
        lines: ['h1 {', '  font-size: clamp(1.75rem, 5vw, 3rem);', '}'],
      },
      {
        kind: 'warning',
        text: 'Nunca fixe tamanho de fonte em pixels no corpo do texto. Quem aumentou a fonte padrão do navegador por necessidade fica sem efeito, e essa é uma das configurações de acessibilidade mais usadas que existe.',
      },
      { kind: 'heading', text: 'Imagens que não estouram' },
      {
        kind: 'code',
        language: 'css',
        lines: ['img {', '  max-width: 100%;', '  height: auto;', '}'],
      },
      {
        kind: 'paragraph',
        text: 'Estas duas linhas resolvem a maior parte dos casos de rolagem horizontal indesejada. Outra causa frequente é um elemento com largura fixa maior que a tela — para achá-lo, reduza a janela e procure o que não encolhe.',
      },
      {
        kind: 'keyIdea',
        text: 'A página não pode rolar na horizontal. Rolagem lateral dentro de uma tabela larga é aceitável; a página inteira deslizando é sempre defeito.',
      },
    ],
    reflection: [
      'Reduza a janela até 320 pixels. Alguma coisa sai da tela?',
      'Por que escolher pontos de quebra pelo conteúdo é melhor do que por modelo de aparelho?',
      'O que acontece com um texto em pixels quando o usuário aumenta a fonte do navegador?',
    ],
    checklist: [
      'Escrevi o CSS base para tela pequena e acrescentei com min-width.',
      'Usei rem para tipografia e espaçamento.',
      'A página não rola na horizontal em 320 pixels.',
      'Minhas imagens têm largura máxima de 100%.',
    ],
  },

  'Formulários e estados de interação': {
    problem:
      'Alguém preencheu seu formulário, clicou em enviar e nada aconteceu. Havia um erro num campo fora da tela, marcado apenas por uma borda vermelha.',
    outcome:
      'Construir campos e botões que comunicam claramente o que fazer, o que está acontecendo e o que deu errado.',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Formulário é onde a pessoa entrega dados e recebe o resultado do esforço. Cada detalhe de comunicação vira desistência quando falta.',
      },
      { kind: 'heading', text: 'Tipos de campo trabalham por você' },
      {
        kind: 'code',
        language: 'html',
        lines: [
          '<label for="email">E-mail</label>',
          '<input type="email" id="email" name="email" autocomplete="email" required />',
          '',
          '<label for="telefone">Telefone</label>',
          '<input type="tel" id="telefone" name="telefone" autocomplete="tel" />',
        ],
      },
      {
        kind: 'paragraph',
        text: 'O tipo correto muda o teclado que aparece no celular — numérico para telefone, com arroba para e-mail — e liga a validação nativa do navegador. O `autocomplete` permite preencher com um toque, o que reduz erro de digitação e abandono.',
      },
      {
        kind: 'warning',
        text: 'Texto de exemplo dentro do campo não substitui rótulo. Ele some quando a pessoa começa a digitar, e aí ninguém mais sabe o que aquele campo pedia — problema sério para quem se distrai ou volta ao formulário depois.',
      },
      { kind: 'heading', text: 'Estados que precisam existir' },
      {
        kind: 'table',
        headers: ['Estado', 'O que comunica', 'Como'],
        rows: [
          ['Repouso', 'O campo está disponível', 'Borda com contraste suficiente'],
          ['Foco', 'É aqui que estou', 'Contorno visível, nunca removido'],
          ['Erro', 'Isto precisa de correção', 'Borda, ícone e texto explicando'],
          ['Carregando', 'Recebi seu clique, aguarde', 'Botão desativado com texto que muda'],
        ],
      },
      {
        kind: 'code',
        language: 'css',
        lines: [
          'input:focus-visible,',
          'button:focus-visible {',
          '  outline: 3px solid #2543ea;',
          '  outline-offset: 2px;',
          '}',
        ],
      },
      {
        kind: 'warning',
        text: 'Remover o contorno de foco porque ele é feio deixa quem navega por teclado sem saber onde está. Se não gostar do contorno padrão, substitua por outro visível — nunca simplesmente apague.',
      },
      { kind: 'heading', text: 'Mensagens de erro que ajudam' },
      {
        kind: 'table',
        headers: ['Mensagem', 'Problema'],
        rows: [
          ['Erro', 'Não diz onde nem o quê'],
          ['Campo inválido', 'Não diz qual regra foi violada'],
          ['Informe um e-mail com arroba, como nome@exemplo.com', 'Diz o esperado e dá um modelo'],
          ['A senha precisa de pelo menos 10 caracteres', 'Diz a regra exata'],
        ],
      },
      {
        kind: 'code',
        language: 'html',
        caption: 'Ligar o erro ao campo para o leitor de tela anunciá-lo:',
        lines: [
          '<label for="senha">Senha</label>',
          '<input type="password" id="senha" aria-describedby="erro-senha" aria-invalid="true" />',
          '<p id="erro-senha" role="alert">A senha precisa de pelo menos 10 caracteres.</p>',
        ],
      },
      {
        kind: 'keyIdea',
        text: 'Ao falhar o envio, leve o foco para o primeiro campo com erro. Sem isso, quem usa teclado ou leitor de tela não fica sabendo que houve erro — que é exatamente o problema que abriu esta aula.',
      },
    ],
    reflection: [
      'Preencha seu formulário errado de propósito, só com o teclado. Você descobre o erro?',
      'Por que texto de exemplo dentro do campo não substitui o rótulo?',
      'Reescreva "campo inválido" para um campo de CEP.',
    ],
    checklist: [
      'Cada campo tem rótulo visível e tipo adequado.',
      'O foco é sempre visível.',
      'Mensagens de erro dizem a regra e estão ligadas ao campo.',
      'O foco vai para o primeiro erro quando o envio falha.',
    ],
  },

  'Performance e publicação': {
    problem:
      'Sua página abre em um segundo no seu computador. No celular de um aluno, com internet limitada, ela leva doze — e ele fecha antes.',
    outcome:
      'Reduzir o peso da página, medir o resultado e publicar o projeto num endereço público.',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Performance é acessibilidade: uma página pesada exclui quem tem aparelho antigo, internet limitada ou franquia contada. O trabalho aqui rende muito, porque quase sempre o problema está concentrado em poucas coisas.',
      },
      { kind: 'heading', text: 'Imagens, quase sempre' },
      {
        kind: 'table',
        headers: ['Ação', 'Ganho típico'],
        rows: [
          [
            'Redimensionar para o tamanho real de exibição',
            'Enorme — subir foto de 4000px para exibir em 400 é o erro mais comum',
          ],
          ['Usar formatos modernos como WebP', 'De 25% a 35% menor que JPEG'],
          [
            'Carregar sob demanda o que está abaixo da dobra',
            'Menos peso no primeiro carregamento',
          ],
          ['Declarar largura e altura', 'Evita o salto do layout quando a imagem chega'],
        ],
      },
      {
        kind: 'code',
        language: 'html',
        lines: [
          '<img',
          '  src="curso-excel.webp"',
          '  alt="Tela do curso de Excel com uma planilha de despesas"',
          '  width="800"',
          '  height="450"',
          '  loading="lazy"',
          '/>',
        ],
      },
      {
        kind: 'tip',
        text: 'Declarar largura e altura resolve o salto de layout: o navegador reserva o espaço antes da imagem chegar. Sem isso, o texto pula quando a imagem carrega — e a pessoa clica no lugar errado.',
      },
      { kind: 'heading', text: 'Medir antes de otimizar' },
      {
        kind: 'paragraph',
        text: 'As ferramentas do desenvolvedor trazem uma auditoria que mede desempenho, acessibilidade e boas práticas. Rode antes de mexer em qualquer coisa: ela costuma mostrar que o problema não é onde você imaginava.',
      },
      {
        kind: 'steps',
        items: [
          'Abra as ferramentas do desenvolvedor e rode a auditoria em modo celular.',
          'Anote a nota inicial de cada categoria.',
          'Ataque primeiro o item de maior impacto, quase sempre imagens.',
          'Rode de novo e compare — assim você aprende o que rendeu de verdade.',
          'Repita na aba de rede com limitação de velocidade, simulando conexão lenta.',
        ],
      },
      { kind: 'heading', text: 'Publicar' },
      {
        kind: 'paragraph',
        text: 'Uma página estática pode ser publicada de graça a partir do próprio repositório. Nas configurações do projeto no GitHub existe a seção Pages: escolha a branch e a pasta, e em alguns minutos o endereço público fica ativo.',
      },
      {
        kind: 'warning',
        text: 'Antes de publicar, confira que nenhuma credencial, dado pessoal real ou arquivo interno foi para o repositório. Publicar torna tudo acessível a qualquer pessoa, e o histórico do Git guarda até o que foi apagado depois.',
      },
      {
        kind: 'keyIdea',
        text: 'Um projeto publicado vale muito mais no portfólio do que um projeto perfeito na sua máquina. Quem avalia clica no link antes de abrir o código.',
      },
    ],
    reflection: [
      'Rode a auditoria numa página sua em modo celular. Qual foi a nota e qual o maior problema apontado?',
      'Qual o tamanho real da maior imagem do seu projeto e em que tamanho ela aparece na tela?',
      'Por que declarar largura e altura da imagem melhora a experiência mesmo sem reduzir peso?',
    ],
    checklist: [
      'Redimensionei as imagens para o tamanho de exibição.',
      'Declarei largura e altura em todas as imagens.',
      'Rodei a auditoria antes e depois e anotei a diferença.',
      'Publiquei a página e testei o endereço público no celular.',
      'Conferi que nada sensível foi para o repositório.',
    ],
  },
};
