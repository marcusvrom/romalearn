import type { TechCourseContent } from './tech-types';

/**
 * Git e GitHub na Prática.
 *
 * O aluno chega com pastas do tipo "projeto_final_v3_AGORA_VAI" e sai com um
 * repositório que conta a história do próprio trabalho. Cada aula usa comandos
 * reais, com a saída que aparece no terminal, porque ler a saída é metade do
 * aprendizado.
 */
export const GIT: TechCourseContent = {
  'Por que versionar código': {
    problem:
      'Na pasta do trabalho existem sete arquivos: relatorio.docx, relatorio_final.docx, relatorio_final_v2.docx, relatorio_final_CORRIGIDO.docx. Ninguém sabe qual é o bom.',
    outcome:
      'Explicar o que um sistema de versão guarda além do arquivo, e por que isso resolve problemas que copiar e renomear nunca resolve.',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Todo mundo já inventou um sistema de versão. Acrescentar "_final" ao nome é um. O problema não é a ideia, é que ela não guarda o que importa: quem mudou, quando, e principalmente por quê. Sem isso, você tem sete arquivos e nenhuma história.',
      },
      {
        kind: 'analogy',
        text: 'Um controle de versão é o livro de ocorrências de um prédio. Não guarda só o estado atual: guarda cada alteração, a data, o responsável e o motivo. Quando algo para de funcionar, você não adivinha — você lê o registro do dia em que funcionava.',
      },
      { kind: 'heading', text: 'O que o Git guarda' },
      {
        kind: 'table',
        headers: ['Conceito', 'O que é', 'Equivalente no mundo dos arquivos'],
        rows: [
          [
            'Repositório',
            'A pasta do projeto mais todo o histórico',
            'A pasta e o livro de ocorrências juntos',
          ],
          [
            'Commit',
            'Uma fotografia do projeto num instante, com autor, data e motivo',
            'Uma versão salva, mas com explicação',
          ],
          ['Histórico', 'A sequência de commits', 'A lista completa de versões, em ordem'],
        ],
      },
      {
        kind: 'paragraph',
        text: 'A diferença decisiva está no commit. Ele não guarda apenas o conteúdo: guarda a intenção. "Corrige cálculo de frete para CEPs do Norte" é uma informação que nenhum nome de arquivo carrega, e é ela que salva você seis meses depois.',
      },
      { kind: 'heading', text: 'O que isso resolve na prática' },
      {
        kind: 'list',
        items: [
          'Voltar para uma versão que funcionava, sem depender de lembrar qual era.',
          'Descobrir quando um defeito entrou, comparando versões.',
          'Trabalhar em duas coisas ao mesmo tempo sem que uma atrapalhe a outra.',
          'Duas pessoas mexerem no mesmo projeto sem sobrescrever o trabalho uma da outra.',
        ],
      },
      {
        kind: 'keyIdea',
        text: 'Git é local: o histórico inteiro fica no seu computador e funciona sem internet. GitHub é um serviço que hospeda repositórios Git para compartilhar e colaborar. São coisas diferentes, e confundi-las atrapalha o resto do curso.',
      },
      {
        kind: 'warning',
        text: 'Controle de versão não é backup. Ele guarda a história do que você registrou; se o computador queimar e você nunca tiver enviado nada para um servidor, a história queima junto.',
      },
    ],
    reflection: [
      'Quantas versões de um mesmo arquivo existem hoje na sua pasta de trabalho? O que diferencia uma da outra?',
      'Que informação um commit guarda que o nome de um arquivo nunca vai guardar?',
      'Por que Git funcionar sem internet é uma vantagem prática no dia a dia?',
    ],
    checklist: [
      'Sei explicar a diferença entre Git e GitHub.',
      'Sei o que um commit guarda além do conteúdo do arquivo.',
      'Consigo citar dois problemas que renomear arquivos não resolve.',
    ],
  },

  'Instalação e configuração inicial': {
    problem:
      'Você instalou o Git e fez o primeiro commit. Ele foi registrado no nome de "unknown", com um e-mail que não é o seu.',
    outcome:
      'Deixar o ambiente configurado de forma que todo commit seu saia assinado corretamente, sem precisar repetir a configuração a cada projeto.',
    blocks: [
      {
        kind: 'paragraph',
        text: 'O Git assina cada commit com um nome e um e-mail. Ele não descobre isso sozinho — precisa ser informado uma vez. Commits mal assinados não quebram nada, mas somem do seu histórico de contribuições e ficam impossíveis de rastrear numa equipe.',
      },
      { kind: 'heading', text: 'A configuração mínima' },
      {
        kind: 'code',
        language: 'bash',
        lines: [
          'git config --global user.name "Seu Nome Completo"',
          'git config --global user.email "seu-email@exemplo.com"',
          '',
          '# Conferir o que ficou gravado',
          'git config --global --list',
        ],
      },
      {
        kind: 'output',
        lines: [
          'user.name=Seu Nome Completo',
          'user.email=seu-email@exemplo.com',
          'init.defaultbranch=main',
        ],
      },
      {
        kind: 'paragraph',
        text: 'O parâmetro `--global` significa "vale para todos os projetos deste computador". Sem ele, a configuração vale só para o repositório atual — útil quando você usa um e-mail no trabalho e outro nos projetos pessoais.',
      },
      {
        kind: 'tip',
        text: 'Use no Git o mesmo e-mail cadastrado no GitHub. É por ele que o serviço associa seus commits ao seu perfil; com um e-mail diferente, o trabalho aparece no histórico do projeto mas não no seu.',
      },
      { kind: 'heading', text: 'Duas configurações que evitam dor de cabeça' },
      {
        kind: 'code',
        language: 'bash',
        lines: [
          '# Nome padrao da branch principal em projetos novos',
          'git config --global init.defaultBranch main',
          '',
          '# Editor usado quando o Git pedir um texto mais longo',
          'git config --global core.editor "code --wait"',
        ],
      },
      {
        kind: 'paragraph',
        text: 'A segunda linha resolve um susto clássico: sem editor configurado, o Git abre o Vim, e quem nunca o usou fica preso numa tela sem saber como sair. Se isso acontecer, pressione Esc, digite dois-pontos, q, exclamação e Enter.',
      },
      { kind: 'heading', text: 'O terminal, sem mistério' },
      {
        kind: 'table',
        headers: ['Comando', 'O que faz'],
        rows: [
          ['pwd', 'Mostra em que pasta você está'],
          ['ls', 'Lista o que existe na pasta atual'],
          ['cd nome-da-pasta', 'Entra na pasta'],
          ['cd ..', 'Volta uma pasta'],
        ],
      },
      {
        kind: 'warning',
        text: 'Quase todo problema de iniciante com Git é estar na pasta errada. Antes de qualquer comando, confira com `pwd` onde você está — o Git só enxerga o repositório da pasta atual.',
      },
    ],
    reflection: [
      'Por que usar o mesmo e-mail no Git e no GitHub importa para quem está montando portfólio?',
      'Em que situação você usaria uma configuração sem `--global`?',
      'O que acontece se você rodar um comando do Git numa pasta que não é um repositório?',
    ],
    checklist: [
      'Configurei nome e e-mail e conferi com `git config --global --list`.',
      'O e-mail configurado é o mesmo da minha conta no GitHub.',
      'Sei navegar entre pastas pelo terminal.',
    ],
  },

  'Add, commit e status': {
    problem:
      'Você mudou cinco arquivos resolvendo três problemas diferentes e quer registrar tudo. Um commit único vai misturar as três coisas para sempre.',
    outcome:
      'Registrar mudanças em commits pequenos, cada um com um propósito, usando a área de preparação para escolher o que entra em cada um.',
    blocks: [
      {
        kind: 'paragraph',
        text: 'O Git tem três lugares onde um arquivo pode estar, e entender isso é o que separa quem usa Git de quem decora comandos.',
      },
      {
        kind: 'table',
        headers: ['Lugar', 'Significa', 'Como chega lá'],
        rows: [
          ['Working tree', 'Você alterou, o Git ainda não anotou', 'Editando o arquivo'],
          ['Stage', 'Você escolheu incluir no próximo commit', 'git add'],
          ['Repositório', 'Registrado no histórico, com autor e mensagem', 'git commit'],
        ],
      },
      {
        kind: 'analogy',
        text: 'O stage é a mesa onde você separa o que vai na caixa antes de fechá-la. Você pode colocar e tirar itens à vontade; o commit é o momento de lacrar e etiquetar. É por existir essa mesa que dá para separar três problemas em três caixas.',
      },
      { kind: 'heading', text: 'O ciclo completo' },
      {
        kind: 'code',
        language: 'bash',
        lines: [
          'git status',
          'git add calculo-frete.js',
          'git commit -m "Corrige frete para CEPs do Norte"',
          '',
          'git add estilos.css',
          'git commit -m "Aumenta contraste do botao principal"',
        ],
      },
      {
        kind: 'paragraph',
        text: 'Repare que os arquivos foram adicionados em separado, gerando dois commits com propósitos distintos. Se um dos dois causar problema, é possível desfazer só ele.',
      },
      {
        kind: 'output',
        caption: 'A saída de `git status` antes do primeiro add:',
        lines: [
          'No branch main',
          'Changes not staged for commit:',
          '  modified:   calculo-frete.js',
          '  modified:   estilos.css',
          '',
          'no changes added to commit',
        ],
      },
      {
        kind: 'tip',
        text: 'Rode `git status` antes e depois de cada comando enquanto estiver aprendendo. Ele é o comando mais informativo do Git e diz sempre em que estado você está e qual é o próximo passo possível.',
      },
      { kind: 'heading', text: 'Mensagens de commit que servem para alguma coisa' },
      {
        kind: 'table',
        headers: ['Mensagem', 'Problema'],
        rows: [
          ['ajustes', 'Não diz o que nem por quê'],
          ['correções finais', 'Todo commit é final quando é escrito'],
          ['agora vai', 'Registra a emoção, não a mudança'],
          ['Corrige frete para CEPs do Norte', 'diz o que mudou e onde'],
          ['Valida CPF antes de gravar o cadastro', 'diz o que passou a acontecer'],
        ],
      },
      {
        kind: 'paragraph',
        text: 'Uma boa mensagem completa a frase "ao aplicar este commit, o projeto vai...". Escreva no presente, comece com um verbo e descreva o efeito, não o esforço.',
      },
      {
        kind: 'warning',
        text: 'Nunca registre senhas, chaves de acesso ou dados pessoais reais. Apagar num commit seguinte não resolve: o valor continua no histórico e continua acessível para qualquer pessoa que clonar o repositório.',
      },
      { kind: 'heading', text: 'Erros comuns nesta etapa' },
      {
        kind: 'list',
        items: [
          'Usar `git add .` sem olhar o que está entrando, incluindo arquivos temporários e configurações locais.',
          'Fazer um commit gigante no fim do dia com tudo misturado.',
          'Escrever mensagem que descreve o arquivo alterado em vez do problema resolvido.',
        ],
      },
    ],
    reflection: [
      'Por que existir uma etapa entre editar e registrar torna possível separar três problemas em três commits?',
      'Reescreva "ajustes gerais" como uma mensagem útil, inventando um contexto.',
      'O que você faria ao perceber que registrou uma senha por engano?',
    ],
    checklist: [
      'Sei explicar os três estados de um arquivo no Git.',
      'Fiz pelo menos dois commits separados por propósito.',
      'Minhas mensagens começam com verbo e dizem o efeito da mudança.',
      'Conferi com `git status` antes de cada commit.',
    ],
  },

  'Repositório remoto e push': {
    problem:
      'O histórico está bonito, mas só existe no seu notebook. Se ele for roubado amanhã, some tudo — e ninguém mais consegue ver seu trabalho.',
    outcome:
      'Conectar o repositório local a um remoto no GitHub e manter os dois sincronizados nos dois sentidos.',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Até aqui o Git foi uma ferramenta solitária. O remoto é a cópia do repositório que fica num servidor, e é o que permite três coisas: sobreviver à perda do computador, trabalhar de mais de uma máquina e colaborar.',
      },
      { kind: 'heading', text: 'Conectando o local ao remoto' },
      {
        kind: 'code',
        language: 'bash',
        lines: [
          'git remote add origin https://github.com/usuario/projeto.git',
          'git branch -M main',
          'git push -u origin main',
        ],
      },
      {
        kind: 'table',
        headers: ['Comando', 'O que faz'],
        rows: [
          ['remote add origin', 'Registra o endereço do servidor com o apelido "origin"'],
          ['branch -M main', 'Padroniza o nome da branch principal'],
          ['push -u origin main', 'Envia os commits e liga a branch local à remota'],
        ],
      },
      {
        kind: 'paragraph',
        text: 'O `-u` do terceiro comando é o que faz diferença no dia seguinte: depois dele, `git push` e `git pull` sozinhos já sabem para onde ir. Sem ele, seria preciso repetir origin e main toda vez.',
      },
      {
        kind: 'keyIdea',
        text: '"origin" não é palavra reservada do Git: é apenas o apelido convencional do remoto principal. Você poderia chamá-lo de qualquer coisa — mas todo mundo usa origin, e seguir a convenção poupa explicações.',
      },
      { kind: 'heading', text: 'Os dois sentidos' },
      {
        kind: 'code',
        language: 'bash',
        lines: [
          'git push    # envia seus commits para o servidor',
          'git pull    # traz os commits que outras pessoas enviaram',
        ],
      },
      {
        kind: 'paragraph',
        text: 'A regra prática que evita a maior parte dos transtornos: dê `git pull` antes de começar a trabalhar e `git push` ao terminar. Quanto mais tempo o seu local fica diferente do remoto, mais trabalhosa fica a reconciliação.',
      },
      {
        kind: 'output',
        caption: 'Quando o servidor tem commits que você não tem:',
        lines: [
          'To https://github.com/usuario/projeto.git',
          ' ! [rejected]        main -> main (fetch first)',
          'error: failed to push some refs',
          'hint: Updates were rejected because the remote contains work that you do not have locally.',
        ],
      },
      {
        kind: 'paragraph',
        text: 'Essa mensagem assusta e está apenas protegendo você: aceitar o envio apagaria o trabalho de outra pessoa. A solução é `git pull`, resolver o que vier, e enviar de novo.',
      },
      {
        kind: 'warning',
        text: 'Existe uma opção que força o envio e sobrescreve o servidor. Ela apaga trabalho alheio sem aviso e não deve ser usada em branch compartilhada enquanto você estiver aprendendo.',
      },
      { kind: 'heading', text: 'Autenticação' },
      {
        kind: 'paragraph',
        text: 'O GitHub não aceita mais senha da conta pelo terminal. As opções são um token de acesso pessoal ou uma chave SSH. Em qualquer uma delas vale a mesma regra da aula anterior: a credencial nunca entra em um commit.',
      },
    ],
    reflection: [
      'Por que o Git recusa o envio quando o servidor tem commits que você não tem?',
      'O que o `-u` do primeiro push economiza nos dias seguintes?',
      'Qual o risco de passar uma semana sem enviar nada para o remoto?',
    ],
    checklist: [
      'Conectei um repositório local a um remoto no GitHub.',
      'Enviei commits e conferi que apareceram no site.',
      'Sei o que fazer quando o envio é recusado.',
      'Nenhuma credencial minha está registrada no histórico.',
    ],
  },

  'Branches e merge': {
    problem:
      'O site está no ar e funcionando. Você precisa experimentar uma mudança grande, mas não pode quebrar o que já está publicado enquanto experimenta.',
    outcome:
      'Isolar um trabalho em uma branch, integrá-lo quando estiver pronto e resolver um conflito com segurança.',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Branch é uma linha de trabalho paralela. Você parte do estado atual, faz o que precisa, e a versão principal continua intacta o tempo todo. Se a experiência der errado, basta descartar a branch — nada do que estava funcionando foi tocado.',
      },
      {
        kind: 'analogy',
        text: 'É a diferença entre reformar a cozinha da casa onde a família mora e montar a cozinha nova em outro cômodo, mudando tudo de uma vez quando estiver pronta. Enquanto a obra corre, ninguém fica sem jantar.',
      },
      { kind: 'heading', text: 'O ciclo de uma branch' },
      {
        kind: 'code',
        language: 'bash',
        lines: [
          'git switch -c filtro-de-busca   # cria e ja entra nela',
          '',
          '# ... trabalha, faz commits ...',
          '',
          'git switch main                 # volta para a principal',
          'git merge filtro-de-busca       # integra o trabalho',
          'git branch -d filtro-de-busca   # apaga a branch ja integrada',
        ],
      },
      {
        kind: 'tip',
        text: 'Nomeie a branch pelo que ela entrega, não pelo dia ou pelo seu nome. `filtro-de-busca` diz o que tem dentro; `teste2` obriga qualquer pessoa a abrir para descobrir.',
      },
      { kind: 'heading', text: 'Conflitos: quando o Git precisa de você' },
      {
        kind: 'paragraph',
        text: 'O Git integra sozinho quando as mudanças estão em partes diferentes. Quando duas branches alteram as mesmas linhas, ele para e pede uma decisão — porque escolher qual versão vale é decisão humana, não automática.',
      },
      {
        kind: 'output',
        caption: 'Como o conflito aparece dentro do arquivo:',
        lines: [
          '<<<<<<< HEAD',
          'const limiteDeItens = 20;',
          '=======',
          'const limiteDeItens = 50;',
          '>>>>>>> filtro-de-busca',
        ],
      },
      {
        kind: 'steps',
        items: [
          'A parte de cima, depois de HEAD, é o que está na branch em que você se encontra.',
          'A parte de baixo é o que vem da branch sendo integrada.',
          'Decida qual valor vale — ou escreva um terceiro que resolva os dois casos.',
          'Apague as três linhas marcadoras: as de menor, de igual e de maior.',
          'Registre a resolução com `git add` e `git commit`.',
        ],
      },
      {
        kind: 'warning',
        text: 'Conflito não é erro nem sinal de que alguém trabalhou errado: é o Git avisando que não pode decidir sozinho. O erro de verdade seria ele escolher por conta própria e descartar o trabalho de alguém em silêncio.',
      },
      {
        kind: 'keyIdea',
        text: 'Branches curtas geram poucos conflitos; branches que ficam semanas abertas geram muitos. O melhor jeito de sofrer menos com conflito é integrar cedo e com frequência.',
      },
    ],
    reflection: [
      'Por que trabalhar direto na branch principal é arriscado num projeto que já está no ar?',
      'O que o Git faz quando duas branches alteram arquivos diferentes? E as mesmas linhas?',
      'Como o tamanho de uma branch influencia a chance de conflito?',
    ],
    checklist: [
      'Criei uma branch com nome que descreve a entrega.',
      'Integrei a branch na principal e apaguei a branch usada.',
      'Provoquei e resolvi um conflito de propósito, entendendo os marcadores.',
    ],
  },

  'Pull requests e revisão': {
    problem:
      'Seu código está pronto e funcionando. A pessoa que vai revisar abre trinta arquivos alterados e não faz ideia do que você tentou resolver.',
    outcome:
      'Apresentar uma mudança com contexto suficiente para ser revisada rapidamente, e revisar o trabalho de outra pessoa de forma útil.',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Pull request é o pedido para integrar uma branch, acompanhado de um espaço para conversa. Ele não é burocracia: é onde a equipe combina o que entra no projeto e por quê. Um bom pull request é lido em cinco minutos; um ruim custa meia hora de perguntas.',
      },
      { kind: 'heading', text: 'O que uma boa descrição responde' },
      {
        kind: 'table',
        headers: ['Pergunta', 'Por que importa'],
        rows: [
          ['Qual problema isto resolve?', 'Sem isso, o revisor avalia código sem saber o objetivo'],
          ['Como foi resolvido?', 'Explica as decisões que o código não conta'],
          ['Como testar?', 'Permite ao revisor confirmar em vez de acreditar'],
          ['O que ficou de fora?', 'Evita que apontem como falha o que foi escolha consciente'],
        ],
      },
      {
        kind: 'code',
        language: 'text',
        caption: 'Um modelo que funciona:',
        lines: [
          '## Problema',
          'A busca do catalogo retornava cursos arquivados.',
          '',
          '## Solucao',
          'Filtro por status no servidor. Escolhi filtrar no servidor, e nao no',
          'navegador, para nao enviar dados que o aluno nao pode ver.',
          '',
          '## Como testar',
          '1. Abrir /cursos',
          '2. Buscar por "Excel"',
          '3. Conferir que o curso arquivado nao aparece',
          '',
          '## Fora do escopo',
          'A ordenacao por relevancia fica para outra entrega.',
        ],
      },
      {
        kind: 'keyIdea',
        text: 'O código diz o que foi feito. A descrição diz por que foi feito assim, e não de outro jeito. Essa segunda informação não existe em lugar nenhum além do texto que você escrever.',
      },
      { kind: 'heading', text: 'Revisar o trabalho de outra pessoa' },
      {
        kind: 'paragraph',
        text: 'Revisar é ler para entender, não para aprovar. Um comentário útil aponta um efeito concreto e oferece um caminho; um comentário inútil expressa preferência sem justificativa.',
      },
      {
        kind: 'table',
        headers: ['Comentário', 'Por quê'],
        rows: [
          ['Não gostei disso', 'Preferência sem informação — o autor não sabe o que mudar'],
          ['Isso está errado', 'Aponta o problema sem dizer qual'],
          [
            'Se a lista chegar vazia, esta divisão quebra. Vale tratar antes?',
            'Descreve o efeito e propõe caminho',
          ],
          [
            'Este nome me confundiu; seria "valorEmCentavos"?',
            'Explica a dificuldade real e sugere',
          ],
        ],
      },
      {
        kind: 'tip',
        text: 'Ao receber uma revisão, lembre-se de que o alvo é o código, não você. E ao revisar, escreva como se a pessoa estivesse ao seu lado — texto escrito perde o tom e endurece sozinho.',
      },
      {
        kind: 'warning',
        text: 'Pull request gigante não é revisado: é aprovado no escuro. Se a sua mudança passa de algumas centenas de linhas, divida em entregas menores — a revisão fica melhor e o risco cai.',
      },
    ],
    reflection: [
      'Pegue um commit seu e escreva a descrição de pull request correspondente. Você lembra por que decidiu daquele jeito?',
      'Reescreva "isso está errado" como um comentário que ajude o autor.',
      'Por que um pull request grande costuma receber revisão pior do que um pequeno?',
    ],
    checklist: [
      'Abri um pull request com problema, solução e como testar.',
      'Deixei explícito o que ficou fora do escopo.',
      'Escrevi ao menos um comentário de revisão que aponta efeito e propõe caminho.',
    ],
  },

  'README que explica o projeto': {
    problem:
      'Alguém abriu seu repositório vindo de uma vaga de emprego. Tem trinta arquivos de código e nenhuma explicação. A pessoa fecha em quinze segundos.',
    outcome:
      'Escrever um README que faça um desconhecido entender o que o projeto faz, ver o resultado e conseguir executá-lo.',
    blocks: [
      {
        kind: 'paragraph',
        text: 'O README é a porta do projeto. Para quem está montando portfólio, ele importa mais do que boa parte do código: é o que decide se a pessoa vai olhar o resto.',
      },
      { kind: 'heading', text: 'A ordem que funciona' },
      {
        kind: 'steps',
        items: [
          'Nome e uma frase dizendo o que o projeto faz e para quem.',
          'Uma imagem do resultado — a coisa mais eficiente que você pode colocar.',
          'Funcionalidades, em lista curta.',
          'Tecnologias usadas.',
          'Como executar, do zero, com os comandos exatos.',
          'Decisões técnicas: o que você escolheu e por quê.',
          'O que faria diferente com mais tempo.',
        ],
      },
      {
        kind: 'paragraph',
        text: 'Os dois últimos itens são os que mais impressionam quem contrata, e quase ninguém escreve. Eles mostram que você sabe avaliar o próprio trabalho — sinal de maturidade que o código sozinho não transmite.',
      },
      {
        kind: 'code',
        language: 'text',
        caption: 'A seção de execução precisa ser literal:',
        lines: [
          '## Como executar',
          '',
          '```bash',
          'git clone https://github.com/usuario/projeto.git',
          'cd projeto',
          'npm install',
          'npm run dev',
          '```',
          '',
          'Abra http://localhost:3000',
        ],
      },
      {
        kind: 'tip',
        text: 'Teste as instruções numa pasta vazia, como se você fosse outra pessoa. É assim que se descobre o passo que você faz no automático e esqueceu de escrever.',
      },
      {
        kind: 'warning',
        text: 'Nunca coloque no README senha, token ou string de conexão real. Use um arquivo de exemplo com valores fictícios e explique como preencher.',
      },
      {
        kind: 'keyIdea',
        text: 'Escreva para alguém que não estava na sala quando você programou — inclusive você daqui a um ano, que também não vai lembrar.',
      },
    ],
    reflection: [
      'Abra um repositório seu e dê os quinze segundos de um desconhecido. O que ele entenderia?',
      'Qual decisão técnica você tomou num projeto que mereceria uma explicação?',
      'Que passo das suas instruções você faz no automático e não escreveu?',
    ],
    checklist: [
      'Meu README explica o que o projeto faz na primeira frase.',
      'Tem imagem do resultado.',
      'As instruções foram testadas em pasta limpa.',
      'Existe uma seção de decisões técnicas.',
      'Nenhuma credencial real aparece no texto.',
    ],
  },

  'Issues, releases e organização': {
    problem:
      'Você tem sete ideias de melhoria, três defeitos conhecidos e nenhuma lista. Tudo mora na sua memória, e semana que vem metade some.',
    outcome:
      'Registrar trabalho pendente de forma que outra pessoa consiga pegar uma tarefa, e marcar versões que alguém consiga baixar.',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Issue é um registro de algo a fazer: um defeito, uma melhoria, uma dúvida. Ela transforma intenção em item rastreável, com discussão própria e histórico.',
      },
      { kind: 'heading', text: 'Uma issue que alguém consegue pegar' },
      {
        kind: 'table',
        headers: ['Elemento', 'Exemplo ruim', 'Exemplo bom'],
        rows: [
          ['Título', 'bug', 'Busca retorna cursos arquivados'],
          ['Contexto', '(vazio)', 'Ao buscar "Excel", aparece um curso arquivado em 2024'],
          [
            'Como reproduzir',
            '(vazio)',
            '1. Abrir /cursos  2. Buscar "Excel"  3. Ver o terceiro resultado',
          ],
          ['Esperado', '(vazio)', 'Cursos arquivados não devem aparecer para o aluno'],
        ],
      },
      {
        kind: 'paragraph',
        text: 'A diferença entre as duas colunas é a diferença entre uma anotação para você mesmo e uma tarefa que qualquer pessoa da equipe consegue assumir sem te procurar.',
      },
      { kind: 'heading', text: 'Labels e organização' },
      {
        kind: 'list',
        items: [
          'Tipo: defeito, melhoria, documentação.',
          'Prioridade: alta, média, baixa — usada com parcimônia, porque tudo alto significa nada alto.',
          'Situação: em análise, em andamento, bloqueada.',
        ],
      },
      {
        kind: 'tip',
        text: 'Ao abrir um pull request, cite o número da issue na descrição. O GitHub liga os dois, e quem ler daqui a um ano encontra a discussão que originou a mudança.',
      },
      { kind: 'heading', text: 'Releases: marcar o que foi entregue' },
      {
        kind: 'paragraph',
        text: 'Uma release é um ponto do histórico com nome, notas e arquivos prontos para baixar. Ela responde à pergunta "que versão está rodando em produção?" — que, sem release, se responde com adivinhação.',
      },
      {
        kind: 'code',
        language: 'bash',
        lines: ['git tag -a v1.0.0 -m "Primeira versao publica"', 'git push origin v1.0.0'],
      },
      {
        kind: 'paragraph',
        text: 'A convenção mais usada tem três números: o primeiro muda quando algo deixa de ser compatível, o segundo quando entra funcionalidade nova, o terceiro quando é só correção. Seguir isso comunica o risco de atualizar sem precisar ler as notas.',
      },
      {
        kind: 'keyIdea',
        text: 'Issues, pull requests e releases juntos contam a história do projeto: o que se decidiu fazer, como foi feito e o que chegou às pessoas. Um repositório com essas três coisas parece profissional porque é.',
      },
    ],
    reflection: [
      'Escreva uma issue para um defeito que você conhece, com título, reprodução e resultado esperado.',
      'Por que uma issue sem passos de reprodução costuma ficar parada?',
      'Se você corrigir um defeito sem mudar nada mais, qual dos três números da versão muda?',
    ],
    checklist: [
      'Abri uma issue com contexto, reprodução e resultado esperado.',
      'Usei labels para separar tipo e prioridade.',
      'Criei uma tag de versão e publiquei uma release com notas.',
      'Liguei um pull request à issue correspondente.',
    ],
  },
};
