import type { TechCourseContent } from './tech-types';

/**
 * JavaScript — Fundamentos.
 *
 * O aluno já sabe estruturar e estilizar uma página. Aqui ela ganha
 * comportamento. Todo exemplo pode ser colado no console do navegador e
 * executado na hora, porque ver o resultado é o que fixa o conceito.
 */
export const JAVASCRIPT: TechCourseContent = {
  'Variáveis, tipos e operadores': {
    problem:
      'Você somou o preço do produto com o valor do frete e o resultado foi "1990500" em vez de 2495. Nenhum erro apareceu.',
    outcome:
      'Guardar valores com a declaração adequada e prever o resultado de uma operação entre tipos diferentes.',
    blocks: [
      {
        kind: 'paragraph',
        text: 'O resultado esquisito acontece porque um dos valores era texto. Quando o JavaScript encontra `+` com um texto de um lado, ele junta em vez de somar. Isso não gera erro — gera um número errado, que é bem pior.',
      },
      {
        kind: 'code',
        language: 'javascript',
        lines: [
          "const preco = '1990';   // veio de um campo de formulario",
          'const frete = 505;',
          '',
          'console.log(preco + frete);',
        ],
      },
      { kind: 'output', lines: ["'1990505'"] },
      {
        kind: 'paragraph',
        text: 'Todo valor digitado num formulário chega como texto. Converter antes de calcular não é opcional.',
      },
      {
        kind: 'code',
        language: 'javascript',
        caption: 'Converter e verificar:',
        lines: [
          'const precoEmCentavos = Number(preco);',
          '',
          'if (Number.isNaN(precoEmCentavos)) {',
          "  throw new Error('Preco invalido: ' + preco);",
          '}',
          '',
          'console.log(precoEmCentavos + frete);',
        ],
      },
      { kind: 'output', lines: ['2495'] },
      { kind: 'heading', text: 'const, let e var' },
      {
        kind: 'table',
        headers: ['Declaração', 'Pode ser reatribuída?', 'Quando usar'],
        rows: [
          ['const', 'Não', 'Padrão — use sempre que possível'],
          ['let', 'Sim', 'Quando o valor realmente muda'],
          ['var', 'Sim, com regras confusas de escopo', 'Não use em código novo'],
        ],
      },
      {
        kind: 'tip',
        text: 'Comece tudo com `const`. Se em algum momento precisar reatribuir, troque para `let`. Assim a intenção fica explícita e o leitor sabe, só de olhar, o que muda ao longo do trecho.',
      },
      {
        kind: 'warning',
        text: '`const` impede trocar o valor, não alterar o conteúdo. Um array declarado com `const` continua aceitando novos itens: o que está travado é a ligação entre o nome e o objeto, não o objeto.',
      },
      { kind: 'heading', text: 'Comparação: sempre com três iguais' },
      {
        kind: 'code',
        language: 'javascript',
        lines: [
          "console.log(0 == '');      // true  - converte antes de comparar",
          "console.log(0 === '');     // false - compara valor e tipo",
          "console.log('10' == 10);   // true",
          "console.log('10' === 10);  // false",
        ],
      },
      {
        kind: 'keyIdea',
        text: 'Use `===` e `!==` sempre. A comparação com dois iguais converte os valores antes de comparar, seguindo regras que quase ninguém lembra por completo — e o resultado surpreende justamente no caso raro que chega em produção.',
      },
      {
        kind: 'paragraph',
        text: 'Outro tropeço frequente: valores que o JavaScript trata como falsos em condições. São eles: `false`, `0`, string vazia, `null`, `undefined` e `NaN`. Um campo de quantidade preenchido com zero é um valor legítimo, mas cai no ramo do "não preenchido" se você testar apenas `if (quantidade)`.',
      },
    ],
    reflection: [
      'Por que somar um valor de formulário sem converter costuma gerar erro silencioso?',
      'Se `const` não permite reatribuir, por que um array declarado com ela aceita novos itens?',
      'Que problema um campo com valor zero causa em `if (quantidade)`? Como corrigir?',
    ],
    checklist: [
      'Declaro tudo com const e troco para let apenas quando reatribuo.',
      'Converto e verifico valores vindos de formulário antes de calcular.',
      'Uso === em todas as comparações.',
      'Sei listar os valores tratados como falsos.',
    ],
  },

  'Condições, loops e funções': {
    problem:
      'Você precisa calcular o desconto de duzentos alunos aplicando três regras diferentes. Copiar o cálculo para cada regra deixa o código impossível de conferir.',
    outcome:
      'Controlar o fluxo com condições e repetições, e isolar regras em funções que podem ser testadas isoladamente.',
    blocks: [
      { kind: 'heading', text: 'Saída antecipada em vez de aninhamento' },
      {
        kind: 'code',
        language: 'javascript',
        caption: 'Difícil de acompanhar — três níveis para dentro:',
        lines: [
          'function calcularDesconto(aluno) {',
          '  if (aluno) {',
          '    if (aluno.ativo) {',
          '      if (aluno.mesesMatriculado >= 12) {',
          '        return 15;',
          '      }',
          '    }',
          '  }',
          '  return 0;',
          '}',
        ],
      },
      {
        kind: 'code',
        language: 'javascript',
        caption: 'Mesma regra, lendo de cima para baixo:',
        lines: [
          'function calcularDescontoEmPorcento(aluno) {',
          '  if (!aluno) return 0;',
          '  if (!aluno.ativo) return 0;',
          '  if (aluno.mesesMatriculado < 12) return 0;',
          '',
          '  return 15;',
          '}',
        ],
      },
      {
        kind: 'paragraph',
        text: 'A segunda versão resolve os casos de saída primeiro e deixa o caminho principal reto no fim. Ela também é mais fácil de estender: uma regra nova é uma linha a mais, não um nível a mais de indentação.',
      },
      { kind: 'heading', text: 'Formas de repetir' },
      {
        kind: 'code',
        language: 'javascript',
        lines: [
          'const notas = [7.5, 4.0, 9.2, 6.8];',
          '',
          '// Quando so interessa o valor',
          'for (const nota of notas) {',
          '  console.log(nota);',
          '}',
          '',
          '// Quando a posicao importa',
          'notas.forEach((nota, indice) => {',
          '  console.log(`${indice + 1}a nota: ${nota}`);',
          '});',
        ],
      },
      {
        kind: 'tip',
        text: 'Prefira `for...of` ao `for` clássico com índice: ele elimina de vez o erro de contar um a mais ou um a menos, que é a causa mais comum de falha em laços.',
      },
      { kind: 'heading', text: 'Funções: três formas, uma diferença que importa' },
      {
        kind: 'code',
        language: 'javascript',
        lines: [
          '// Declaracao',
          'function somar(a, b) {',
          '  return a + b;',
          '}',
          '',
          '// Arrow function',
          'const multiplicar = (a, b) => a * b;',
          '',
          '// Parametro com valor padrao',
          'const aplicarTaxa = (valor, taxa = 0.1) => valor * (1 + taxa);',
        ],
      },
      {
        kind: 'paragraph',
        text: 'Para funções pequenas as duas primeiras são equivalentes na prática. A arrow function é mais curta e é a forma usada dentro de `map` e `filter`, que aparecem na próxima aula.',
      },
      {
        kind: 'warning',
        text: 'Uma função sem `return` devolve `undefined`. Se o seu cálculo está vindo indefinido, confira antes de tudo se você esqueceu de devolver o resultado — é o descuido mais comum de quem está começando.',
      },
      {
        kind: 'keyIdea',
        text: 'Nomeie funções com verbo e diga a unidade quando houver: `calcularDescontoEmPorcento` não deixa dúvida se devolve 15 ou 0,15. Essa dúvida já custou muito dinheiro a muita gente.',
      },
    ],
    reflection: [
      'Reescreva uma função sua com três níveis de if usando saídas antecipadas. Ficou mais fácil de ler?',
      'Quando a posição do item importa numa repetição?',
      'Por que o nome `calcularDescontoEmPorcento` é melhor do que `desconto`?',
    ],
    checklist: [
      'Uso saída antecipada em vez de aninhar condições.',
      'Escolho a forma de repetição conforme a posição importar ou não.',
      'Todas as minhas funções que calculam têm return.',
      'Meus nomes de função começam com verbo.',
    ],
  },

  'Arrays e objetos': {
    problem:
      'Você tem uma lista de cursos e precisa mostrar só os gratuitos, ordenados por carga horária, com o preço formatado. Fazer isso com laços e variáveis auxiliares ocupa trinta linhas.',
    outcome:
      'Transformar coleções encadeando operações que dizem a intenção, e organizar informações relacionadas em objetos.',
    blocks: [
      {
        kind: 'code',
        language: 'javascript',
        caption: 'Os dados desta aula:',
        lines: [
          'const cursos = [',
          "  { titulo: 'Excel para Administracao', horas: 18, precoEmCentavos: 8900, gratuito: false },",
          "  { titulo: 'Logica de Programacao',    horas: 16, precoEmCentavos: 0,    gratuito: true  },",
          "  { titulo: 'Git e GitHub',             horas: 10, precoEmCentavos: 4900, gratuito: false },",
          "  { titulo: 'Carreira Digital',         horas: 8,  precoEmCentavos: 0,    gratuito: true  },",
          '];',
        ],
      },
      { kind: 'heading', text: 'Três operações que resolvem quase tudo' },
      {
        kind: 'table',
        headers: ['Método', 'Pergunta que responde', 'Devolve'],
        rows: [
          ['filter', 'Quais itens atendem à condição?', 'Um array menor'],
          ['map', 'Como transformar cada item?', 'Um array do mesmo tamanho'],
          ['reduce', 'Como juntar tudo num valor só?', 'Um valor'],
          ['find', 'Qual é o primeiro que atende?', 'Um item ou undefined'],
        ],
      },
      {
        kind: 'code',
        language: 'javascript',
        caption: 'O problema da aula, resolvido:',
        lines: [
          'const gratuitos = cursos',
          '  .filter((curso) => curso.gratuito)',
          '  .sort((a, b) => b.horas - a.horas)',
          '  .map((curso) => `${curso.titulo} — ${curso.horas}h`);',
          '',
          'console.log(gratuitos);',
        ],
      },
      {
        kind: 'output',
        lines: ["[ 'Logica de Programacao — 16h', 'Carreira Digital — 8h' ]"],
      },
      {
        kind: 'paragraph',
        text: 'Três linhas dizem o que se quer, na ordem em que se pensa: pegue os gratuitos, ordene do maior para o menor, formate. Um laço com variáveis auxiliares faz o mesmo, mas exige ler o corpo inteiro para descobrir a intenção.',
      },
      {
        kind: 'warning',
        text: '`sort` altera o array original, ao contrário de `filter` e `map`. Se o array de origem for usado em outro lugar, copie antes com `[...cursos].sort(...)` — do contrário você muda dados que alguém mais está lendo.',
      },
      { kind: 'heading', text: 'Somar com reduce' },
      {
        kind: 'code',
        language: 'javascript',
        lines: [
          'const totalEmCentavos = cursos.reduce(',
          '  (total, curso) => total + curso.precoEmCentavos,',
          '  0,',
          ');',
          '',
          'console.log(totalEmCentavos);',
        ],
      },
      { kind: 'output', lines: ['13800'] },
      {
        kind: 'tip',
        text: 'O segundo argumento do `reduce` é o valor inicial, e omiti-lo é fonte de erro em lista vazia. Com o zero explícito, uma lista sem itens devolve zero em vez de estourar.',
      },
      { kind: 'heading', text: 'Objetos: informações que andam juntas' },
      {
        kind: 'code',
        language: 'javascript',
        lines: [
          'const curso = cursos[0];',
          '',
          '// Extrair campos com nome',
          'const { titulo, horas } = curso;',
          '',
          '// Copiar alterando um campo, sem tocar no original',
          'const comDesconto = { ...curso, precoEmCentavos: 7900 };',
          '',
          '// Acesso seguro quando o caminho pode nao existir',
          "const nomeDoAutor = curso.autor?.nome ?? 'Nao informado';",
        ],
      },
      {
        kind: 'paragraph',
        text: 'A última linha resolve um erro clássico: tentar ler uma propriedade de algo que não existe interrompe o programa. O ponto de interrogação devolve indefinido em vez de quebrar, e o `??` fornece o valor de reserva.',
      },
      {
        kind: 'keyIdea',
        text: 'Prefira criar um novo objeto a alterar o existente. Código que não modifica o que recebe é muito mais fácil de depurar, porque um valor não muda pelas costas de quem o está usando.',
      },
    ],
    reflection: [
      'Escreva uma linha que devolva o total em centavos apenas dos cursos pagos.',
      'Por que `sort` exige cuidado que `filter` não exige?',
      'O que acontece ao ler `curso.autor.nome` quando não existe autor? E com o ponto de interrogação?',
    ],
    checklist: [
      'Sei escolher entre filter, map, reduce e find.',
      'Copio o array antes de ordenar quando o original é usado em outro lugar.',
      'Sempre passo o valor inicial do reduce.',
      'Uso acesso seguro em caminhos que podem não existir.',
    ],
  },

  'DOM e seleção de elementos': {
    problem:
      'Seu script diz que o elemento é nulo, mas ele está lá no HTML — você está vendo na tela.',
    outcome:
      'Localizar e alterar elementos da página com segurança, entendendo por que a ordem de execução importa.',
    blocks: [
      {
        kind: 'paragraph',
        text: 'O DOM é a representação da página em memória, montada pelo navegador a partir do HTML. Seu script não mexe no arquivo: mexe nessa árvore. E ela só existe depois que o HTML foi lido — daí o problema desta aula.',
      },
      {
        kind: 'code',
        language: 'html',
        caption: 'A causa: o script roda antes do elemento existir.',
        lines: [
          '<head>',
          '  <script src="app.js"></script>  <!-- roda agora, o body ainda nao foi lido -->',
          '</head>',
          '<body>',
          '  <button id="salvar">Salvar</button>',
          '</body>',
        ],
      },
      {
        kind: 'code',
        language: 'html',
        caption: 'A correção: defer espera o HTML terminar.',
        lines: ['<head>', '  <script src="app.js" defer></script>', '</head>'],
      },
      {
        kind: 'tip',
        text: '`defer` baixa o arquivo em paralelo e executa só quando o HTML estiver pronto. É a solução preferida hoje — melhor do que mover o script para o fim do corpo, porque o download começa antes.',
      },
      { kind: 'heading', text: 'Selecionar' },
      {
        kind: 'code',
        language: 'javascript',
        lines: [
          'function ligarBotaoSalvar() {',
          "  const botao = document.querySelector('#salvar');",
          "  const cartoes = document.querySelectorAll('.cartao');",
          '',
          '  // Sempre confirme que existe antes de usar',
          '  if (!botao) {',
          "    console.warn('Botao salvar nao encontrado.');",
          '    return;',
          '  }',
          '',
          '  console.log(`${cartoes.length} cartoes na tela`);',
          '}',
        ],
      },
      {
        kind: 'paragraph',
        text: '`querySelector` devolve o primeiro que casa, ou nulo. `querySelectorAll` devolve uma lista, que pode estar vazia — e uma lista vazia não é nula, então percorrê-la simplesmente não faz nada, sem erro.',
      },
      { kind: 'heading', text: 'Alterar conteúdo com segurança' },
      {
        kind: 'table',
        headers: ['Propriedade', 'O que faz', 'Risco'],
        rows: [
          ['textContent', 'Escreve texto puro', 'Nenhum — é a escolha padrão'],
          ['innerHTML', 'Interpreta o conteúdo como HTML', 'Executa marcação vinda do usuário'],
        ],
      },
      {
        kind: 'warning',
        text: 'Nunca coloque em `innerHTML` algo digitado por uma pessoa. Um texto com marcação maliciosa passa a ser executado como parte da sua página, com acesso aos dados de quem está logado. Para exibir texto, use `textContent` — sempre.',
      },
      {
        kind: 'code',
        language: 'javascript',
        lines: [
          'const nome = campoNome.value;   // veio do usuario',
          '',
          '// Errado',
          "// resultado.innerHTML = 'Ola, ' + nome;",
          '',
          '// Certo',
          "resultado.textContent = 'Ola, ' + nome;",
        ],
      },
      { kind: 'heading', text: 'Classes em vez de estilo direto' },
      {
        kind: 'code',
        language: 'javascript',
        lines: [
          "cartao.classList.add('cartao--selecionado');",
          "cartao.classList.remove('cartao--selecionado');",
          "cartao.classList.toggle('cartao--selecionado');",
        ],
      },
      {
        kind: 'keyIdea',
        text: 'Deixe a aparência no CSS e use o JavaScript apenas para trocar classes. Assim o visual continua num lugar só, e mudar o design não exige mexer na lógica.',
      },
    ],
    reflection: [
      'Por que um elemento existente no HTML pode ser nulo no seu script?',
      'Que ataque `innerHTML` com texto do usuário torna possível?',
      'Por que trocar classe é melhor do que definir estilo direto pelo script?',
    ],
    checklist: [
      'Meus scripts usam defer.',
      'Confiro se o elemento existe antes de usá-lo.',
      'Uso textContent para exibir texto de usuário.',
      'Controlo aparência trocando classes.',
    ],
  },

  'Eventos e formulários': {
    problem:
      'A pessoa clica em enviar, a página pisca e tudo o que foi digitado some. Nenhum erro aparece no console.',
    outcome:
      'Responder a ações do usuário e assumir o controle do envio de um formulário sem perder os dados.',
    blocks: [
      {
        kind: 'paragraph',
        text: 'O piscar é o comportamento padrão do formulário: ele recarrega a página enviando os dados. Para tratar o envio com JavaScript, é preciso pedir ao navegador que não faça isso.',
      },
      {
        kind: 'code',
        language: 'javascript',
        lines: [
          "const formulario = document.querySelector('#inscricao');",
          '',
          "formulario.addEventListener('submit', (evento) => {",
          '  evento.preventDefault();   // sem esta linha a pagina recarrega',
          '',
          '  const dados = new FormData(formulario);',
          "  const email = dados.get('email');",
          '',
          '  console.log(email);',
          '});',
        ],
      },
      {
        kind: 'tip',
        text: 'Escute o evento de envio no formulário, não o clique no botão. Assim você também trata quem enviou apertando Enter dentro de um campo — que é como muita gente preenche formulário.',
      },
      { kind: 'heading', text: 'Delegação: um ouvinte para muitos elementos' },
      {
        kind: 'paragraph',
        text: 'Colocar um ouvinte em cada item de uma lista tem dois problemas: custa memória e não funciona para itens criados depois. A solução é ouvir no contêiner e descobrir quem foi clicado.',
      },
      {
        kind: 'code',
        language: 'javascript',
        lines: [
          "lista.addEventListener('click', (evento) => {",
          "  const botao = evento.target.closest('.remover');",
          '  if (!botao) return;   // clicou em outro lugar da lista',
          '',
          "  const item = botao.closest('.item');",
          '  item.remove();',
          '});',
        ],
      },
      {
        kind: 'paragraph',
        text: '`closest` sobe pela árvore procurando o elemento que casa. Isso resolve o caso do clique ter caído num ícone dentro do botão, em vez do botão — situação que quebra a verificação ingênua e é difícil de descobrir.',
      },
      { kind: 'heading', text: 'Validação nos dois lados' },
      {
        kind: 'code',
        language: 'javascript',
        lines: [
          'function validarEmail(dados) {',
          "  const email = dados.get('email').trim();",
          '',
          '  if (!email) {',
          "    mostrarErro('Informe o e-mail.');",
          '    return false;',
          '  }',
          '',
          "  if (!email.includes('@')) {",
          "    mostrarErro('Informe um e-mail valido, como nome@exemplo.com');",
          '    return false;',
          '  }',
          '',
          '  return true;',
          '}',
        ],
      },
      {
        kind: 'warning',
        text: 'Validação no navegador serve para dar resposta rápida a quem está preenchendo — nunca para segurança. Qualquer pessoa pode desativar o JavaScript ou enviar o pedido direto. Toda regra precisa ser verificada de novo no servidor, sem exceção.',
      },
      { kind: 'heading', text: 'Estado do botão durante o envio' },
      {
        kind: 'code',
        language: 'javascript',
        lines: [
          'botao.disabled = true;',
          "botao.textContent = 'Enviando...';",
          '',
          'try {',
          '  await enviar(dados);',
          '} finally {',
          '  botao.disabled = false;',
          "  botao.textContent = 'Enviar';",
          '}',
        ],
      },
      {
        kind: 'keyIdea',
        text: 'O `finally` garante que o botão volte ao normal mesmo se o envio falhar. Sem ele, um erro deixa a pessoa com um botão travado em "Enviando..." e nenhuma explicação.',
      },
    ],
    reflection: [
      'Por que ouvir o envio do formulário cobre mais casos do que ouvir o clique no botão?',
      'O que acontece com a delegação se o clique cair num ícone dentro do botão?',
      'Por que validar no navegador não substitui validar no servidor?',
    ],
    checklist: [
      'Uso preventDefault ao tratar envio de formulário.',
      'Escuto no formulário, não no botão.',
      'Uso delegação para listas que mudam.',
      'Restauro o estado do botão com finally.',
    ],
  },

  'Estado e armazenamento local': {
    problem:
      'A lista de tarefas funciona perfeitamente. A pessoa recarrega a página e tudo desaparece.',
    outcome:
      'Manter a interface como reflexo de um estado central e preservar esse estado entre visitas.',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Estado é o conjunto de informações que descrevem a situação atual da aplicação. O erro comum é guardá-lo espalhado pela própria tela — lendo o texto de um elemento para descobrir se a tarefa está concluída. A tela deve ser o resultado do estado, nunca a fonte dele.',
      },
      {
        kind: 'code',
        language: 'javascript',
        caption: 'Um lugar só guarda a verdade; a tela é redesenhada a partir dele:',
        lines: [
          'let tarefas = [];',
          '',
          'function renderizar() {',
          "  lista.innerHTML = '';",
          '  for (const tarefa of tarefas) {',
          "    const item = document.createElement('li');",
          '    item.textContent = tarefa.titulo;',
          "    item.classList.toggle('concluida', tarefa.concluida);",
          '    lista.appendChild(item);',
          '  }',
          '}',
          '',
          'function adicionar(titulo) {',
          '  tarefas = [...tarefas, { id: crypto.randomUUID(), titulo, concluida: false }];',
          '  salvar();',
          '  renderizar();',
          '}',
        ],
      },
      {
        kind: 'analogy',
        text: 'É a diferença entre um painel que mostra o estoque e um painel que é o estoque. Se a contagem só existe no painel, apagá-lo apaga a informação. O estado é o depósito; a tela é o painel.',
      },
      { kind: 'heading', text: 'Guardar entre visitas' },
      {
        kind: 'code',
        language: 'javascript',
        lines: [
          "const CHAVE = 'romalearn:tarefas';",
          '',
          'function salvar() {',
          '  try {',
          '    localStorage.setItem(CHAVE, JSON.stringify(tarefas));',
          '  } catch {',
          '    // Navegacao privativa ou cota cheia: segue sem persistir.',
          '  }',
          '}',
          '',
          'function carregar() {',
          '  try {',
          '    const bruto = localStorage.getItem(CHAVE);',
          '    const lido = bruto ? JSON.parse(bruto) : [];',
          '    return Array.isArray(lido) ? lido : [];',
          '  } catch {',
          '    return [];',
          '  }',
          '}',
        ],
      },
      {
        kind: 'paragraph',
        text: 'Três cuidados aparecem aqui. O armazenamento só guarda texto, por isso a conversão para JSON. Ele pode falhar em navegação privativa. E o conteúdo pode ter sido alterado à mão — daí a verificação de que o que voltou é mesmo uma lista.',
      },
      {
        kind: 'warning',
        text: 'O armazenamento local é visível e editável por qualquer pessoa com acesso ao navegador. Nunca guarde ali senha, token de acesso ou dado pessoal de terceiros. Ele serve para preferências e rascunhos, não para segredo.',
      },
      { kind: 'heading', text: 'Identificar itens de verdade' },
      {
        kind: 'paragraph',
        text: 'Usar a posição na lista como identificador quebra assim que algo é removido: todos os itens seguintes mudam de posição. Gere um identificador estável na criação e trabalhe sempre por ele.',
      },
      {
        kind: 'code',
        language: 'javascript',
        lines: [
          'function alternarConclusao(id) {',
          '  tarefas = tarefas.map((tarefa) =>',
          '    tarefa.id === id ? { ...tarefa, concluida: !tarefa.concluida } : tarefa,',
          '  );',
          '  salvar();',
          '  renderizar();',
          '}',
        ],
      },
      {
        kind: 'keyIdea',
        text: 'Toda alteração segue o mesmo caminho: muda o estado, salva, redesenha. Quando esse caminho é único, a tela nunca fica dessincronizada dos dados.',
      },
    ],
    reflection: [
      'Por que ler o estado da própria tela dá problema quando a interface muda?',
      'O que pode dar errado ao ler do armazenamento local sem verificar o conteúdo?',
      'Por que a posição na lista é um identificador ruim?',
    ],
    checklist: [
      'Meu estado vive num lugar só e a tela é redesenhada a partir dele.',
      'Trato falha ao ler e ao gravar no armazenamento.',
      'Verifico o formato do que li antes de usar.',
      'Cada item tem identificador estável.',
      'Não guardo nada sensível no navegador.',
    ],
  },

  'Promises, async e await': {
    problem:
      'Você buscou os dados e mandou exibir na linha seguinte. A tela mostrou "undefined" — e o dado chegou meio segundo depois, quando ninguém mais estava olhando.',
    outcome:
      'Escrever código que aguarda operações demoradas sem travar a página, e tratar a falha dessas operações.',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Buscar dados na rede leva tempo. O JavaScript não fica parado esperando: ele segue para a próxima linha e avisa depois, quando o resultado chegar. Por isso a linha seguinte encontra o valor ainda vazio.',
      },
      {
        kind: 'analogy',
        text: 'É a senha da lanchonete. Você pede, recebe a senha e senta — não fica de pé no balcão bloqueando a fila. A senha é a promessa: um comprovante de que o lanche vai chegar, ou de que vão avisar que acabou.',
      },
      { kind: 'heading', text: 'Os três estados de uma promessa' },
      {
        kind: 'table',
        headers: ['Estado', 'Significa'],
        rows: [
          ['Pendente', 'Ainda em andamento'],
          ['Resolvida', 'Terminou com um valor'],
          ['Rejeitada', 'Terminou com um erro'],
        ],
      },
      {
        kind: 'code',
        language: 'javascript',
        caption: 'Errado — não espera:',
        lines: ['const cursos = buscarCursos();', 'console.log(cursos.length);'],
      },
      { kind: 'output', lines: ['TypeError: Cannot read properties of undefined'] },
      {
        kind: 'code',
        language: 'javascript',
        caption: 'Certo — await pausa até o resultado chegar:',
        lines: [
          'async function mostrarCursos() {',
          '  const cursos = await buscarCursos();',
          '  console.log(cursos.length);',
          '}',
        ],
      },
      {
        kind: 'paragraph',
        text: 'Duas regras: `await` só existe dentro de função marcada com `async`, e toda função `async` devolve uma promessa — inclusive quando o corpo dela parece devolver um valor comum.',
      },
      { kind: 'heading', text: 'Tratar a falha' },
      {
        kind: 'code',
        language: 'javascript',
        lines: [
          'async function carregar() {',
          '  mostrarCarregando();',
          '',
          '  try {',
          '    const cursos = await buscarCursos();',
          '    if (cursos.length === 0) {',
          '      mostrarVazio();',
          '      return;',
          '    }',
          '    mostrarLista(cursos);',
          '  } catch (erro) {',
          "    mostrarErro('Nao foi possivel carregar os cursos. Tente de novo.');",
          '    console.error(erro);',
          '  } finally {',
          '    esconderCarregando();',
          '  }',
          '}',
        ],
      },
      {
        kind: 'keyIdea',
        text: 'Toda busca de dados tem quatro desfechos, e a interface precisa cobrir os quatro: carregando, sucesso com dados, sucesso sem dados e erro. Esquecer o terceiro deixa a tela em branco sem explicação; esquecer o quarto deixa o carregamento girando para sempre.',
      },
      {
        kind: 'warning',
        text: 'A mensagem mostrada ao usuário deve dizer o que fazer, em português claro. Detalhe técnico vai para o console, não para a tela: expor a mensagem interna confunde quem lê e às vezes revela informação sobre a estrutura do sistema.',
      },
      { kind: 'heading', text: 'Em paralelo, quando não dependem entre si' },
      {
        kind: 'code',
        language: 'javascript',
        lines: [
          '// Em sequencia: soma os tempos',
          'const cursos = await buscarCursos();',
          'const trilhas = await buscarTrilhas();',
          '',
          '// Em paralelo: vale o mais demorado',
          'const [cursos2, trilhas2] = await Promise.all([',
          '  buscarCursos(),',
          '  buscarTrilhas(),',
          ']);',
        ],
      },
      {
        kind: 'tip',
        text: 'Use a forma paralela sempre que uma busca não depender do resultado da outra. Duas chamadas de meio segundo cada passam de um segundo para meio segundo — diferença que o usuário sente.',
      },
    ],
    reflection: [
      'Por que a linha seguinte a uma busca encontra o valor vazio?',
      'Cite os quatro desfechos que uma tela que busca dados precisa tratar.',
      'Quando duas buscas não podem ser feitas em paralelo?',
    ],
    checklist: [
      'Uso await dentro de função async.',
      'Trato erro com try/catch e limpo o carregando no finally.',
      'Minha interface cobre carregando, sucesso, vazio e erro.',
      'Mensagens de erro na tela são em linguagem clara.',
    ],
  },

  'Fetch e APIs REST': {
    problem:
      'A busca funcionou no seu computador. No de outra pessoa, o console mostra um erro sobre CORS e nada carrega.',
    outcome:
      'Consumir uma API entendendo o que a resposta traz, tratando os erros que o navegador não trata sozinho.',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Uma API REST entrega dados por endereços, geralmente em JSON. Você pede, ela responde com um código de situação e um conteúdo.',
      },
      {
        kind: 'code',
        language: 'javascript',
        lines: [
          'async function buscarCursos() {',
          "  const resposta = await fetch('https://api.exemplo.com/cursos');",
          '',
          '  if (!resposta.ok) {',
          '    throw new Error(`A API respondeu ${resposta.status}`);',
          '  }',
          '',
          '  return resposta.json();',
          '}',
        ],
      },
      {
        kind: 'warning',
        text: 'A verificação de `resposta.ok` não é opcional. `fetch` só rejeita a promessa quando a requisição nem sai — uma resposta 404 ou 500 é considerada sucesso de rede. Sem essa linha, você tenta ler a página de erro como se fosse a lista de cursos.',
      },
      { kind: 'heading', text: 'Os verbos' },
      {
        kind: 'table',
        headers: ['Método', 'Serve para', 'Repetir é seguro?'],
        rows: [
          ['GET', 'Buscar', 'Sim'],
          ['POST', 'Criar', 'Não — cria de novo'],
          ['PUT / PATCH', 'Atualizar', 'Sim'],
          ['DELETE', 'Remover', 'Sim'],
        ],
      },
      {
        kind: 'code',
        language: 'javascript',
        caption: 'Enviando dados:',
        lines: [
          "const resposta = await fetch('https://api.exemplo.com/inscricoes', {",
          "  method: 'POST',",
          "  headers: { 'Content-Type': 'application/json' },",
          '  body: JSON.stringify({ cursoId, email }),',
          '});',
        ],
      },
      { kind: 'heading', text: 'CORS: por que funciona na sua máquina e não na outra' },
      {
        kind: 'paragraph',
        text: 'Por segurança, o navegador impede que uma página de um endereço leia dados de outro sem autorização explícita. Essa autorização vem do servidor, em um cabeçalho da resposta. Quando ele não autoriza, o navegador bloqueia — e o erro aparece do seu lado, embora a causa esteja no servidor.',
      },
      {
        kind: 'keyIdea',
        text: 'CORS não pode ser resolvido no código do navegador. Ou o servidor autoriza a sua origem, ou o pedido passa por um servidor seu que faz a chamada. Qualquer tutorial que prometa desativar CORS no navegador está ensinando a desligar uma proteção do usuário.',
      },
      { kind: 'heading', text: 'Cancelar e limitar tempo' },
      {
        kind: 'code',
        language: 'javascript',
        lines: [
          'async function buscarComPrazo(url) {',
          '  const controle = new AbortController();',
          '  const prazo = setTimeout(() => controle.abort(), 8000);',
          '',
          '  try {',
          '    const resposta = await fetch(url, { signal: controle.signal });',
          '    return await resposta.json();',
          '  } finally {',
          '    clearTimeout(prazo);',
          '  }',
          '}',
        ],
      },
      {
        kind: 'paragraph',
        text: 'Sem um prazo, uma API lenta deixa a tela carregando indefinidamente. Oito segundos e uma mensagem clara tratam melhor a pessoa do que um carregamento eterno.',
      },
      {
        kind: 'warning',
        text: 'Chave de API nunca vai no código do navegador. Tudo o que chega ao navegador é visível para qualquer pessoa que abrir as ferramentas do desenvolvedor. Chamadas que exigem chave precisam passar por um servidor seu.',
      },
    ],
    reflection: [
      'Por que `fetch` não lança erro quando a API responde 404?',
      'Por que CORS não pode ser resolvido no código do navegador?',
      'O que acontece com a interface se a API demorar trinta segundos e não houver prazo?',
    ],
    checklist: [
      'Verifico resposta.ok antes de ler o conteúdo.',
      'Sei explicar o que é CORS e de quem é a solução.',
      'Defini prazo máximo para as chamadas.',
      'Nenhuma chave de API aparece no código do navegador.',
    ],
  },
};
