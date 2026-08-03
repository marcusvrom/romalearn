import type { TechCourseContent } from './tech-types';

/**
 * Lógica de Programação e Algoritmos.
 *
 * Curso de entrada da trilha. O aluno chega sem saber programar e sai
 * conseguindo descrever uma regra de forma que outra pessoa — ou um
 * computador — consiga repetir e conferir.
 *
 * Nenhuma aula usa uma linguagem específica: o objetivo é o raciocínio. O
 * pseudocódigo é escrito em português para que a barreira seja o problema, e
 * não o vocabulário.
 */
export const LOGICA: TechCourseContent = {
  'O que é um algoritmo': {
    problem:
      'Você precisa explicar para alguém, por telefone, como chegar da rodoviária até a sua casa. Essa pessoa nunca esteve na cidade.',
    outcome:
      'Escrever uma sequência de passos tão precisa que outra pessoa chegue ao mesmo resultado sem te perguntar nada.',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Ao explicar o caminho, você faz algo que todo programa de computador faz: transforma um objetivo ("chegar à minha casa") em passos que alguém consegue seguir. Se um passo for vago — "vira ali na esquina" —, a pessoa se perde. Se estiver na ordem errada, ela também se perde. Isso é um algoritmo: uma sequência de passos clara o bastante para levar sempre ao mesmo resultado.',
      },
      {
        kind: 'paragraph',
        text: 'A palavra assusta mais do que a ideia. Você já executou dezenas de algoritmos hoje: uma receita de bolo, o passo a passo para pagar um boleto pelo aplicativo do banco, a ordem em que se troca um pneu. Programar é escrever esse tipo de instrução para uma máquina que não adivinha nada.',
      },
      {
        kind: 'analogy',
        text: 'Uma receita de bolo é um algoritmo. Os ingredientes são a entrada, o modo de preparo é o processamento e o bolo é a saída. Se a receita disser "leve ao forno" sem dizer a temperatura nem o tempo, cada pessoa produz um bolo diferente — e é exatamente assim que um programa mal escrito se comporta.',
      },
      { kind: 'heading', text: 'Entrada, processamento e saída' },
      {
        kind: 'paragraph',
        text: 'Todo algoritmo tem três partes. Separá-las é o primeiro hábito profissional que você vai desenvolver, porque quase todo erro de iniciante vem de misturar as três.',
      },
      {
        kind: 'table',
        headers: ['Parte', 'O que é', 'No exemplo do caminho'],
        rows: [
          [
            'Entrada',
            'A informação que chega de fora e que você não controla',
            'De onde a pessoa está saindo',
          ],
          [
            'Processamento',
            'A regra que transforma a entrada em resposta',
            'Decidir o trajeto conforme o ponto de partida',
          ],
          ['Saída', 'O resultado entregue', 'As instruções que a pessoa ouve'],
        ],
      },
      {
        kind: 'paragraph',
        text: 'Repare que a entrada mudou o processamento: o caminho a partir da rodoviária não é o mesmo caminho a partir do aeroporto. Um algoritmo útil aceita entradas diferentes e continua funcionando.',
      },
      { kind: 'heading', text: 'Um algoritmo escrito' },
      {
        kind: 'paragraph',
        text: 'Uma loja precisa decidir se um pedido pode ser separado para entrega. A regra combinada com a equipe é: só libera se o pagamento estiver aprovado e o endereço estiver completo.',
      },
      {
        kind: 'code',
        language: 'text',
        caption: 'Em pseudocódigo — português estruturado, sem linguagem de programação:',
        lines: [
          'receber statusPagamento',
          'receber enderecoCompleto',
          '',
          'se statusPagamento = "aprovado" e enderecoCompleto = verdadeiro entao',
          '    exibir "liberar para separacao"',
          'senao',
          '    exibir "encaminhar para revisao"',
          'fim-se',
        ],
      },
      {
        kind: 'paragraph',
        text: 'As duas primeiras linhas são a entrada. O bloco do meio é o processamento. As linhas com "exibir" são a saída. Nada aqui depende de saber Python, Java ou JavaScript — depende de saber qual é a regra.',
      },
      { kind: 'heading', text: 'Teste de mesa: conferir sem computador' },
      {
        kind: 'paragraph',
        text: 'Teste de mesa é percorrer o algoritmo com papel e caneta, fingindo ser o computador. Você escolhe valores de entrada, executa linha por linha e anota o que sai. É a técnica mais barata que existe para achar erro — e a que mais gente pula.',
      },
      {
        kind: 'table',
        headers: ['statusPagamento', 'enderecoCompleto', 'Saída esperada'],
        rows: [
          ['"aprovado"', 'verdadeiro', 'liberar para separacao'],
          ['"aprovado"', 'falso', 'encaminhar para revisao'],
          ['"pendente"', 'verdadeiro', 'encaminhar para revisao'],
          ['"recusado"', 'falso', 'encaminhar para revisao'],
        ],
      },
      {
        kind: 'paragraph',
        text: 'Montar essa tabela antes de programar revela buracos na regra. Por exemplo: e se o status vier vazio, porque o sistema de pagamento ainda não respondeu? A tabela acima não cobre esse caso — e descobrir isso agora custa um minuto, enquanto descobrir depois custa um pedido enviado errado.',
      },
      {
        kind: 'keyIdea',
        text: 'Escrever o resultado esperado antes de executar transforma tentativa e erro em investigação. Você deixa de perguntar "será que funciona?" e passa a perguntar "por que não deu o que eu previ?".',
      },
      { kind: 'heading', text: 'Precisão é diferente de detalhe' },
      {
        kind: 'paragraph',
        text: 'Um algoritmo preciso não é um algoritmo comprido. "Ande 400 metros pela Avenida Central e vire à direita na primeira rua depois do posto" é mais preciso e mais curto do que três parágrafos de referências vagas. Ao escrever passos, pergunte de cada linha: duas pessoas diferentes fariam a mesma coisa lendo isto?',
      },
      {
        kind: 'warning',
        text: 'Cuidado com palavras que parecem instruções mas não são: "verifique se está tudo certo", "trate os casos especiais", "faça o cálculo". Elas não dizem o que fazer. Se você não conseguir substituí-las por passos concretos, é sinal de que a regra ainda não foi entendida — e programar antes disso só transfere a confusão para o código.',
      },
      { kind: 'heading', text: 'Erros comuns nesta etapa' },
      {
        kind: 'list',
        items: [
          'Começar a escrever passos antes de saber qual é o resultado esperado.',
          'Descrever só o caminho em que tudo dá certo, e nenhum caso de exceção.',
          'Misturar entrada e processamento — por exemplo, calcular no meio da leitura dos dados, o que torna impossível testar as duas coisas em separado.',
          'Usar palavras vagas ("adequado", "correto", "se necessário") que cada leitor interpreta de um jeito.',
        ],
      },
    ],
    reflection: [
      'Pegue uma tarefa que você faz no automático — pagar uma conta, preparar o café — e escreva os passos. Quantos você esqueceu na primeira tentativa?',
      'No algoritmo do pedido, o que deveria acontecer se statusPagamento chegar vazio? Justifique a escolha.',
      'Qual a diferença entre um passo preciso e um passo detalhado? Dê um exemplo de cada.',
    ],
    checklist: [
      'Sei apontar a entrada, o processamento e a saída de um algoritmo.',
      'Escrevi um algoritmo com pelo menos uma decisão.',
      'Montei uma tabela de teste de mesa com um caso comum e um caso de exceção.',
      'Reescrevi pelo menos um passo vago em uma instrução concreta.',
    ],
  },

  'Decomposição e reconhecimento de padrões': {
    problem:
      'Você recebeu a tarefa de organizar a festa de fim de ano da empresa. Sozinho, "organizar a festa" é grande demais para começar.',
    outcome:
      'Quebrar um problema grande em partes pequenas que podem ser resolvidas e testadas separadamente, e enxergar o que se repete entre elas.',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Ninguém organiza uma festa: as pessoas escolhem o local, definem o cardápio, convidam os participantes, contratam o som. Cada uma dessas partes cabe na cabeça, tem um responsável e um jeito de saber se ficou pronta. Foi isso que aconteceu — o problema foi decomposto.',
      },
      {
        kind: 'paragraph',
        text: 'Programação funciona igual. A diferença é que quem não decompõe trava: escreve cem linhas, não funciona, e não faz ideia de qual pedaço está errado. Quem decompõe escreve dez linhas, confere, escreve mais dez.',
      },
      { kind: 'heading', text: 'Decompor é achar as juntas' },
      {
        kind: 'paragraph',
        text: 'Um problema bem decomposto tem partes que se encaixam sem se embolar. O sinal de que você achou uma boa divisão é conseguir descrever cada parte com uma frase que tem verbo e resultado.',
      },
      {
        kind: 'paragraph',
        text: 'Imagine o pedido de uma loja: "processar um pedido". Grande demais. Decomposto:',
      },
      {
        kind: 'list',
        items: [
          'Conferir se os itens estão em estoque — devolve: pode ou não pode seguir.',
          'Calcular o valor total com frete — devolve: um número.',
          'Registrar o pagamento — devolve: aprovado, recusado ou pendente.',
          'Gerar a ordem de separação — devolve: um documento.',
          'Avisar o cliente — devolve: nada, apenas envia a mensagem.',
        ],
      },
      {
        kind: 'paragraph',
        text: 'Agora cada linha é testável isoladamente. Se o cliente reclamar que o frete veio errado, você sabe exatamente onde olhar — e as outras quatro partes continuam confiáveis enquanto você conserta a segunda.',
      },
      {
        kind: 'analogy',
        text: 'É a diferença entre um chuveiro que não esquenta e uma casa sem energia. Quando os circuitos são separados, o defeito fica preso em um cômodo. Quando tudo está no mesmo fio, um problema apaga a casa inteira — e você não sabe por onde começar.',
      },
      { kind: 'heading', text: 'Reconhecer padrões: o que já apareceu antes' },
      {
        kind: 'paragraph',
        text: 'Depois de decompor, olhe para as partes e procure semelhanças. "Conferir se o CPF é válido", "conferir se o CEP é válido" e "conferir se o e-mail é válido" são três tarefas diferentes com a mesma forma: recebem um texto, aplicam uma regra, devolvem verdadeiro ou falso.',
      },
      {
        kind: 'paragraph',
        text: 'Reconhecer isso tem duas consequências práticas. Primeira: você escreve a estrutura uma vez e reaproveita o formato. Segunda: quando descobrir um jeito melhor de sinalizar erro, aplica nos três lugares, porque os três têm o mesmo desenho.',
      },
      {
        kind: 'code',
        language: 'text',
        caption: 'Três validações com a mesma forma:',
        lines: [
          'funcao cpfValido(texto) -> verdadeiro ou falso',
          'funcao cepValido(texto) -> verdadeiro ou falso',
          'funcao emailValido(texto) -> verdadeiro ou falso',
          '',
          'se nao cpfValido(cpfDigitado) entao',
          '    exibir "CPF invalido"',
          'fim-se',
        ],
      },
      { kind: 'heading', text: 'Abstração: esconder o detalhe certo' },
      {
        kind: 'paragraph',
        text: 'Abstrair é decidir o que quem usa a sua solução não precisa saber. Ao chamar `cpfValido(cpfDigitado)`, você não precisa lembrar como o dígito verificador é calculado. Esse detalhe existe, está escrito em algum lugar, mas não ocupa a sua cabeça neste momento.',
      },
      {
        kind: 'analogy',
        text: 'Você dirige sem saber como a injeção eletrônica mistura ar e combustível. O painel mostra velocidade e combustível — o que é preciso para dirigir — e esconde o resto. Um carro que exibisse todos os sensores do motor no para-brisa seria impossível de dirigir. Código funciona igual: mostrar tudo o tempo todo não é transparência, é ruído.',
      },
      {
        kind: 'keyIdea',
        text: 'Decompor reduz o tamanho do problema. Reconhecer padrões reduz a quantidade de soluções diferentes que você precisa inventar. Abstrair reduz o quanto você precisa manter na cabeça ao mesmo tempo. As três atacam o mesmo inimigo: a sobrecarga.',
      },
      { kind: 'heading', text: 'Como decompor na prática' },
      {
        kind: 'steps',
        items: [
          'Escreva o problema em uma frase, do jeito que você explicaria a um colega.',
          'Sublinhe os verbos: conferir, calcular, registrar, avisar. Cada verbo costuma ser uma parte.',
          'Para cada parte, escreva o que entra e o que sai. Se não souber, a parte ainda está grande demais.',
          'Procure partes com a mesma forma de entrada e saída — são candidatas a virar uma solução só.',
          'Resolva a parte mais simples primeiro, para ganhar terreno firme antes de encarar a mais difícil.',
        ],
      },
      {
        kind: 'warning',
        text: 'Decompor demais também atrapalha. Se cada parte tiver uma linha e você precisar percorrer dez arquivos para entender uma regra simples, a divisão passou do ponto. A medida é prática: cada parte deve ser explicável em uma frase e testável sozinha.',
      },
      { kind: 'heading', text: 'Erros comuns nesta etapa' },
      {
        kind: 'list',
        items: [
          'Dividir por ordem de execução ("primeira metade", "segunda metade") em vez de dividir por responsabilidade.',
          'Criar partes que dependem umas das outras de forma escondida, de modo que mexer em uma quebra a outra sem aviso.',
          'Procurar padrão onde só existe coincidência: duas regras que hoje são parecidas mas mudam por motivos diferentes devem continuar separadas.',
          'Abstrair antes de entender: esconder um detalhe que você ainda não domina não simplifica, só adia a confusão.',
        ],
      },
    ],
    reflection: [
      'Pegue "organizar uma viagem" e decomponha em partes que tenham entrada e saída definidas. Quantas partes surgiram?',
      'Nas partes que você listou, alguma tem a mesma forma de outra? O que isso permitiria reaproveitar?',
      'Cite um detalhe do seu dia a dia que você usa sem saber como funciona por dentro. Por que essa abstração te ajuda?',
    ],
    checklist: [
      'Decompus um problema em partes com entrada e saída explícitas.',
      'Cada parte que escrevi cabe em uma frase com verbo e resultado.',
      'Identifiquei pelo menos duas partes com a mesma forma.',
      'Sei explicar a diferença entre esconder um detalhe e ignorar um detalhe.',
    ],
  },

  'Variáveis, constantes e tipos de dados': {
    problem:
      'Você está anotando os gastos do mês num papel. O total muda toda vez que você acrescenta uma despesa, mas o valor do aluguel é sempre o mesmo.',
    outcome:
      'Escolher onde guardar cada informação de um programa, sabendo o que pode mudar, o que não pode e que tipo de valor cada coisa aceita.',
    blocks: [
      {
        kind: 'paragraph',
        text: 'No papel dos gastos existem duas naturezas de informação. O total é recalculado a cada linha nova. O aluguel foi combinado em contrato e não muda no meio do mês. Um programa precisa dessa mesma distinção, e ela tem nome: variável e constante.',
      },
      {
        kind: 'analogy',
        text: 'Uma variável é uma caixa etiquetada. A etiqueta é o nome, e o conteúdo pode ser trocado quantas vezes for preciso. Uma constante é uma caixa lacrada: você lê o conteúdo à vontade, mas trocá-lo exige abrir o contrato, não o programa.',
      },
      { kind: 'heading', text: 'Nomes são documentação' },
      {
        kind: 'paragraph',
        text: 'O nome de uma variável é lido dezenas de vezes e escrito uma. Ele é a explicação mais barata que existe, e a maioria dos programas ruins começa por nomes preguiçosos.',
      },
      {
        kind: 'table',
        headers: ['Nome fraco', 'Nome bom', 'Por quê'],
        rows: [
          ['x', 'totalDoMes', 'x não diz o que guarda nem em que unidade'],
          ['valor', 'precoEmCentavos', 'deixa explícita a unidade e evita erro de escala'],
          ['flag', 'pagamentoAprovado', 'diz o que verdadeiro significa'],
          ['lista', 'despesasPendentes', 'diz o que tem dentro'],
        ],
      },
      {
        kind: 'tip',
        text: 'Ao terminar de escrever, releia só os nomes, sem o resto do código. Se a sequência de nomes já contar a história do que o programa faz, os nomes estão bons.',
      },
      { kind: 'heading', text: 'Tipos: a natureza do valor' },
      {
        kind: 'paragraph',
        text: 'Cada informação tem uma natureza, e o computador precisa saber qual, porque as operações permitidas mudam. Somar dois números faz sentido; somar dois nomes de pessoa, não.',
      },
      {
        kind: 'table',
        headers: ['Tipo', 'Guarda', 'Exemplo', 'Cuidado'],
        rows: [
          ['Texto', 'Sequência de caracteres', '"Fernanda"', 'O texto "10" não é o número 10'],
          ['Inteiro', 'Número sem casas decimais', '42', 'Divisão pode descartar o resto'],
          [
            'Decimal',
            'Número com casas decimais',
            '19.90',
            'Arredondamento acumula erro em dinheiro',
          ],
          ['Lógico', 'Verdadeiro ou falso', 'verdadeiro', 'Só dois valores possíveis'],
        ],
      },
      {
        kind: 'code',
        language: 'text',
        caption: 'Uma matrícula, com cada informação no tipo adequado:',
        lines: [
          'constante TAXA_MATRICULA_EM_CENTAVOS = 5900',
          '',
          'nomeAluno = "Fernanda"',
          'parcelas = 2',
          'pagamentoAprovado = falso',
          '',
          'valorDaParcelaEmCentavos = TAXA_MATRICULA_EM_CENTAVOS / parcelas',
          'exibir valorDaParcelaEmCentavos',
        ],
      },
      {
        kind: 'output',
        lines: ['2950'],
      },
      {
        kind: 'paragraph',
        text: 'Repare em duas decisões. A taxa é constante, em letras maiúsculas, porque mudá-la é decisão de negócio e não do programa. E o preço está em centavos, como número inteiro — o motivo vem a seguir, e é um dos erros mais caros que um iniciante comete.',
      },
      { kind: 'heading', text: 'Por que dinheiro não é número decimal' },
      {
        kind: 'paragraph',
        text: 'Computadores guardam decimais em base dois, e alguns valores da base dez não têm representação exata — do mesmo jeito que um terço não termina na base dez. O resultado é que contas com dinheiro acumulam sobras minúsculas que, somadas em milhares de operações, viram divergência de caixa.',
      },
      {
        kind: 'code',
        language: 'text',
        caption: 'O que a maioria das linguagens responde:',
        lines: ['exibir 0.1 + 0.2'],
      },
      {
        kind: 'output',
        lines: ['0.30000000000000004'],
      },
      {
        kind: 'paragraph',
        text: 'Não é defeito da linguagem: é consequência de representar decimais em binário. A solução usada no mercado é guardar valores monetários como inteiros na menor unidade — centavos — e dividir só na hora de mostrar na tela.',
      },
      {
        kind: 'warning',
        text: 'Este é o tipo de detalhe que separa um programa de exercício de um programa que pode cuidar do dinheiro de alguém. Se um dia você trabalhar com pagamentos, esta única decisão evita conversas muito desagradáveis com o setor financeiro.',
      },
      { kind: 'heading', text: 'Conversão e validação' },
      {
        kind: 'paragraph',
        text: 'Tudo que o usuário digita chega como texto, mesmo quando parece número. Antes de calcular, é preciso converter — e a conversão pode falhar, porque nada impede alguém de digitar "dois" no campo de quantidade.',
      },
      {
        kind: 'code',
        language: 'text',
        caption: 'Converter sempre acompanhado de verificação:',
        lines: [
          'receber quantidadeDigitada',
          '',
          'se quantidadeDigitada nao for numero entao',
          '    exibir "Digite a quantidade usando apenas numeros."',
          '    encerrar',
          'fim-se',
          '',
          'quantidade = converterParaInteiro(quantidadeDigitada)',
        ],
      },
      {
        kind: 'keyIdea',
        text: 'Converter sem verificar é apostar que o usuário nunca erra. Ele erra — e não por má fé: erra com o teclado do celular, com o corretor automático, com o campo preenchido às pressas.',
      },
      { kind: 'heading', text: 'Erros comuns nesta etapa' },
      {
        kind: 'list',
        items: [
          'Guardar dinheiro em número decimal e descobrir a diferença de centavos só na conciliação.',
          'Reaproveitar a mesma variável para duas finalidades diferentes ao longo do programa, o que torna impossível saber o que ela contém em cada trecho.',
          'Nomear com abreviações que só faziam sentido no dia em que foram escritas (qtd, tmp, aux2).',
          'Confiar que o texto digitado é um número porque parecia um número no teste.',
        ],
      },
    ],
    reflection: [
      'No seu controle de gastos, quais informações seriam constantes e quais seriam variáveis? Por quê?',
      'Por que `precoEmCentavos` é um nome melhor do que `preco`, mesmo sendo mais comprido?',
      'O que deveria acontecer se alguém digitar "10,50" num campo que espera número? E "dez"?',
    ],
    checklist: [
      'Sei explicar a diferença entre variável e constante com um exemplo meu.',
      'Escolhi nomes que dizem o conteúdo e a unidade.',
      'Sei por que valores monetários são guardados em centavos.',
      'Toda conversão que escrevi tem uma verificação antes.',
    ],
  },

  'Operadores e expressões': {
    problem:
      'A farmácia dá desconto para quem tem cartão fidelidade ou compra acima de cem reais, mas nunca para produtos em promoção. Escrever essa frase como regra exata é mais difícil do que parece.',
    outcome:
      'Combinar comparações e conectivos para expressar uma regra de negócio sem ambiguidade, e prever o resultado antes de executar.',
    blocks: [
      {
        kind: 'paragraph',
        text: 'A frase da farmácia é clara para uma pessoa e ambígua para um computador. "Ou" inclui os dois casos ao mesmo tempo? O "nunca" cancela as duas condições anteriores ou só a última? Operadores existem para tirar essa dúvida.',
      },
      { kind: 'heading', text: 'Três famílias de operadores' },
      {
        kind: 'table',
        headers: ['Família', 'Serve para', 'Exemplos', 'Resultado'],
        rows: [
          ['Aritméticos', 'Calcular', '+  -  *  /  resto', 'Um número'],
          ['Relacionais', 'Comparar', '=  <>  >  <  >=  <=', 'Verdadeiro ou falso'],
          ['Lógicos', 'Combinar comparações', 'e  ou  nao', 'Verdadeiro ou falso'],
        ],
      },
      {
        kind: 'paragraph',
        text: 'A distinção que mais confunde no começo: operadores aritméticos produzem números, os outros dois produzem verdadeiro ou falso. `2 + 3` é 5; `2 > 3` é falso. São coisas de natureza diferente, e misturá-las gera erros difíceis de enxergar.',
      },
      { kind: 'heading', text: 'O operador resto, que parece inútil e não é' },
      {
        kind: 'paragraph',
        text: 'O resto da divisão responde "o que sobrou". Ele resolve dois problemas frequentes: saber se um número é par e distribuir coisas em ciclos.',
      },
      {
        kind: 'code',
        language: 'text',
        lines: [
          'exibir 17 / 5        // quociente inteiro: 3',
          'exibir resto(17, 5)  // o que sobrou: 2',
          '',
          '// Um numero e par quando o resto da divisao por 2 e zero',
          'se resto(numero, 2) = 0 entao',
          '    exibir "par"',
          'fim-se',
        ],
      },
      {
        kind: 'tip',
        text: 'Precisou alternar entre opções em ciclo — cores de linha de uma tabela, turnos de uma escala —, o resto é a ferramenta. Ele transforma um contador que cresce sem parar em um valor que gira dentro de um intervalo.',
      },
      { kind: 'heading', text: 'Escrevendo a regra da farmácia' },
      {
        kind: 'paragraph',
        text: 'Volte à frase original. Ela tem três informações: cartão fidelidade, valor da compra e se o produto está em promoção. A palavra "nunca" indica que a promoção manda em cima de tudo.',
      },
      {
        kind: 'code',
        language: 'text',
        lines: ['temDesconto = (temCartaoFidelidade ou valorDaCompra > 100) e nao estaEmPromocao'],
      },
      {
        kind: 'paragraph',
        text: 'Os parênteses não são enfeite: sem eles a regra muda de sentido. `a ou b e c` é lido como `a ou (b e c)`, porque "e" tem precedência sobre "ou" — a mesma lógica da multiplicação antes da soma. Nesse caso, quem tivesse cartão ganharia desconto mesmo em produto de promoção.',
      },
      {
        kind: 'warning',
        text: 'Escreva os parênteses mesmo quando a precedência já garante o resultado. Eles custam dois caracteres e poupam o próximo leitor — que muitas vezes é você, seis meses depois — de precisar lembrar a ordem de avaliação.',
      },
      { kind: 'heading', text: 'Tabela verdade: conferir todas as combinações' },
      {
        kind: 'paragraph',
        text: 'Com três condições existem oito combinações possíveis. Montar a tabela é a forma de garantir que a regra faz o certo em todas elas, e não só na que você imaginou ao escrever.',
      },
      {
        kind: 'table',
        headers: ['Cartão', 'Compra > 100', 'Em promoção', 'Tem desconto?'],
        rows: [
          ['sim', 'não', 'não', 'sim'],
          ['não', 'sim', 'não', 'sim'],
          ['sim', 'sim', 'não', 'sim'],
          ['não', 'não', 'não', 'não'],
          ['sim', 'não', 'sim', 'não'],
          ['não', 'sim', 'sim', 'não'],
          ['sim', 'sim', 'sim', 'não'],
          ['não', 'não', 'sim', 'não'],
        ],
      },
      {
        kind: 'paragraph',
        text: 'A tabela também serve de conversa com quem definiu a regra. Levar essas oito linhas para a pessoa responsável costuma revelar que ela não tinha pensado em alguma combinação — e é muito melhor descobrir isso agora.',
      },
      { kind: 'heading', text: 'Cuidados com comparações' },
      {
        kind: 'list',
        items: [
          'Comparar textos costuma diferenciar maiúsculas de minúsculas: "Aprovado" e "aprovado" não são iguais para o computador.',
          'Comparar decimais por igualdade é arriscado pelo mesmo motivo do arredondamento; prefira verificar se a diferença é menor que uma tolerância.',
          'Negar uma combinação inverte também os conectivos: o contrário de "a e b" é "nao a ou nao b", não "nao a e nao b".',
        ],
      },
      {
        kind: 'keyIdea',
        text: 'Uma expressão lógica é uma frase de negócio escrita sem ambiguidade. Se você não consegue traduzi-la de volta para português e reconhecer a regra original, provavelmente ela está errada.',
      },
      { kind: 'heading', text: 'Erros comuns nesta etapa' },
      {
        kind: 'list',
        items: [
          'Confundir o operador de atribuição com o de comparação e alterar o valor sem perceber.',
          'Omitir parênteses e depender da precedência de memória.',
          'Testar só a combinação em que o desconto é concedido, e nunca a que ele deve ser negado.',
          'Encadear tantas condições numa linha só que ninguém mais consegue ler; nesse caso, dê nome às partes.',
        ],
      },
    ],
    reflection: [
      'Reescreva a regra da farmácia supondo que a promoção deixe de cancelar o desconto de quem tem cartão. O que muda na expressão?',
      'Por que `nao (a e b)` não é o mesmo que `nao a e nao b`? Confira montando a tabela.',
      'Onde no seu dia a dia existe uma regra com "ou" que na verdade quer dizer "um ou outro, mas não os dois"?',
    ],
    checklist: [
      'Sei distinguir operadores que produzem número dos que produzem verdadeiro ou falso.',
      'Usei o resto da divisão para resolver pelo menos um problema.',
      'Escrevi uma regra com três condições e montei sua tabela verdade completa.',
      'Coloquei parênteses explícitos mesmo onde a precedência já resolveria.',
    ],
  },

  'Condições e caminhos alternativos': {
    problem:
      'Uma escola precisa classificar as notas em aprovado, recuperação e reprovado. Parece simples até alguém tirar exatamente a nota de corte.',
    outcome:
      'Escrever decisões encadeadas que cobrem todos os casos, sem sobreposição e sem buraco, incluindo os valores exatamente nos limites.',
    blocks: [
      {
        kind: 'paragraph',
        text: 'A regra da escola é: sete ou mais aprova, abaixo de cinco reprova, e o intervalo entre os dois vai para recuperação. Escrever isso exige responder a uma pergunta que a frase esconde: quem tira exatamente sete está aprovado, e quem tira exatamente cinco está em recuperação? Decisões vivem ou morrem nos limites.',
      },
      { kind: 'heading', text: 'A forma básica' },
      {
        kind: 'code',
        language: 'text',
        lines: [
          'se nota >= 7 entao',
          '    situacao = "aprovado"',
          'senao se nota >= 5 entao',
          '    situacao = "recuperacao"',
          'senao',
          '    situacao = "reprovado"',
          'fim-se',
        ],
      },
      {
        kind: 'paragraph',
        text: 'O encadeamento tem uma propriedade que economiza trabalho: quando a segunda condição é avaliada, já se sabe que a primeira falhou. Ou seja, `nota >= 5` na segunda linha significa, na prática, "entre 5 e 7". Não é preciso escrever `nota >= 5 e nota < 7` — e escrever isso, além de mais longo, cria uma segunda chance de errar.',
      },
      {
        kind: 'analogy',
        text: 'É como uma fila de peneiras de malhas diferentes. O que passa pela primeira nunca chega à segunda. Por isso a ordem importa: peneira grossa em cima deixa passar tudo, e as de baixo nunca são usadas.',
      },
      { kind: 'heading', text: 'Sem buraco e sem sobreposição' },
      {
        kind: 'paragraph',
        text: 'Duas falhas se repetem em decisões encadeadas. O buraco é uma entrada que não cai em nenhum caminho. A sobreposição é uma entrada que caberia em dois, e só não causa problema por acaso da ordem.',
      },
      {
        kind: 'table',
        headers: ['Nota', 'Cai em', 'Confere?'],
        rows: [
          ['9.0', 'aprovado', 'sim'],
          ['7.0', 'aprovado', 'limite exato — regra diz "sete ou mais"'],
          ['6.9', 'recuperação', 'sim'],
          ['5.0', 'recuperação', 'limite exato — precisa ser confirmado com a escola'],
          ['4.9', 'reprovado', 'sim'],
          ['-1', 'reprovado', 'nota negativa não deveria existir; falta validação'],
        ],
      },
      {
        kind: 'paragraph',
        text: 'A última linha é o achado mais valioso desta tabela. O encadeamento acima classifica uma nota de menos um como reprovado, sem reclamar. Mas uma nota negativa não é um aluno reprovado: é um dado errado, e tratá-la como reprovação esconde um defeito em outro lugar do sistema.',
      },
      {
        kind: 'code',
        language: 'text',
        caption: 'Validar antes de classificar:',
        lines: [
          'se nota < 0 ou nota > 10 entao',
          '    exibir "Nota invalida: informe um valor entre 0 e 10."',
          '    encerrar',
          'fim-se',
          '',
          'se nota >= 7 entao',
          '    situacao = "aprovado"',
          'senao se nota >= 5 entao',
          '    situacao = "recuperacao"',
          'senao',
          '    situacao = "reprovado"',
          'fim-se',
        ],
      },
      {
        kind: 'keyIdea',
        text: 'Separe "dado inválido" de "resultado desfavorável". As duas situações produzem caminhos diferentes: a primeira é um erro a ser corrigido, a segunda é uma resposta legítima do sistema.',
      },
      { kind: 'heading', text: 'Quando o encadeamento fica grande demais' },
      {
        kind: 'paragraph',
        text: 'Se você chegar a seis ou sete ramos comparando sempre a mesma variável contra valores fixos, o encadeamento vira uma parede. Duas saídas ajudam: uma estrutura de seleção por valor, quando a linguagem oferece, ou uma tabela que associa faixa e resultado.',
      },
      {
        kind: 'code',
        language: 'text',
        caption: 'A mesma regra descrita como dados, e não como código:',
        lines: [
          'faixas = [',
          '    (7, 10, "aprovado"),',
          '    (5, 6.99, "recuperacao"),',
          '    (0, 4.99, "reprovado")',
          ']',
          '',
          'para cada (minimo, maximo, resultado) em faixas faca',
          '    se nota >= minimo e nota <= maximo entao',
          '        situacao = resultado',
          '    fim-se',
          'fim-para',
        ],
      },
      {
        kind: 'paragraph',
        text: 'A vantagem aparece no dia em que a escola criar uma quarta faixa: muda-se uma linha da tabela, não a estrutura do programa. A desvantagem é que o código fica menos direto de ler. Para três faixas, o encadeamento simples é melhor; para dez, a tabela é.',
      },
      {
        kind: 'warning',
        text: 'Aninhar decisões dentro de decisões, três ou quatro níveis para dentro, é a maneira mais rápida de tornar um programa impossível de conferir. Quando perceber isso acontecendo, tente resolver os casos de saída primeiro — validar e encerrar — para que o caminho principal fique reto.',
      },
      { kind: 'heading', text: 'Erros comuns nesta etapa' },
      {
        kind: 'list',
        items: [
          'Usar > onde a regra dizia >=, e descobrir só quando alguém tirar exatamente a nota de corte.',
          'Esquecer o caminho final "senão", deixando entradas sem resposta.',
          'Ordenar os ramos de forma que um mais amplo venha antes de um mais específico, tornando o segundo inalcançável.',
          'Tratar dado inválido como se fosse um resultado normal.',
        ],
      },
    ],
    reflection: [
      'Se a escola mudar para "acima de sete aprova", quantos caracteres do código mudam e quantos alunos mudam de situação?',
      'Que outra entrada inválida, além de negativa, poderia chegar nesse programa?',
      'Em que ponto você trocaria o encadeamento pela tabela de faixas? Justifique.',
    ],
    checklist: [
      'Escrevi uma decisão com três ou mais caminhos.',
      'Testei os valores exatamente nos limites, e não só no meio das faixas.',
      'Separei validação de dado inválido da classificação do resultado.',
      'Confirmei que não existe entrada sem caminho nem entrada em dois caminhos.',
    ],
  },

  'Repetições e contadores': {
    problem:
      'Você precisa somar as trinta e uma despesas de um extrato. Copiar e colar a mesma conta trinta e uma vezes funciona — até o mês que vem, que tem trinta dias.',
    outcome:
      'Escrever repetições que percorrem quantidades desconhecidas de dados, acumulam resultados e sempre terminam.',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Repetição é o que separa um programa de uma calculadora. Sem ela, todo programa só serve para a quantidade exata de dados prevista quando foi escrito. Com ela, o mesmo trecho atende trinta e uma despesas, trinta ou três mil.',
      },
      { kind: 'heading', text: 'Duas formas, duas perguntas diferentes' },
      {
        kind: 'table',
        headers: ['Forma', 'Use quando', 'A pergunta que responde'],
        rows: [
          ['para (contada)', 'A quantidade é conhecida antes de começar', 'Quantas vezes?'],
          ['enquanto (condicional)', 'A repetição para por uma condição', 'Até quando?'],
        ],
      },
      {
        kind: 'paragraph',
        text: 'Percorrer uma lista de despesas é "para": a lista tem um tamanho. Pedir a senha até acertar é "enquanto": não se sabe quantas tentativas serão necessárias. Escolher a forma errada não impede o programa de funcionar, mas deixa a intenção obscura para quem lê.',
      },
      { kind: 'heading', text: 'Acumuladores e contadores' },
      {
        kind: 'paragraph',
        text: 'Duas variáveis aparecem em quase toda repetição. O acumulador soma valores; o contador conta ocorrências. Ambos precisam ser iniciados antes do laço — e é aí que mora o erro mais comum.',
      },
      {
        kind: 'code',
        language: 'text',
        caption: 'Total e média das despesas do mês:',
        lines: [
          'totalEmCentavos = 0',
          'quantidade = 0',
          '',
          'para cada despesa em despesasDoMes faca',
          '    totalEmCentavos = totalEmCentavos + despesa.valorEmCentavos',
          '    quantidade = quantidade + 1',
          'fim-para',
          '',
          'se quantidade = 0 entao',
          '    exibir "Nenhuma despesa registrada neste mes."',
          'senao',
          '    exibir "Total: " + formatarMoeda(totalEmCentavos)',
          '    exibir "Media: " + formatarMoeda(totalEmCentavos / quantidade)',
          'fim-se',
        ],
      },
      {
        kind: 'paragraph',
        text: 'A verificação de quantidade zero não é excesso de zelo. Um mês sem despesas registradas é perfeitamente possível — e sem essa linha o programa tentaria dividir por zero, encerrando com erro justamente para o usuário que não fez nada de errado.',
      },
      {
        kind: 'warning',
        text: 'Iniciar o acumulador dentro do laço é o erro clássico: ele volta a zero a cada volta e, no fim, guarda apenas o último valor. O sintoma é um total que bate com a última linha do extrato — o que faz o defeito parecer "quase certo" e passar despercebido.',
      },
      { kind: 'heading', text: 'Laços que nunca terminam' },
      {
        kind: 'paragraph',
        text: 'Um laço condicional precisa que alguma coisa mude a cada volta em direção à parada. Se nada mudar, ele gira para sempre e o programa trava.',
      },
      {
        kind: 'code',
        language: 'text',
        caption: 'Errado — tentativas nunca cresce:',
        lines: [
          'tentativas = 0',
          'enquanto tentativas < 3 faca',
          '    pedirSenha()',
          'fim-enquanto',
        ],
      },
      {
        kind: 'code',
        language: 'text',
        caption: 'Certo — a condição caminha para o fim, e o acerto também encerra:',
        lines: [
          'tentativas = 0',
          'acertou = falso',
          '',
          'enquanto tentativas < 3 e nao acertou faca',
          '    senha = pedirSenha()',
          '    acertou = senhaCorreta(senha)',
          '    tentativas = tentativas + 1',
          'fim-enquanto',
          '',
          'se nao acertou entao',
          '    exibir "Conta bloqueada. Procure o suporte."',
          'fim-se',
        ],
      },
      {
        kind: 'tip',
        text: 'Antes de escrever o corpo do laço, escreva a linha que faz a condição caminhar para o fim. Assim o laço nasce com garantia de término, em vez de ganhá-la depois.',
      },
      { kind: 'heading', text: 'O erro de contagem por um' },
      {
        kind: 'paragraph',
        text: 'Repetições que usam índices numéricos erram por um com uma frequência que surpreende até quem já programa há anos. Se uma lista tem cinco itens e as posições começam em zero, a última posição é quatro — não cinco.',
      },
      {
        kind: 'table',
        headers: ['Escrita', 'Percorre', 'Resultado'],
        rows: [
          ['de 0 até 4', 'as cinco posições', 'correto'],
          ['de 0 até 5', 'seis posições', 'erro ao acessar a sexta, que não existe'],
          ['de 1 até 5', 'cinco posições, começando na segunda', 'o primeiro item nunca é lido'],
        ],
      },
      {
        kind: 'paragraph',
        text: 'A defesa mais eficaz é preferir a forma "para cada item da lista", quando a linguagem oferece: ela dispensa o índice e elimina a classe inteira de erro. Use índice apenas quando a posição em si importar.',
      },
      {
        kind: 'keyIdea',
        text: 'Toda repetição precisa de três respostas: onde começa, o que muda a cada volta e o que a faz parar. Se você não souber responder às três, o laço ainda não está pronto para ser escrito.',
      },
      { kind: 'heading', text: 'Erros comuns nesta etapa' },
      {
        kind: 'list',
        items: [
          'Iniciar acumulador ou contador dentro do laço em vez de antes dele.',
          'Esquecer de tratar a lista vazia, o que costuma virar divisão por zero ou média sem sentido.',
          'Escrever laço condicional sem nada que faça a condição caminhar para o fim.',
          'Alterar a lista enquanto ela está sendo percorrida, o que faz itens serem pulados sem aviso.',
        ],
      },
    ],
    reflection: [
      'O que o programa das despesas deve exibir num mês sem nenhum lançamento? E por que essa resposta é melhor do que um erro?',
      'Escreva um laço que conte apenas as despesas acima de cem reais. Quantas variáveis você precisou?',
      'Por que percorrer "cada item" é menos arriscado do que percorrer por índice?',
    ],
    checklist: [
      'Escrevi uma repetição contada e uma condicional, sabendo justificar cada escolha.',
      'Iniciei acumulador e contador antes do laço.',
      'Tratei o caso da lista vazia.',
      'Confirmei que meu laço condicional sempre termina.',
    ],
  },

  'Funções e responsabilidades': {
    problem:
      'O mesmo cálculo de frete aparece em quatro lugares do seu programa. A transportadora mudou a tabela, e agora você precisa lembrar de todos os quatro.',
    outcome:
      'Isolar uma regra em um bloco com nome, entrada e saída definidas, de modo que ela seja escrita uma vez, testada uma vez e corrigida uma vez.',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Quando uma regra está copiada em quatro lugares, ela não está em lugar nenhum: está em quatro lugares que vão divergir. Alguém vai corrigir três e esquecer o quarto, e o defeito vai aparecer meses depois, no lugar mais improvável.',
      },
      {
        kind: 'analogy',
        text: 'Uma função é uma receita guardada no caderno. Em vez de reescrever o modo de preparo em cada folha, você anota "ver receita do molho na página 12". Quando o molho melhora, melhora para todos os pratos de uma vez.',
      },
      { kind: 'heading', text: 'Anatomia de uma função' },
      {
        kind: 'code',
        language: 'text',
        lines: [
          'funcao calcularFreteEmCentavos(pesoEmGramas, cepDestino)',
          '    se pesoEmGramas <= 0 entao',
          '        erro "Peso deve ser maior que zero."',
          '    fim-se',
          '',
          '    regiao = identificarRegiao(cepDestino)',
          '    base = tabelaDeFrete[regiao]',
          '    adicionalPorQuilo = 350',
          '    quilos = arredondarParaCima(pesoEmGramas / 1000)',
          '',
          '    retornar base + (quilos * adicionalPorQuilo)',
          'fim-funcao',
        ],
      },
      {
        kind: 'table',
        headers: ['Parte', 'No exemplo', 'Para que serve'],
        rows: [
          ['Nome', 'calcularFreteEmCentavos', 'Diz o que faz e em que unidade responde'],
          ['Parâmetros', 'pesoEmGramas, cepDestino', 'O que precisa receber para trabalhar'],
          ['Corpo', 'as linhas do meio', 'A regra propriamente dita'],
          ['Retorno', 'base + adicional', 'O que devolve a quem chamou'],
        ],
      },
      {
        kind: 'paragraph',
        text: 'O nome carrega a unidade — centavos — pelo mesmo motivo da aula de variáveis. E os parâmetros dizem gramas, não "peso": quem chama a função não precisa adivinhar se deve passar 2 ou 2000.',
      },
      { kind: 'heading', text: 'Responsabilidade única' },
      {
        kind: 'paragraph',
        text: 'Uma função deve fazer uma coisa. O teste prático é a descrição: se para explicar o que ela faz você precisar usar "e", provavelmente são duas funções.',
      },
      {
        kind: 'table',
        headers: ['Descrição', 'Veredito'],
        rows: [
          ['Calcula o frete', 'uma responsabilidade'],
          ['Calcula o frete e envia o e-mail de confirmação', 'duas — separe'],
          ['Valida o CPF', 'uma responsabilidade'],
          ['Valida o CPF e grava o cliente no banco', 'duas — separe'],
        ],
      },
      {
        kind: 'paragraph',
        text: 'O motivo não é estético. Uma função que calcula e envia e-mail não pode ser testada sem disparar e-mail, não pode ser reaproveitada por quem só quer o cálculo, e passa a ter dois motivos diferentes para mudar — a tabela de frete e o texto da mensagem.',
      },
      {
        kind: 'keyIdea',
        text: 'Funções que calculam e devolvem são fáceis de testar. Funções que provocam efeitos no mundo — gravar, enviar, apagar — são difíceis. Separar as duas coisas é o que torna um programa testável.',
      },
      { kind: 'heading', text: 'Entrada explícita, saída explícita' },
      {
        kind: 'paragraph',
        text: 'Uma função deve receber tudo o que precisa pelos parâmetros e devolver seu resultado pelo retorno. Quando ela busca informação de fora por conta própria, ou altera algo distante sem avisar, quem lê o programa perde a capacidade de prever o que vai acontecer.',
      },
      {
        kind: 'code',
        language: 'text',
        caption: 'Difícil de testar — depende de algo que não está nos parâmetros:',
        lines: [
          'funcao calcularDesconto()',
          '    // usa a variavel global clienteAtual, definida em outro lugar',
          '    se clienteAtual.temFidelidade entao',
          '        retornar 10',
          '    fim-se',
          '    retornar 0',
          'fim-funcao',
        ],
      },
      {
        kind: 'code',
        language: 'text',
        caption: 'Fácil de testar — tudo o que importa está à vista:',
        lines: [
          'funcao calcularDescontoEmPorcento(temFidelidade)',
          '    se temFidelidade entao',
          '        retornar 10',
          '    fim-se',
          '    retornar 0',
          'fim-funcao',
        ],
      },
      {
        kind: 'paragraph',
        text: 'A segunda versão pode ser conferida com duas chamadas, sem preparar nada antes. Essa diferença parece pequena num exemplo de seis linhas e decide o destino de um programa de seis mil.',
      },
      { kind: 'heading', text: 'Quando não criar uma função' },
      {
        kind: 'paragraph',
        text: 'Nem toda repetição de código pede uma função. Dois trechos parecidos que mudam por motivos diferentes devem continuar separados — unificá-los cria um acoplamento que vai atrapalhar na primeira vez que um dos dois precisar mudar sozinho.',
      },
      {
        kind: 'warning',
        text: 'Também evite funções com muitos parâmetros. Passar da meia dúzia costuma ser sinal de que a função assumiu responsabilidades demais, ou de que vários desses valores andam juntos e mereciam ser agrupados.',
      },
      { kind: 'heading', text: 'Erros comuns nesta etapa' },
      {
        kind: 'list',
        items: [
          'Nomear funções com substantivo em vez de verbo, o que esconde que ali acontece uma ação.',
          'Fazer a função exibir o resultado na tela em vez de devolvê-lo, o que impede reaproveitá-la em outro contexto.',
          'Depender de valores definidos fora da função, tornando o comportamento imprevisível.',
          'Criar uma função para cada trecho repetido, mesmo quando os trechos mudam por razões diferentes.',
        ],
      },
    ],
    reflection: [
      'Na função de frete, o que aconteceria se alguém passasse o peso em quilos por engano? Como o nome do parâmetro ajuda a evitar isso?',
      'Pegue uma função sua que use "e" na descrição e divida em duas. Ficou mais fácil de testar?',
      'Por que uma função que só calcula é mais fácil de conferir do que uma que grava no banco?',
    ],
    checklist: [
      'Escrevi uma função com nome de verbo, parâmetros claros e retorno.',
      'Consigo descrever cada função que escrevi sem usar a palavra "e".',
      'Minhas funções recebem tudo pelos parâmetros, sem depender de valores externos.',
      'Separei o cálculo do efeito no mundo (gravar, exibir, enviar).',
    ],
  },

  'Erros, testes e depuração': {
    problem:
      'Seu programa de cálculo de férias funcionou nos três testes que você fez. No primeiro dia de uso real, ele deu um valor errado para uma pessoa admitida em 29 de fevereiro.',
    outcome:
      'Escolher casos de teste que realmente encontram defeitos e investigar uma falha por hipótese, em vez de mudar código até parar de dar erro.',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Testar não é confirmar que o programa funciona: é tentar fazê-lo falhar enquanto o custo da falha ainda é baixo. Quem testa para confirmar escolhe justamente os casos que vão passar — e é assim que um programa chega ao usuário com o defeito intacto.',
      },
      { kind: 'heading', text: 'Três famílias de erro' },
      {
        kind: 'table',
        headers: ['Tipo', 'Quando aparece', 'Exemplo', 'Facilidade'],
        rows: [
          ['Sintaxe', 'Antes de executar', 'Parêntese não fechado', 'A ferramenta aponta a linha'],
          [
            'Execução',
            'Durante a execução',
            'Divisão por zero',
            'A mensagem costuma dizer onde parou',
          ],
          ['Lógica', 'Nunca reclama', 'Média calculada com divisor errado', 'A mais perigosa'],
        ],
      },
      {
        kind: 'paragraph',
        text: 'O erro de lógica é o único que não avisa. O programa roda, entrega um número, e o número está errado. Só um teste com resultado esperado conhecido de antemão o revela — e é por isso que o teste de mesa da primeira aula continua sendo útil até o fim da carreira.',
      },
      { kind: 'heading', text: 'Escolher casos que encontram defeito' },
      {
        kind: 'paragraph',
        text: 'Testar com dez valores parecidos não vale mais do que testar com um. O que encontra defeito é variar a natureza do caso.',
      },
      {
        kind: 'table',
        headers: ['Categoria', 'O que é', 'No cálculo de férias'],
        rows: [
          ['Caso comum', 'A situação do dia a dia', 'Admissão em 10 de março, um ano completo'],
          ['Limite', 'Exatamente na fronteira da regra', 'Exatamente 12 meses de casa'],
          ['Fora do limite', 'Um passo além da fronteira', '11 meses e 29 dias'],
          ['Inválido', 'O que não deveria existir', 'Data de admissão no futuro'],
          ['Excepcional', 'Raro mas legítimo', 'Admissão em 29 de fevereiro'],
        ],
      },
      {
        kind: 'paragraph',
        text: 'O caso do problema desta aula é da última linha. Quem só testou datas comuns nunca encontraria — não por falta de esforço, mas por falta de método. A lista acima é o método.',
      },
      {
        kind: 'keyIdea',
        text: 'Um bom conjunto de testes não é grande: é variado. Cinco casos de naturezas diferentes encontram mais defeitos do que cinquenta variações do mesmo caso.',
      },
      { kind: 'heading', text: 'Depurar é investigar, não adivinhar' },
      {
        kind: 'paragraph',
        text: 'Diante de uma falha, a reação comum é mexer no código até o erro sumir. Isso às vezes funciona, e é péssimo: você não sabe o que consertou, não sabe se quebrou outra coisa, e não aprendeu nada que sirva para a próxima vez.',
      },
      {
        kind: 'steps',
        items: [
          'Reproduza a falha de propósito. Um defeito que você não consegue provocar de novo não pode ser confirmado como resolvido.',
          'Reduza o caso ao menor exemplo que ainda falha. Cada dado que você remove sem a falha sumir é uma pista descartada.',
          'Escreva uma hipótese em uma frase: "acho que o total está errado porque o acumulador reinicia a cada volta".',
          'Faça um teste que só confirme ou derrube essa hipótese — inspecionar o valor do acumulador em duas voltas seguidas, por exemplo.',
          'Corrija, e só então rode de novo o caso original e os casos que já passavam.',
        ],
      },
      {
        kind: 'paragraph',
        text: 'O quinto passo é o que mais se esquece. Uma correção que resolve o caso novo e quebra um antigo é comum, e sem rodar os antigos você troca um defeito por outro sem perceber.',
      },
      { kind: 'heading', text: 'Ler mensagens de erro' },
      {
        kind: 'paragraph',
        text: 'A mensagem de erro parece hostil, mas costuma ser a informação mais precisa que você vai receber no dia. Ela normalmente traz três coisas: o tipo do problema, a linha e o caminho que levou até ali.',
      },
      {
        kind: 'output',
        caption: 'Um exemplo típico:',
        lines: [
          'Erro: divisao por zero',
          '  em calcularMedia (relatorio.txt, linha 42)',
          '  chamada por gerarResumoMensal (relatorio.txt, linha 17)',
        ],
      },
      {
        kind: 'paragraph',
        text: 'A linha 42 é onde estourou, mas a causa quase sempre está antes: alguém chamou calcularMedia com uma lista vazia. Corrigir na linha 42 trata o sintoma; entender por que a lista chegou vazia trata a doença.',
      },
      {
        kind: 'tip',
        text: 'Leia a mensagem de baixo para cima. A última linha diz onde quebrou; as de cima contam como se chegou lá, que é a parte que explica.',
      },
      {
        kind: 'warning',
        text: 'Nunca silencie um erro só para o programa continuar rodando. Um erro engolido não desaparece: ele reaparece mais tarde, mais longe da causa e muito mais difícil de rastrear.',
      },
      { kind: 'heading', text: 'Erros comuns nesta etapa' },
      {
        kind: 'list',
        items: [
          'Testar apenas o caminho em que tudo dá certo.',
          'Mudar várias coisas ao mesmo tempo, o que impede saber qual delas resolveu.',
          'Não anotar o resultado esperado antes de executar, transformando o teste em opinião sobre o que apareceu.',
          'Parar de testar assim que o erro relatado sumiu, sem verificar o que já funcionava.',
        ],
      },
    ],
    reflection: [
      'Escolha um programa que você escreveu neste curso e liste um caso de cada categoria da tabela. Algum deles falha?',
      'Por que corrigir na linha onde o erro estourou nem sempre corrige a causa?',
      'Qual foi a última vez que você consertou algo sem entender o que tinha consertado? O que aconteceu depois?',
    ],
    checklist: [
      'Sei distinguir erro de sintaxe, de execução e de lógica.',
      'Montei casos de teste de pelo menos quatro categorias diferentes.',
      'Investiguei uma falha escrevendo a hipótese antes de mexer no código.',
      'Rodei novamente os casos que já passavam depois de corrigir.',
    ],
  },
};
