import type { TechCourseContent } from './tech-types';

/**
 * Python para Iniciantes.
 *
 * O fio condutor é a automação de rotinas de escritório — o mesmo público dos
 * módulos de Excel e Word, agora resolvendo com código o que fazia à mão.
 * Todos os exemplos usam dados fictícios e preservam os arquivos originais.
 */
export const PYTHON: TechCourseContent = {
  'Ambiente e primeiro programa': {
    problem:
      'Você instalou o Python, digitou "python" no terminal e apareceu uma mensagem dizendo que o comando não existe.',
    outcome:
      'Ter um ambiente que funciona, entender por que projetos usam ambientes separados e executar seu primeiro programa.',
    blocks: [
      {
        kind: 'paragraph',
        text: 'A mensagem acontece quando o instalador não acrescentou o Python à lista de lugares onde o sistema procura programas. No Windows, a caixa "Add Python to PATH", na primeira tela do instalador, evita o problema — e é a mais fácil de passar batido.',
      },
      {
        kind: 'code',
        language: 'bash',
        caption: 'Conferir a instalação:',
        lines: [
          'python --version',
          '# Em alguns sistemas o comando e python3',
          'python3 --version',
        ],
      },
      { kind: 'output', lines: ['Python 3.12.4'] },
      { kind: 'heading', text: 'Ambiente virtual: por que cada projeto tem o seu' },
      {
        kind: 'paragraph',
        text: 'Bibliotecas instaladas no sistema valem para todos os projetos. Isso vira problema quando um projeto precisa da versão 2 de uma biblioteca e outro da versão 5 — atualizar para um quebra o outro. O ambiente virtual é uma pasta com uma instalação isolada, só daquele projeto.',
      },
      {
        kind: 'analogy',
        text: 'É a diferença entre guardar as ferramentas de todos os serviços numa gaveta só e ter uma caixa por serviço. Na gaveta compartilhada, alguém troca a chave de lugar e o próximo serviço para.',
      },
      {
        kind: 'code',
        language: 'bash',
        lines: [
          'python -m venv .venv',
          '',
          '# Ativar - Linux ou macOS',
          'source .venv/bin/activate',
          '',
          '# Ativar - Windows',
          '.venv\\Scripts\\activate',
        ],
      },
      {
        kind: 'tip',
        text: 'Com o ambiente ativo, o nome dele aparece no início da linha do terminal. Se não aparecer, ele não está ativo — e o `pip install` seguinte vai instalar no sistema inteiro.',
      },
      { kind: 'heading', text: 'O primeiro programa' },
      {
        kind: 'code',
        language: 'python',
        caption: 'Arquivo resumo.py:',
        lines: [
          'nome_do_setor = "Administrativo"',
          'quantidade_de_relatorios = 12',
          '',
          'print(f"Setor: {nome_do_setor}")',
          'print(f"Relatorios a processar: {quantidade_de_relatorios}")',
        ],
      },
      { kind: 'output', lines: ['Setor: Administrativo', 'Relatorios a processar: 12'] },
      {
        kind: 'paragraph',
        text: 'O `f` antes das aspas cria uma f-string: o que estiver entre chaves é substituído pelo valor. É a forma mais legível de montar texto com dados, e a que você vai usar o curso inteiro.',
      },
      {
        kind: 'warning',
        text: 'Python usa a indentação para delimitar blocos — não chaves. Um espaço a mais ou a menos muda o significado do programa ou impede a execução. Configure o editor para inserir quatro espaços na tecla Tab e nunca misture espaços com tabulações no mesmo arquivo.',
      },
    ],
    reflection: [
      'Por que instalar bibliotecas no sistema inteiro causa problema com o tempo?',
      'Como saber se o ambiente virtual está ativo?',
      'O que diferencia a indentação em Python da indentação em outras linguagens?',
    ],
    checklist: [
      'Consigo executar `python --version` no terminal.',
      'Criei e ativei um ambiente virtual.',
      'Executei um arquivo .py e vi a saída.',
      'Meu editor está configurado para quatro espaços.',
    ],
  },

  'Variáveis, tipos e entrada de dados': {
    problem:
      'Seu programa pede a quantidade de itens e soma ao estoque. Alguém digitou 10 e o estoque foi de 5 para "510".',
    outcome:
      'Receber dados de fora, converter para o tipo correto e recusar entradas que não fazem sentido.',
    blocks: [
      {
        kind: 'paragraph',
        text: 'A função que lê do teclado sempre devolve texto, mesmo quando a pessoa digita um número. Somar texto com texto junta as duas partes — daí o "510".',
      },
      {
        kind: 'code',
        language: 'python',
        caption: 'O problema:',
        lines: [
          'estoque = "5"',
          'entrada = input("Quantidade a acrescentar: ")',
          'print(estoque + entrada)',
        ],
      },
      { kind: 'output', lines: ['Quantidade a acrescentar: 10', '510'] },
      {
        kind: 'code',
        language: 'python',
        caption: 'Convertendo e verificando:',
        lines: [
          'estoque = 5',
          'entrada = input("Quantidade a acrescentar: ").strip()',
          '',
          'if not entrada.isdigit():',
          '    print("Digite apenas numeros inteiros.")',
          'else:',
          '    quantidade = int(entrada)',
          '    print(f"Novo estoque: {estoque + quantidade}")',
        ],
      },
      { kind: 'output', lines: ['Quantidade a acrescentar: 10', 'Novo estoque: 15'] },
      {
        kind: 'tip',
        text: 'O `.strip()` remove espaços no começo e no fim. Parece detalhe, mas um espaço colado ao valor é a causa mais frequente de "o número não é reconhecido" em dados colados de planilha.',
      },
      { kind: 'heading', text: 'Os tipos que você vai usar todo dia' },
      {
        kind: 'table',
        headers: ['Tipo', 'Guarda', 'Exemplo', 'Cuidado'],
        rows: [
          ['str', 'Texto', '"Fernanda"', 'Comparação diferencia maiúsculas'],
          ['int', 'Inteiro', '42', 'A divisão com uma barra devolve decimal'],
          ['float', 'Decimal', '19.90', 'Arredondamento acumula em dinheiro'],
          ['bool', 'Verdadeiro ou falso', 'True', 'Escrito com inicial maiúscula'],
          ['None', 'Ausência de valor', 'None', 'Diferente de zero e de texto vazio'],
        ],
      },
      {
        kind: 'paragraph',
        text: 'A distinção entre `None` e zero importa. Uma nota que ainda não foi lançada é `None`; uma nota zero é uma avaliação feita com resultado zero. Tratar as duas como a mesma coisa produz médias erradas.',
      },
      { kind: 'heading', text: 'Dinheiro em Python' },
      {
        kind: 'code',
        language: 'python',
        lines: ['print(0.1 + 0.2)'],
      },
      { kind: 'output', lines: ['0.30000000000000004'] },
      {
        kind: 'warning',
        text: 'Como em qualquer linguagem, decimais em base dois não representam todos os valores da base dez com exatidão. Para dinheiro, guarde centavos como inteiro ou use o tipo Decimal da biblioteca padrão. Nunca `float`.',
      },
      {
        kind: 'code',
        language: 'python',
        lines: ['from decimal import Decimal', '', 'print(Decimal("0.1") + Decimal("0.2"))'],
      },
      { kind: 'output', lines: ['0.3'] },
      {
        kind: 'keyIdea',
        text: 'Repare que o Decimal recebe texto, não número. Passar `Decimal(0.1)` traria o valor impreciso de volta — a imprecisão já teria acontecido antes de o Decimal entrar em cena.',
      },
    ],
    reflection: [
      'Por que `input` devolver texto é uma decisão razoável da linguagem?',
      'Qual a diferença prática entre uma nota `None` e uma nota zero?',
      'Por que `Decimal("0.1")` funciona e `Decimal(0.1)` não resolve o problema?',
    ],
    checklist: [
      'Converto toda entrada antes de calcular.',
      'Verifico o formato antes de converter.',
      'Uso strip em texto vindo de fora.',
      'Sei quando usar Decimal em vez de float.',
    ],
  },

  'Condições e repetições': {
    problem:
      'Você precisa processar uma pasta com sessenta arquivos, pulando os que já foram processados e registrando os que deram erro.',
    outcome:
      'Controlar o fluxo com condições e repetições, sabendo quando pular um item e quando interromper tudo.',
    blocks: [
      {
        kind: 'code',
        language: 'python',
        caption: 'Condição encadeada:',
        lines: [
          'if nota >= 7:',
          '    situacao = "aprovado"',
          'elif nota >= 5:',
          '    situacao = "recuperacao"',
          'else:',
          '    situacao = "reprovado"',
        ],
      },
      {
        kind: 'paragraph',
        text: 'Como no pseudocódigo da trilha de lógica, quando o `elif` é avaliado já se sabe que a condição anterior falhou. Não é preciso escrever a faixa inteira: `nota >= 5` ali já significa "entre 5 e 7".',
      },
      { kind: 'heading', text: 'Percorrer com for' },
      {
        kind: 'code',
        language: 'python',
        lines: [
          'arquivos = ["janeiro.csv", "fevereiro.csv", "marco.csv"]',
          '',
          'for arquivo in arquivos:',
          '    print(f"Processando {arquivo}")',
          '',
          '# Quando a posicao importa',
          'for indice, arquivo in enumerate(arquivos, start=1):',
          '    print(f"{indice}. {arquivo}")',
        ],
      },
      {
        kind: 'output',
        lines: [
          'Processando janeiro.csv',
          'Processando fevereiro.csv',
          'Processando marco.csv',
          '1. janeiro.csv',
          '2. fevereiro.csv',
          '3. marco.csv',
        ],
      },
      {
        kind: 'tip',
        text: 'O `enumerate` evita criar um contador manual, que é onde nascem os erros de contagem. O `start=1` faz a numeração começar em um, como as pessoas contam.',
      },
      { kind: 'heading', text: 'Pular um, ou parar tudo' },
      {
        kind: 'code',
        language: 'python',
        lines: [
          'processados = 0',
          'com_erro = []',
          '',
          'for arquivo in arquivos:',
          '    if arquivo in ja_processados:',
          '        continue           # pula so este',
          '',
          '    if not arquivo.endswith(".csv"):',
          '        com_erro.append(arquivo)',
          '        continue',
          '',
          '    processar(arquivo)',
          '    processados += 1',
          '',
          'print(f"{processados} processados, {len(com_erro)} com erro")',
        ],
      },
      {
        kind: 'table',
        headers: ['Comando', 'Efeito', 'Use quando'],
        rows: [
          ['continue', 'Pula para o próximo item', 'Este item não se aplica'],
          [
            'break',
            'Encerra a repetição inteira',
            'Encontrou o que procurava, ou não faz sentido seguir',
          ],
        ],
      },
      {
        kind: 'warning',
        text: 'Interromper a repetição inteira porque um arquivo deu erro costuma ser a escolha errada numa automação: cinquenta e nove arquivos válidos deixam de ser processados por causa de um defeituoso. Registre o erro, siga adiante e apresente o resumo no fim.',
      },
      { kind: 'heading', text: 'while: quando não se sabe quantas voltas' },
      {
        kind: 'code',
        language: 'python',
        lines: [
          'tentativas = 0',
          'conectado = False',
          '',
          'while tentativas < 3 and not conectado:',
          '    conectado = tentar_conectar()',
          '    tentativas += 1',
          '',
          'if not conectado:',
          '    print("Nao foi possivel conectar apos 3 tentativas.")',
        ],
      },
      {
        kind: 'keyIdea',
        text: 'Todo `while` precisa de algo que caminhe para a condição de parada. Se você não conseguir apontar a linha que faz isso, o laço não termina.',
      },
    ],
    reflection: [
      'Numa automação de sessenta arquivos, quando faz sentido usar `break`?',
      'Por que `enumerate` é mais seguro do que manter um contador à mão?',
      'Escreva a condição de um laço que tenta no máximo cinco vezes ou para no primeiro sucesso.',
    ],
    checklist: [
      'Uso elif em vez de repetir a faixa inteira.',
      'Uso enumerate quando preciso da posição.',
      'Sei escolher entre continue e break.',
      'Minha automação registra erros e continua.',
    ],
  },

  'Listas, tuplas e dicionários': {
    problem:
      'Você guardou os dados de trezentos alunos numa lista e agora precisa achar um pelo CPF. O programa percorre a lista inteira a cada busca.',
    outcome:
      'Escolher a estrutura de dados conforme o uso, sabendo o que cada uma facilita e o que dificulta.',
    blocks: [
      {
        kind: 'table',
        headers: ['Estrutura', 'Característica', 'Boa para', 'Ruim para'],
        rows: [
          [
            'list',
            'Ordenada, permite alterar',
            'Sequência, ordem importa',
            'Buscar por identificador',
          ],
          [
            'tuple',
            'Ordenada, não permite alterar',
            'Valores que andam juntos e não mudam',
            'Coleções que crescem',
          ],
          [
            'dict',
            'Pares de chave e valor',
            'Buscar por identificador',
            'Quando a ordem é o critério',
          ],
          [
            'set',
            'Sem repetição, sem ordem',
            'Remover duplicados, testar pertinência',
            'Guardar sequência',
          ],
        ],
      },
      {
        kind: 'code',
        language: 'python',
        caption: 'O problema da aula — busca por chave em vez de varredura:',
        lines: [
          '# Lista: precisa percorrer ate achar',
          'alunos_lista = [',
          '    {"cpf": "111", "nome": "Ana"},',
          '    {"cpf": "222", "nome": "Bruno"},',
          ']',
          '',
          '# Dicionario: acha direto pela chave',
          'alunos_por_cpf = {',
          '    "111": {"nome": "Ana", "curso": "Excel"},',
          '    "222": {"nome": "Bruno", "curso": "Word"},',
          '}',
          '',
          'print(alunos_por_cpf["111"]["nome"])',
        ],
      },
      { kind: 'output', lines: ['Ana'] },
      {
        kind: 'analogy',
        text: 'A lista é uma pilha de fichas: para achar uma, você folheia. O dicionário é um fichário com abas: você vai direto na letra. Com dez fichas dá na mesma; com dez mil, não.',
      },
      {
        kind: 'warning',
        text: 'Acessar uma chave que não existe interrompe o programa. Use `.get()`, que devolve `None` — ou o valor de reserva que você indicar — em vez de quebrar.',
      },
      {
        kind: 'code',
        language: 'python',
        lines: [
          'aluno = alunos_por_cpf.get("999")',
          '',
          'if aluno is None:',
          '    print("Aluno nao encontrado.")',
          'else:',
          '    print(aluno["nome"])',
        ],
      },
      { kind: 'heading', text: 'Percorrer um dicionário' },
      {
        kind: 'code',
        language: 'python',
        lines: [
          'for cpf, dados in alunos_por_cpf.items():',
          "    print(f\"{cpf}: {dados['nome']} — {dados['curso']}\")",
        ],
      },
      { kind: 'heading', text: 'Transformar listas em uma linha' },
      {
        kind: 'code',
        language: 'python',
        lines: [
          'notas = [7.5, 4.0, 9.2, 6.8]',
          '',
          'aprovadas = [nota for nota in notas if nota >= 7]',
          'arredondadas = [round(nota) for nota in notas]',
          '',
          'print(aprovadas)',
          'print(arredondadas)',
        ],
      },
      { kind: 'output', lines: ['[7.5, 9.2]', '[8, 4, 9, 7]'] },
      {
        kind: 'tip',
        text: 'Essa forma compacta é idiomática em Python e vale para uma condição simples. Se precisar de duas condições e uma transformação, volte ao laço comum: legibilidade vale mais do que caber numa linha.',
      },
      {
        kind: 'keyIdea',
        text: 'A pergunta que escolhe a estrutura é "como vou buscar isto depois?". Se a resposta for "pelo identificador", é dicionário. Se for "na ordem em que entraram", é lista.',
      },
    ],
    reflection: [
      'Você tem mil produtos e busca sempre pelo código de barras. Qual estrutura usar?',
      'Por que `.get()` é mais seguro do que colchetes?',
      'Quando uma tupla é melhor do que uma lista?',
    ],
    checklist: [
      'Sei justificar a escolha entre lista, tupla, dicionário e conjunto.',
      'Uso `.get()` quando a chave pode não existir.',
      'Percorro dicionários com `.items()`.',
      'Uso a forma compacta apenas quando ela continua legível.',
    ],
  },

  'Funções, módulos e pacotes': {
    problem:
      'Seu programa tem quatrocentas linhas num arquivo só. Para mudar o cálculo de imposto, você precisa procurar onde ele está — e ele está em três lugares.',
    outcome:
      'Dividir o programa em funções com responsabilidade única e separar o código em arquivos que fazem sentido.',
    blocks: [
      {
        kind: 'code',
        language: 'python',
        caption: 'Uma função com contrato explícito:',
        lines: [
          'def calcular_total_em_centavos(itens: list[dict], frete_em_centavos: int = 0) -> int:',
          '    """Soma o valor dos itens e acrescenta o frete.',
          '',
          '    Levanta ValueError se algum item tiver quantidade negativa.',
          '    """',
          '    total = 0',
          '',
          '    for item in itens:',
          '        if item["quantidade"] < 0:',
          '            raise ValueError(f"Quantidade negativa em {item[\'nome\']}")',
          '        total += item["preco_em_centavos"] * item["quantidade"]',
          '',
          '    return total + frete_em_centavos',
        ],
      },
      {
        kind: 'table',
        headers: ['Elemento', 'Para que serve'],
        rows: [
          [
            'Anotações de tipo',
            'Documentam o esperado e permitem que ferramentas avisem antes de executar',
          ],
          ['Valor padrão', 'Torna o parâmetro opcional sem criar uma segunda função'],
          ['Docstring', 'Explica o que faz e o que pode dar errado'],
          ['raise', 'Recusa entrada inválida em vez de calcular errado em silêncio'],
        ],
      },
      {
        kind: 'warning',
        text: 'Nunca use lista ou dicionário como valor padrão de parâmetro. O padrão é criado uma vez só e passa a ser compartilhado entre todas as chamadas — o que faz uma chamada enxergar dados da anterior. Use `None` como padrão e crie a lista dentro da função.',
      },
      {
        kind: 'code',
        language: 'python',
        lines: [
          '# Errado',
          'def registrar(item, historico=[]):',
          '    historico.append(item)',
          '    return historico',
          '',
          '# Certo',
          'def registrar(item, historico=None):',
          '    if historico is None:',
          '        historico = []',
          '    historico.append(item)',
          '    return historico',
        ],
      },
      { kind: 'heading', text: 'Separar em módulos' },
      {
        kind: 'code',
        language: 'text',
        caption: 'Uma organização que se sustenta:',
        lines: [
          'projeto/',
          '    main.py              # ponto de entrada, so orquestra',
          '    leitura.py           # ler arquivos',
          '    validacao.py         # conferir os dados',
          '    calculo.py           # regras de negocio',
          '    relatorio.py         # gerar a saida',
        ],
      },
      {
        kind: 'code',
        language: 'python',
        lines: [
          'from calculo import calcular_total_em_centavos',
          'from validacao import validar_itens',
          '',
          'if __name__ == "__main__":',
          '    itens = validar_itens(carregar_itens())',
          '    print(calcular_total_em_centavos(itens))',
        ],
      },
      {
        kind: 'paragraph',
        text: 'A condição do final significa "só execute isto se o arquivo foi chamado diretamente". Sem ela, importar o módulo em outro arquivo dispararia o programa inteiro como efeito colateral do import.',
      },
      {
        kind: 'keyIdea',
        text: 'Separe por responsabilidade, não por tipo de código. Um arquivo chamado `utils.py` vira depósito: tudo que não achou lugar acaba lá, e em pouco tempo ninguém sabe o que tem dentro.',
      },
      { kind: 'heading', text: 'Dependências registradas' },
      {
        kind: 'code',
        language: 'bash',
        lines: [
          'pip install requests',
          'pip freeze > requirements.txt',
          '',
          '# Em outro computador',
          'pip install -r requirements.txt',
        ],
      },
      {
        kind: 'tip',
        text: 'Sem o arquivo de dependências, seu projeto funciona apenas na sua máquina. Ele é o equivalente à seção "como executar" do README: sem isso, ninguém consegue rodar o que você escreveu.',
      },
    ],
    reflection: [
      'Por que lista como valor padrão de parâmetro causa comportamento inesperado?',
      'O que aconteceria ao importar um módulo sem a verificação do nome principal?',
      'Por que `utils.py` costuma virar um problema com o tempo?',
    ],
    checklist: [
      'Minhas funções têm anotações de tipo e docstring.',
      'Nenhum parâmetro tem lista ou dicionário como padrão.',
      'Separei o código em módulos por responsabilidade.',
      'Registrei as dependências em requirements.txt.',
    ],
  },

  'Erros e testes básicos': {
    problem:
      'Sua automação processou cem arquivos. No arquivo quarenta e sete ela parou com uma mensagem enorme, e os cinquenta e três seguintes não foram processados.',
    outcome:
      'Tratar as falhas previsíveis sem esconder as inesperadas, e escrever testes que confirmam as regras.',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Existem falhas que você pode prever — arquivo ausente, linha malformada, valor fora da faixa. Elas devem ser tratadas e registradas. Existem falhas que você não previu, e essas devem aparecer: escondê-las transforma um defeito visível em um defeito silencioso.',
      },
      {
        kind: 'code',
        language: 'python',
        caption: 'Tratar o específico, deixar o resto subir:',
        lines: [
          'resultados = []',
          'falhas = []',
          '',
          'for caminho in arquivos:',
          '    try:',
          '        resultados.append(processar(caminho))',
          '    except FileNotFoundError:',
          '        falhas.append((caminho, "arquivo nao encontrado"))',
          '    except ValueError as erro:',
          '        falhas.append((caminho, f"dado invalido: {erro}"))',
          '',
          'print(f"{len(resultados)} processados, {len(falhas)} com falha")',
          'for caminho, motivo in falhas:',
          '    print(f"  {caminho}: {motivo}")',
        ],
      },
      {
        kind: 'warning',
        text: 'Capturar `Exception` genérico, ou pior, usar `except:` sozinho, engole inclusive erros de digitação no seu próprio código. A automação parece funcionar, o resumo diz que houve falhas, e ninguém descobre que a causa era um nome de variável escrito errado.',
      },
      {
        kind: 'code',
        language: 'python',
        lines: [
          '# Errado - esconde qualquer problema, inclusive os seus',
          'try:',
          '    processar(caminho)',
          'except:',
          '    pass',
        ],
      },
      { kind: 'heading', text: 'finally e a limpeza' },
      {
        kind: 'code',
        language: 'python',
        lines: [
          '# Melhor ainda: o with fecha o arquivo mesmo se der erro',
          'with open(caminho, encoding="utf-8") as arquivo:',
          '    conteudo = arquivo.read()',
        ],
      },
      {
        kind: 'tip',
        text: 'O `with` garante o fechamento do arquivo em qualquer saída do bloco. Abrir sem ele e esquecer de fechar é como deixar torneiras abertas: funciona por um tempo, até acabar o limite de arquivos abertos do sistema.',
      },
      { kind: 'heading', text: 'Testar as regras' },
      {
        kind: 'code',
        language: 'python',
        caption: 'Arquivo test_calculo.py:',
        lines: [
          'from calculo import calcular_total_em_centavos',
          'import pytest',
          '',
          'def test_soma_itens_e_frete():',
          '    itens = [{"nome": "Caderno", "preco_em_centavos": 1500, "quantidade": 2}]',
          '    assert calcular_total_em_centavos(itens, frete_em_centavos=500) == 3500',
          '',
          'def test_lista_vazia_da_zero():',
          '    assert calcular_total_em_centavos([]) == 0',
          '',
          'def test_quantidade_negativa_e_recusada():',
          '    itens = [{"nome": "Caderno", "preco_em_centavos": 1500, "quantidade": -1}]',
          '    with pytest.raises(ValueError):',
          '        calcular_total_em_centavos(itens)',
        ],
      },
      {
        kind: 'paragraph',
        text: 'Os três testes cobrem naturezas diferentes: o caso comum, o limite (lista vazia) e a entrada inválida. Essa variedade encontra mais defeito do que dez testes do caso comum.',
      },
      {
        kind: 'keyIdea',
        text: 'O nome do teste é documentação executável. `test_quantidade_negativa_e_recusada` diz a regra; quando ele falhar daqui a um ano, você saberá o que se esperava sem ler o corpo.',
      },
    ],
    reflection: [
      'Por que capturar exceção genérica é perigoso numa automação?',
      'Qual a diferença entre uma falha prevista e uma falha inesperada, na prática?',
      'Escreva o nome de um teste que verifique que arquivo inexistente é registrado, não interrompe.',
    ],
    checklist: [
      'Capturo exceções específicas, nunca genéricas.',
      'Uso `with` para abrir arquivos.',
      'Minha automação registra falhas e continua.',
      'Escrevi testes para caso comum, limite e entrada inválida.',
    ],
  },

  'Arquivos CSV e JSON': {
    problem:
      'Você leu uma planilha exportada e os acentos viraram símbolos. Em outra, a coluna de CPF perdeu o zero da frente.',
    outcome:
      'Ler e gravar arquivos de dados preservando o conteúdo original, sem perder informação por conversão automática.',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Os dois problemas do enunciado têm a mesma origem: o programa adivinhou alguma coisa. Adivinhou a codificação e errou; adivinhou que uma coluna de números deveria virar número, e o zero à esquerda se perdeu.',
      },
      { kind: 'heading', text: 'Codificação' },
      {
        kind: 'code',
        language: 'python',
        lines: [
          '# Sempre declare a codificacao',
          'with open("alunos.csv", encoding="utf-8") as arquivo:',
          '    conteudo = arquivo.read()',
          '',
          '# Planilhas exportadas do Excel em portugues costumam vir assim',
          'with open("alunos.csv", encoding="latin-1") as arquivo:',
          '    conteudo = arquivo.read()',
        ],
      },
      {
        kind: 'tip',
        text: 'Se os acentos vierem errados com utf-8, tente latin-1 antes de qualquer outra coisa. É de longe a causa mais comum quando o arquivo veio de uma planilha exportada no Windows.',
      },
      { kind: 'heading', text: 'Ler CSV pelo nome da coluna' },
      {
        kind: 'code',
        language: 'python',
        lines: [
          'import csv',
          '',
          'with open("alunos.csv", encoding="utf-8", newline="") as arquivo:',
          '    leitor = csv.DictReader(arquivo, delimiter=";")',
          '    for linha in leitor:',
          '        print(linha["nome"], linha["cpf"])',
        ],
      },
      {
        kind: 'paragraph',
        text: 'Ler pelo nome da coluna, e não pela posição, protege contra a mudança mais comum em arquivos de terceiros: alguém acrescenta uma coluna no meio. Com posição, tudo desloca em silêncio; com nome, nada muda.',
      },
      {
        kind: 'warning',
        text: 'O separador do CSV brasileiro costuma ser ponto e vírgula, porque a vírgula é o separador decimal. Ler com o padrão vírgula devolve tudo numa coluna só. E o `newline=""` evita linhas em branco entre os registros no Windows.',
      },
      { kind: 'heading', text: 'Preservar o que parece número e não é' },
      {
        kind: 'table',
        headers: ['Campo', 'Parece', 'Deve ser tratado como', 'Se virar número'],
        rows: [
          ['CPF', 'Número', 'Texto', 'Perde o zero à esquerda'],
          ['CEP', 'Número', 'Texto', 'Perde o zero à esquerda'],
          ['Telefone', 'Número', 'Texto', 'Perde o zero e o formato'],
          ['Código de barras', 'Número', 'Texto', 'Vira notação científica'],
        ],
      },
      {
        kind: 'keyIdea',
        text: 'A pergunta que decide: faz sentido somar dois desses valores? Se não faz, é texto — mesmo que só tenha dígitos.',
      },
      { kind: 'heading', text: 'JSON' },
      {
        kind: 'code',
        language: 'python',
        lines: [
          'import json',
          '',
          '# Ler',
          'with open("config.json", encoding="utf-8") as arquivo:',
          '    dados = json.load(arquivo)',
          '',
          '# Gravar de forma legivel e com acentos preservados',
          'with open("saida.json", "w", encoding="utf-8") as arquivo:',
          '    json.dump(dados, arquivo, ensure_ascii=False, indent=2)',
        ],
      },
      {
        kind: 'paragraph',
        text: 'O `ensure_ascii=False` mantém acentos legíveis no arquivo em vez de códigos de escape. O `indent=2` deixa o resultado legível para uma pessoa — e faz diferença enorme quando o arquivo entra num repositório e alguém precisa revisar a mudança.',
      },
      {
        kind: 'warning',
        text: 'Ao gravar, nunca escreva direto por cima do arquivo original antes de terminar. Se o programa falhar no meio, você fica sem o novo e sem o antigo. Grave num arquivo temporário e só então substitua.',
      },
    ],
    reflection: [
      'Por que CPF deve ser tratado como texto mesmo tendo só dígitos?',
      'O que acontece ao ler um CSV brasileiro com o separador padrão?',
      'Por que gravar por cima do original é arriscado?',
    ],
    checklist: [
      'Declaro a codificação ao abrir arquivos.',
      'Leio CSV pelo nome da coluna e com o separador correto.',
      'Mantenho como texto os campos que não fazem sentido somar.',
      'Gravo em arquivo temporário antes de substituir o original.',
    ],
  },

  'Automação de tarefas': {
    problem:
      'Todo mês alguém baixa quarenta relatórios, renomeia um por um seguindo um padrão e separa em pastas por setor. Leva uma tarde inteira.',
    outcome:
      'Automatizar uma rotina de arquivos com segurança, de forma que um erro no meio não destrua o trabalho de ninguém.',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Automação de arquivos é onde o Python mais rende para quem vem do administrativo. Também é onde o estrago é maior quando algo dá errado, porque o programa mexe em documentos reais.',
      },
      { kind: 'heading', text: 'Caminhos que funcionam em qualquer sistema' },
      {
        kind: 'code',
        language: 'python',
        lines: [
          'from pathlib import Path',
          '',
          'origem = Path("relatorios")',
          'destino = Path("organizados")',
          '',
          '# Junta caminhos sem se preocupar com barra ou contrabarra',
          'arquivo = origem / "janeiro" / "vendas.csv"',
          '',
          'for csv in origem.glob("*.csv"):',
          '    print(csv.name, csv.stat().st_size)',
        ],
      },
      {
        kind: 'tip',
        text: 'Escrever caminhos com barras coladas no texto quebra ao mudar de sistema. O operador de divisão do `Path` monta o caminho correto em Windows, Linux e macOS sem que você pense nisso.',
      },
      { kind: 'heading', text: 'A regra de ouro: primeiro simular' },
      {
        kind: 'code',
        language: 'python',
        lines: [
          'SIMULACAO = True   # troque para False so depois de conferir a saida',
          '',
          'for arquivo in origem.glob("*.csv"):',
          '    setor = arquivo.stem.split("_")[0]',
          '    pasta_destino = destino / setor',
          '    novo_caminho = pasta_destino / arquivo.name',
          '',
          '    if SIMULACAO:',
          '        print(f"[simulacao] {arquivo} -> {novo_caminho}")',
          '        continue',
          '',
          '    pasta_destino.mkdir(parents=True, exist_ok=True)',
          '    arquivo.rename(novo_caminho)',
        ],
      },
      {
        kind: 'output',
        caption: 'A saída da simulação, que você confere antes de valer:',
        lines: [
          '[simulacao] relatorios/vendas_janeiro.csv -> organizados/vendas/vendas_janeiro.csv',
          '[simulacao] relatorios/rh_janeiro.csv -> organizados/rh/rh_janeiro.csv',
        ],
      },
      {
        kind: 'keyIdea',
        text: 'Toda automação que apaga, move ou renomeia deve ter um modo de simulação. Rodar uma vez em simulação custa segundos; recuperar duzentos arquivos movidos para o lugar errado custa um dia — quando é possível.',
      },
      {
        kind: 'warning',
        text: 'Nunca apague o original antes de confirmar que a cópia chegou. E jamais rode uma automação nova diretamente na pasta de trabalho de alguém: faça uma cópia da pasta e teste nela.',
      },
      { kind: 'heading', text: 'Datas para nomear arquivos' },
      {
        kind: 'code',
        language: 'python',
        lines: [
          'from datetime import date',
          '',
          'hoje = date.today()',
          'nome = f"relatorio_{hoje:%Y-%m-%d}.csv"',
          'print(nome)',
        ],
      },
      { kind: 'output', lines: ['relatorio_2026-08-03.csv'] },
      {
        kind: 'paragraph',
        text: 'O formato com ano, mês e dia nessa ordem faz a ordenação alfabética coincidir com a ordenação cronológica. Nomear como dia-mês-ano parece natural e embaralha os arquivos na listagem.',
      },
      { kind: 'heading', text: 'Registrar o que aconteceu' },
      {
        kind: 'code',
        language: 'python',
        lines: [
          'import logging',
          '',
          'logging.basicConfig(',
          '    filename="automacao.log",',
          '    level=logging.INFO,',
          '    format="%(asctime)s %(levelname)s %(message)s",',
          ')',
          '',
          'logging.info("Movido %s para %s", arquivo.name, pasta_destino)',
          'logging.error("Falha em %s: %s", arquivo.name, erro)',
        ],
      },
      {
        kind: 'warning',
        text: 'Nunca registre no log dado pessoal completo, senha ou conteúdo de documento. Registre o nome do arquivo e o resultado — o suficiente para investigar sem criar um segundo lugar onde dados sensíveis ficam guardados.',
      },
    ],
    reflection: [
      'Qual rotina do seu trabalho poderia ser automatizada? Quais arquivos ela mexe?',
      'Por que o modo de simulação é obrigatório em automação que move arquivos?',
      'Por que nomear com ano-mês-dia é melhor do que dia-mês-ano?',
    ],
    checklist: [
      'Uso Path em vez de montar caminhos com texto.',
      'Minha automação tem modo de simulação e eu conferi a saída.',
      'Testei numa cópia da pasta, não na original.',
      'Registro o resultado em log, sem dado sensível.',
    ],
  },
};
