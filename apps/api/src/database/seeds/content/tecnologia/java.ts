import type { TechCourseContent } from './tech-types';

/**
 * Java — Fundamentos e Orientação a Objetos.
 *
 * O curso mais longo da trilha, e o único onde a modelagem importa tanto
 * quanto a sintaxe. O fio condutor é um sistema de biblioteca: um domínio que
 * qualquer pessoa entende sem explicação e que tem regras de negócio de
 * verdade — o livro emprestado não pode ser emprestado de novo.
 */
export const JAVA: TechCourseContent = {
  'JDK, JVM e primeiro programa': {
    problem:
      'Você escreveu o programa, salvou como Programa.java e mandou executar. O terminal responde que não encontrou nem reconheceu o comando.',
    outcome:
      'Entender por que Java tem uma etapa a mais que Python ou JavaScript, e executar seu primeiro programa do começo ao fim.',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Java não executa o arquivo que você escreveu. Ele primeiro traduz o texto para um formato intermediário, e é esse formato que roda. Entender essa etapa evita boa parte da confusão inicial.',
      },
      {
        kind: 'table',
        headers: ['Sigla', 'O que é', 'Papel'],
        rows: [
          [
            'JDK',
            'Kit de desenvolvimento',
            'O que você instala para programar; contém o compilador',
          ],
          ['JVM', 'Máquina virtual', 'Executa o formato intermediário; existe para cada sistema'],
          ['Bytecode', 'O formato intermediário', 'O arquivo .class gerado pela compilação'],
        ],
      },
      {
        kind: 'analogy',
        text: 'É como traduzir um livro para uma língua franca. Você escreve em Java, o compilador traduz para o bytecode, e cada sistema tem um leitor que entende essa língua. Por isso o mesmo arquivo compilado roda em Windows, Linux e macOS sem alteração.',
      },
      {
        kind: 'code',
        language: 'java',
        caption: 'Arquivo Programa.java:',
        lines: [
          'public class Programa {',
          '    public static void main(String[] args) {',
          '        System.out.println("Biblioteca aberta.");',
          '    }',
          '}',
        ],
      },
      {
        kind: 'code',
        language: 'bash',
        lines: [
          'javac Programa.java   # compila e gera Programa.class',
          'java Programa         # executa (sem a extensao)',
        ],
      },
      { kind: 'output', lines: ['Biblioteca aberta.'] },
      {
        kind: 'warning',
        text: 'O nome do arquivo precisa ser idêntico ao nome da classe pública, com a mesma diferença entre maiúsculas e minúsculas. `Programa.java` com `class programa` dentro não compila — e a mensagem de erro nem sempre deixa isso óbvio.',
      },
      { kind: 'heading', text: 'Decifrando a linha do main' },
      {
        kind: 'table',
        headers: ['Palavra', 'Significa'],
        rows: [
          ['public', 'Pode ser chamado de fora da classe'],
          ['static', 'Pertence à classe, não a um objeto — por isso roda sem criar nada antes'],
          ['void', 'Não devolve valor'],
          ['String[] args', 'Recebe os argumentos passados na linha de comando'],
        ],
      },
      {
        kind: 'paragraph',
        text: 'A palavra `static` é a que responde à pergunta "como o programa começa se ainda não existe nenhum objeto?". O método principal pertence à classe em si, então a JVM consegue chamá-lo sem construir nada antes.',
      },
      {
        kind: 'tip',
        text: 'A partir da versão 11 é possível executar um arquivo único direto com `java Programa.java`, sem compilar antes. Para aprender, compile explicitamente pelo menos algumas vezes: ver o arquivo .class aparecer torna a etapa concreta.',
      },
    ],
    reflection: [
      'Por que o mesmo arquivo compilado roda em sistemas diferentes?',
      'O que a palavra `static` resolve na assinatura do método principal?',
      'O que acontece se o nome do arquivo não corresponder ao da classe?',
    ],
    checklist: [
      'Sei diferenciar JDK, JVM e bytecode.',
      'Compilei e executei um programa em dois comandos.',
      'Sei explicar cada palavra da assinatura do main.',
    ],
  },

  'Tipos, operadores e controle de fluxo': {
    problem:
      'Você somou duas notas e dividiu por dois. As notas eram 7 e 8, e o programa respondeu 7 em vez de 7.5.',
    outcome:
      'Escolher tipos conscientemente e escrever decisões e repetições sem cair nas armadilhas de conversão.',
    blocks: [
      {
        kind: 'paragraph',
        text: 'A divisão entre dois inteiros em Java devolve um inteiro: a parte decimal é descartada, sem aviso e sem erro. Como 15 dividido por 2 dá 7 e sobra 1, o resultado é 7.',
      },
      {
        kind: 'code',
        language: 'java',
        lines: [
          'int soma = 7 + 8;',
          'System.out.println(soma / 2);        // divisao inteira',
          'System.out.println(soma / 2.0);      // um decimal basta para mudar tudo',
        ],
      },
      { kind: 'output', lines: ['7', '7.5'] },
      { kind: 'heading', text: 'Tipos primitivos e seus limites' },
      {
        kind: 'table',
        headers: ['Tipo', 'Guarda', 'Cuidado'],
        rows: [
          ['int', 'Inteiro até cerca de 2,1 bilhões', 'Estoura em silêncio e vira negativo'],
          ['long', 'Inteiro muito maior', 'Use para identificadores e valores em centavos'],
          ['double', 'Decimal', 'Impreciso para dinheiro'],
          ['boolean', 'true ou false', 'Não aceita número no lugar'],
          ['char', 'Um caractere', 'Aspas simples, diferente de String'],
        ],
      },
      {
        kind: 'warning',
        text: 'Um `int` que ultrapassa o limite não gera erro: ele dá a volta e vira negativo. Somar centavos de um faturamento grande em `int` é uma forma silenciosa de produzir valores absurdos. Use `long`.',
      },
      { kind: 'heading', text: 'String se compara com equals' },
      {
        kind: 'code',
        language: 'java',
        lines: [
          'String a = new String("emprestado");',
          'String b = "emprestado";',
          '',
          'System.out.println(a == b);        // compara se e o mesmo objeto',
          'System.out.println(a.equals(b));   // compara o conteudo',
        ],
      },
      { kind: 'output', lines: ['false', 'true'] },
      {
        kind: 'keyIdea',
        text: 'Para texto, use sempre `equals`. O sinal de igualdade duplo pergunta se são o mesmo objeto na memória, e às vezes responde verdadeiro por otimização da linguagem — o que faz o erro passar nos testes e falhar em produção.',
      },
      { kind: 'heading', text: 'Decisões' },
      {
        kind: 'code',
        language: 'java',
        lines: [
          'String situacao;',
          '',
          'if (diasDeAtraso == 0) {',
          '    situacao = "em dia";',
          '} else if (diasDeAtraso <= 7) {',
          '    situacao = "atrasado";',
          '} else {',
          '    situacao = "bloqueado";',
          '}',
        ],
      },
      {
        kind: 'code',
        language: 'java',
        caption: 'Quando são muitos valores fixos, o switch moderno é mais claro:',
        lines: [
          'String mensagem = switch (status) {',
          '    case DISPONIVEL -> "Pode emprestar";',
          '    case EMPRESTADO -> "Ja esta com outro leitor";',
          '    case EM_REPARO  -> "Indisponivel temporariamente";',
          '};',
        ],
      },
      {
        kind: 'tip',
        text: 'A forma com seta não escorre de um caso para o outro, ao contrário do switch antigo com dois-pontos, onde esquecer o `break` faz executar os casos seguintes. É um erro clássico que a forma nova elimina.',
      },
      { kind: 'heading', text: 'Repetições' },
      {
        kind: 'code',
        language: 'java',
        lines: [
          'String[] titulos = {"Dom Casmurro", "Vidas Secas", "Grande Sertao"};',
          '',
          'for (String titulo : titulos) {',
          '    System.out.println(titulo);',
          '}',
          '',
          'for (int i = 0; i < titulos.length; i++) {',
          '    System.out.println((i + 1) + ". " + titulos[i]);',
          '}',
        ],
      },
      {
        kind: 'warning',
        text: 'No laço com índice, a condição precisa ser menor que o comprimento — nunca menor ou igual. Com três itens, as posições válidas são 0, 1 e 2; tentar a posição 3 interrompe o programa.',
      },
    ],
    reflection: [
      'Por que 15 dividido por 2 devolve 7 em Java?',
      'O que acontece quando um `int` ultrapassa o limite? Por que isso é pior do que um erro?',
      'Por que comparar texto com o sinal duplo às vezes funciona e às vezes não?',
    ],
    checklist: [
      'Sei quando a divisão descarta a parte decimal.',
      'Uso `long` para valores que podem crescer.',
      'Comparo texto sempre com equals.',
      'Uso a forma de switch com seta.',
    ],
  },

  'Métodos e organização do código': {
    problem:
      'Seu método principal tem cento e vinte linhas: lê a entrada, valida, calcula a multa e imprime o recibo. Para testar o cálculo da multa, você precisa rodar o programa inteiro.',
    outcome:
      'Dividir o programa em métodos com uma responsabilidade cada, de modo que a regra possa ser conferida isoladamente.',
    blocks: [
      {
        kind: 'code',
        language: 'java',
        caption: 'Um método com responsabilidade única:',
        lines: [
          '/**',
          ' * Calcula a multa por atraso na devolucao.',
          ' *',
          ' * @param diasDeAtraso dias corridos apos o prazo; zero ou negativo nao gera multa',
          ' * @return valor da multa em centavos',
          ' */',
          'public static long calcularMultaEmCentavos(int diasDeAtraso) {',
          '    if (diasDeAtraso <= 0) {',
          '        return 0L;',
          '    }',
          '',
          '    long multa = diasDeAtraso * VALOR_DIARIO_EM_CENTAVOS;',
          '    return Math.min(multa, TETO_DA_MULTA_EM_CENTAVOS);',
          '}',
        ],
      },
      {
        kind: 'paragraph',
        text: 'Este método pode ser conferido com três chamadas — atraso zero, atraso normal, atraso que estoura o teto — sem ler entrada nem imprimir nada. Era exatamente isso que as cento e vinte linhas impediam.',
      },
      { kind: 'heading', text: 'Sobrecarga: mesmo nome, entradas diferentes' },
      {
        kind: 'code',
        language: 'java',
        lines: [
          'public static long calcularMultaEmCentavos(int diasDeAtraso) {',
          '    return calcularMultaEmCentavos(diasDeAtraso, VALOR_DIARIO_EM_CENTAVOS);',
          '}',
          '',
          'public static long calcularMultaEmCentavos(int diasDeAtraso, long valorDiario) {',
          '    if (diasDeAtraso <= 0) return 0L;',
          '    return Math.min(diasDeAtraso * valorDiario, TETO_DA_MULTA_EM_CENTAVOS);',
          '}',
        ],
      },
      {
        kind: 'tip',
        text: 'Repare que a primeira versão delega para a segunda em vez de repetir a regra. Sobrecarga que duplica lógica cria dois lugares para corrigir — exatamente o problema que ela deveria evitar.',
      },
      { kind: 'heading', text: 'Passagem de argumentos' },
      {
        kind: 'paragraph',
        text: 'Java sempre passa uma cópia do valor. Para tipos primitivos, isso significa que alterar o parâmetro dentro do método não afeta o original. Para objetos, o que é copiado é a referência — então o método não pode trocar o objeto de quem chamou, mas pode alterar o conteúdo dele.',
      },
      {
        kind: 'code',
        language: 'java',
        lines: [
          'static void tentarAlterar(int numero, List<String> lista) {',
          '    numero = 99;                 // nao afeta quem chamou',
          '    lista.add("acrescentado");   // afeta, o objeto e o mesmo',
          '}',
        ],
      },
      {
        kind: 'warning',
        text: 'Um método que recebe uma coleção e a modifica surpreende quem o chamou. Se o objetivo é transformar, prefira devolver uma nova coleção; se for mesmo alterar, deixe isso explícito no nome do método.',
      },
      { kind: 'heading', text: 'Constantes' },
      {
        kind: 'code',
        language: 'java',
        lines: [
          'public static final long VALOR_DIARIO_EM_CENTAVOS = 150L;',
          'public static final long TETO_DA_MULTA_EM_CENTAVOS = 3000L;',
          'public static final int PRAZO_PADRAO_EM_DIAS = 14;',
        ],
      },
      {
        kind: 'keyIdea',
        text: 'Números soltos no meio do código não dizem o que significam. `if (dias > 14)` obriga a adivinhar; `if (dias > PRAZO_PADRAO_EM_DIAS)` explica sozinho e centraliza a mudança quando a biblioteca revisar o prazo.',
      },
    ],
    reflection: [
      'Quantas chamadas bastam para conferir o cálculo da multa? E quantas seriam com tudo no método principal?',
      'Por que uma sobrecarga deve delegar em vez de repetir a regra?',
      'Que problema um método que altera a lista recebida pode causar?',
    ],
    checklist: [
      'Cada método meu faz uma coisa e pode ser descrito sem "e".',
      'Minhas sobrecargas delegam para uma implementação única.',
      'Substituí números soltos por constantes com nome.',
      'Documentei o que os parâmetros esperam.',
    ],
  },

  'Classes, objetos e construtores': {
    problem:
      'Você está guardando os dados dos livros em vetores paralelos: um para títulos, outro para autores, outro para situação. Remover um livro exige acertar as três listas na mesma posição.',
    outcome:
      'Modelar uma entidade do problema como classe, reunindo dados e comportamento que pertencem juntos.',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Vetores paralelos funcionam até a primeira remoção fora de ordem. O que falta é reconhecer que título, autor e situação não são três listas: são características de uma coisa só, o livro.',
      },
      {
        kind: 'code',
        language: 'java',
        lines: [
          'public class Livro {',
          '    private final String isbn;',
          '    private final String titulo;',
          '    private final String autor;',
          '    private StatusDoLivro status;',
          '',
          '    public Livro(String isbn, String titulo, String autor) {',
          '        this.isbn = isbn;',
          '        this.titulo = titulo;',
          '        this.autor = autor;',
          '        this.status = StatusDoLivro.DISPONIVEL;',
          '    }',
          '',
          '    public boolean estaDisponivel() {',
          '        return status == StatusDoLivro.DISPONIVEL;',
          '    }',
          '',
          '    public String getTitulo() {',
          '        return titulo;',
          '    }',
          '}',
        ],
      },
      {
        kind: 'table',
        headers: ['Termo', 'O que é'],
        rows: [
          ['Classe', 'O molde: descreve o que todo livro tem e faz'],
          ['Objeto', 'Um livro específico, criado a partir do molde'],
          ['Atributo', 'Uma característica: título, autor, situação'],
          ['Construtor', 'O que garante que o objeto nasça em estado válido'],
        ],
      },
      {
        kind: 'analogy',
        text: 'A classe é a planta da casa; o objeto é cada casa construída. A planta existe uma vez, as casas são muitas, e cada uma tem a própria cor de parede sem deixar de seguir a planta.',
      },
      { kind: 'heading', text: 'O construtor é a fronteira do estado válido' },
      {
        kind: 'code',
        language: 'java',
        lines: [
          'public Livro(String isbn, String titulo, String autor) {',
          '    if (isbn == null || isbn.isBlank()) {',
          '        throw new IllegalArgumentException("ISBN e obrigatorio.");',
          '    }',
          '    if (titulo == null || titulo.isBlank()) {',
          '        throw new IllegalArgumentException("Titulo e obrigatorio.");',
          '    }',
          '',
          '    this.isbn = isbn;',
          '    this.titulo = titulo;',
          '    this.autor = autor;',
          '    this.status = StatusDoLivro.DISPONIVEL;',
          '}',
        ],
      },
      {
        kind: 'keyIdea',
        text: 'Validar no construtor significa que um objeto inválido nunca chega a existir. Todo o resto do programa pode confiar que qualquer Livro que receber tem ISBN e título — e essa confiança elimina verificações repetidas em dezenas de lugares.',
      },
      {
        kind: 'paragraph',
        text: 'O `final` nos atributos que não mudam é outra garantia parecida: o compilador impede a alteração. Um livro pode mudar de situação, mas não de ISBN — e isso fica expresso no código, não num comentário.',
      },
      { kind: 'heading', text: 'Comportamento junto dos dados' },
      {
        kind: 'paragraph',
        text: 'Repare no método `estaDisponivel`. Quem pergunta não precisa saber como a situação é representada por dentro. Se amanhã a biblioteca passar a considerar "em reparo" como indisponível, muda-se um método — e nenhum dos lugares que perguntam.',
      },
      {
        kind: 'warning',
        text: 'Uma classe que só tem atributos e métodos de acesso, sem nenhum comportamento, costuma ser sinal de que a regra ficou espalhada em outro lugar. Pergunte sempre: que decisão este objeto poderia tomar sobre si mesmo?',
      },
    ],
    reflection: [
      'Que problemas vetores paralelos causam que uma classe resolve?',
      'Por que validar no construtor simplifica o resto do programa?',
      'Que outro comportamento a classe Livro poderia ter além de informar disponibilidade?',
    ],
    checklist: [
      'Modelei uma entidade com atributos que pertencem juntos.',
      'Meu construtor recusa estado inválido.',
      'Marquei como final o que não muda.',
      'Minha classe tem pelo menos um comportamento, não só acesso a dados.',
    ],
  },

  'Encapsulamento e validação': {
    problem:
      'Todos os atributos da sua classe são públicos. Em algum lugar do sistema, alguém marcou um livro como disponível enquanto ele ainda estava emprestado, e agora ele foi emprestado duas vezes.',
    outcome:
      'Proteger as regras da entidade de modo que ela não possa ser colocada em um estado impossível, por ninguém.',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Encapsulamento não é esconder por esconder: é garantir que toda alteração passe por um lugar onde a regra é verificada. Com atributos públicos, qualquer trecho do sistema pode criar uma situação impossível — e você nunca vai descobrir qual foi.',
      },
      {
        kind: 'code',
        language: 'java',
        caption: 'Frágil — qualquer um muda para qualquer coisa:',
        lines: [
          'public class Livro {',
          '    public StatusDoLivro status;',
          '}',
          '',
          '// Em qualquer lugar do sistema:',
          'livro.status = StatusDoLivro.DISPONIVEL;   // mesmo estando emprestado',
        ],
      },
      {
        kind: 'code',
        language: 'java',
        caption: 'Protegido — a transição só acontece se for legítima:',
        lines: [
          'public class Livro {',
          '    private StatusDoLivro status;',
          '',
          '    public void emprestar() {',
          '        if (status != StatusDoLivro.DISPONIVEL) {',
          '            throw new IllegalStateException(',
          '                "Livro nao esta disponivel: " + status);',
          '        }',
          '        this.status = StatusDoLivro.EMPRESTADO;',
          '    }',
          '',
          '    public void devolver() {',
          '        if (status != StatusDoLivro.EMPRESTADO) {',
          '            throw new IllegalStateException(',
          '                "Livro nao esta emprestado: " + status);',
          '        }',
          '        this.status = StatusDoLivro.DISPONIVEL;',
          '    }',
          '}',
        ],
      },
      {
        kind: 'keyIdea',
        text: 'Note que os métodos não se chamam `setStatus`: chamam-se `emprestar` e `devolver`. O nome descreve a operação do negócio, não a mexida no atributo. Um método chamado `setStatus` aceitaria qualquer transição e traria o problema de volta.',
      },
      { kind: 'heading', text: 'Métodos de acesso não são obrigatórios' },
      {
        kind: 'table',
        headers: ['Situação', 'Decisão'],
        rows: [
          ['Alguém precisa ler o título', 'Método de leitura'],
          [
            'Ninguém de fora precisa da data interna de controle',
            'Nenhum método — mantenha privado',
          ],
          ['A alteração tem regra', 'Método com nome da operação, com a regra dentro'],
          ['A alteração não tem regra e ninguém altera', 'Marque como final e não crie nada'],
        ],
      },
      {
        kind: 'warning',
        text: 'Criar automaticamente um par de métodos de leitura e escrita para cada atributo devolve a classe ao estado de dados públicos, só que com mais linhas. A pergunta certa não é "que atributos existem", e sim "que operações fazem sentido".',
      },
      { kind: 'heading', text: 'Cuidado com coleções internas' },
      {
        kind: 'code',
        language: 'java',
        caption: 'Vazamento — quem recebe pode alterar a lista de dentro:',
        lines: ['public List<Emprestimo> getEmprestimos() {', '    return emprestimos;', '}'],
      },
      {
        kind: 'code',
        language: 'java',
        caption: 'Protegido — devolve uma visão que não aceita alteração:',
        lines: [
          'public List<Emprestimo> getEmprestimos() {',
          '    return Collections.unmodifiableList(emprestimos);',
          '}',
        ],
      },
      {
        kind: 'paragraph',
        text: 'Sem isso, todo o cuidado com os métodos se perde: quem chamou recebe a própria lista interna e pode acrescentar ou remover sem passar por nenhuma regra.',
      },
    ],
    reflection: [
      'Por que `emprestar()` é um nome melhor do que `setStatus()`?',
      'Que estado impossível a sua entidade poderia assumir hoje se alguém alterasse um atributo direto?',
      'Como devolver uma lista interna sem permitir alteração?',
    ],
    checklist: [
      'Meus atributos são privados.',
      'Os métodos que alteram têm nome de operação do negócio e verificam a regra.',
      'Não criei métodos de acesso sem necessidade.',
      'Coleções internas não vazam de forma alterável.',
    ],
  },

  'Herança, interfaces e composição': {
    problem:
      'A biblioteca passou a emprestar revistas e DVDs. Cada um tem prazo e multa diferentes, mas todos precisam ser emprestados e devolvidos.',
    outcome:
      'Escolher entre herança, interface e composição conforme o tipo de reaproveitamento que o problema pede.',
    blocks: [
      {
        kind: 'table',
        headers: ['Mecanismo', 'Relação', 'Use quando'],
        rows: [
          ['Herança', 'É um tipo de', 'Existe hierarquia real e o filho serve onde o pai serve'],
          ['Interface', 'É capaz de', 'Coisas diferentes precisam ser tratadas do mesmo jeito'],
          ['Composição', 'Tem um', 'Um objeto usa outro para fazer parte do trabalho'],
        ],
      },
      { kind: 'heading', text: 'Interface: o contrato' },
      {
        kind: 'code',
        language: 'java',
        lines: [
          'public interface Emprestavel {',
          '    int prazoEmDias();',
          '    long multaDiariaEmCentavos();',
          '    void emprestar();',
          '    void devolver();',
          '}',
        ],
      },
      {
        kind: 'code',
        language: 'java',
        lines: [
          'public class Livro implements Emprestavel {',
          '    @Override',
          '    public int prazoEmDias() {',
          '        return 14;',
          '    }',
          '',
          '    @Override',
          '    public long multaDiariaEmCentavos() {',
          '        return 150L;',
          '    }',
          '}',
          '',
          'public class Dvd implements Emprestavel {',
          '    @Override',
          '    public int prazoEmDias() {',
          '        return 3;',
          '    }',
          '',
          '    @Override',
          '    public long multaDiariaEmCentavos() {',
          '        return 500L;',
          '    }',
          '}',
        ],
      },
      {
        kind: 'paragraph',
        text: 'Agora o resto do sistema trabalha com `Emprestavel` e não precisa saber se é livro ou DVD. Acrescentar revistas amanhã é criar uma classe nova — nenhum código existente muda.',
      },
      {
        kind: 'code',
        language: 'java',
        lines: [
          'public long calcularMultaEmCentavos(Emprestavel item, int diasDeAtraso) {',
          '    if (diasDeAtraso <= 0) return 0L;',
          '    return diasDeAtraso * item.multaDiariaEmCentavos();',
          '}',
        ],
      },
      {
        kind: 'keyIdea',
        text: 'Esse método funciona para qualquer tipo que exista hoje e para os que existirem amanhã. É a diferença entre um sistema que cresce por acréscimo e um que exige alterar o que já funciona a cada novidade.',
      },
      { kind: 'heading', text: 'Herança: use com parcimônia' },
      {
        kind: 'paragraph',
        text: 'A herança amarra o filho ao pai: mudar a classe base afeta todos os descendentes, às vezes de formas que ninguém previu. Use somente quando a frase "é um tipo de" for verdadeira sem forçar, e quando o filho puder substituir o pai em qualquer lugar sem quebrar nada.',
      },
      {
        kind: 'warning',
        text: 'O teste prático: se em algum lugar você precisar verificar de qual subclasse o objeto é para decidir o que fazer, a herança está no lugar errado. Essa verificação é o sinal de que o comportamento deveria estar dentro dos próprios objetos.',
      },
      { kind: 'heading', text: 'Composição: quase sempre a melhor escolha' },
      {
        kind: 'code',
        language: 'java',
        lines: [
          'public class ServicoDeEmprestimo {',
          '    private final RepositorioDeItens repositorio;',
          '    private final CalculadoraDeMulta calculadora;',
          '',
          '    public ServicoDeEmprestimo(RepositorioDeItens repositorio,',
          '                               CalculadoraDeMulta calculadora) {',
          '        this.repositorio = repositorio;',
          '        this.calculadora = calculadora;',
          '    }',
          '}',
        ],
      },
      {
        kind: 'paragraph',
        text: 'O serviço não herda de ninguém: ele reúne colaboradores. Para testá-lo, basta passar versões simplificadas dessas peças no construtor — algo impossível quando a dependência está fixa dentro da classe.',
      },
      {
        kind: 'tip',
        text: 'Uma orientação que se sustenta bem na prática: prefira composição a herança, e prefira interface a classe abstrata. Comece assim e recorra à herança apenas quando a hierarquia for evidente.',
      },
    ],
    reflection: [
      'Revistas passam a ser emprestadas. Que código muda na solução com interface?',
      'Por que verificar de qual subclasse um objeto é indica um problema de modelagem?',
      'Como a composição facilita testar o serviço de empréstimo?',
    ],
    checklist: [
      'Sei distinguir "é um tipo de", "é capaz de" e "tem um".',
      'Usei interface para tratar tipos diferentes do mesmo jeito.',
      'Minhas dependências chegam pelo construtor.',
      'Não verifico subclasse para decidir comportamento.',
    ],
  },

  'Coleções e generics': {
    problem:
      'Sua lista de empréstimos tem cinco mil registros. Buscar por matrícula percorre tudo, e o relatório mensal demora minutos.',
    outcome:
      'Escolher a coleção conforme o acesso que o programa faz, e usar generics para que o compilador impeça erros de tipo.',
    blocks: [
      {
        kind: 'table',
        headers: ['Coleção', 'Garante', 'Buscar por chave', 'Use para'],
        rows: [
          [
            'ArrayList',
            'Ordem de inserção, aceita repetidos',
            'Percorre tudo',
            'Sequências, histórico',
          ],
          ['HashSet', 'Sem repetição', 'Rápido', 'Conjuntos, verificar pertinência'],
          ['HashMap', 'Pares de chave e valor', 'Rápido', 'Buscar por identificador'],
          [
            'LinkedHashMap',
            'Como o HashMap, mantendo a ordem',
            'Rápido',
            'Quando a ordem de inserção importa',
          ],
        ],
      },
      {
        kind: 'code',
        language: 'java',
        caption: 'O problema da aula: buscar por chave em vez de varrer.',
        lines: [
          '// Antes: percorre ate cinco mil registros',
          'List<Emprestimo> emprestimos = new ArrayList<>();',
          '',
          '// Depois: encontra direto',
          'Map<String, List<Emprestimo>> porMatricula = new HashMap<>();',
          '',
          'porMatricula',
          '    .computeIfAbsent(matricula, chave -> new ArrayList<>())',
          '    .add(emprestimo);',
          '',
          'List<Emprestimo> doAluno = porMatricula.getOrDefault(matricula, List.of());',
        ],
      },
      {
        kind: 'tip',
        text: '`computeIfAbsent` cria a lista só na primeira vez, evitando a verificação manual de existência. E `getOrDefault` devolve uma lista vazia em vez de nulo — o que dispensa a verificação de nulo em quem chamou.',
      },
      { kind: 'heading', text: 'Generics: o tipo declarado' },
      {
        kind: 'code',
        language: 'java',
        lines: [
          '// Sem generics: aceita qualquer coisa, quebra so ao executar',
          'List semTipo = new ArrayList();',
          'semTipo.add("texto");',
          'semTipo.add(42);',
          'String valor = (String) semTipo.get(1);   // estoura aqui',
          '',
          '// Com generics: o compilador recusa antes de executar',
          'List<String> comTipo = new ArrayList<>();',
          'comTipo.add("texto");',
          '// comTipo.add(42);   nao compila',
        ],
      },
      {
        kind: 'keyIdea',
        text: 'Generics transformam um erro de execução — que aparece para o usuário — em erro de compilação, que aparece para você. Todo erro que muda de lado nessa fronteira é ganho puro.',
      },
      { kind: 'heading', text: 'Percorrer e transformar' },
      {
        kind: 'code',
        language: 'java',
        lines: [
          'List<String> atrasados = emprestimos.stream()',
          '    .filter(Emprestimo::estaAtrasado)',
          '    .map(emprestimo -> emprestimo.getItem().getTitulo())',
          '    .sorted()',
          '    .toList();',
        ],
      },
      {
        kind: 'paragraph',
        text: 'A leitura acompanha a intenção: filtre os atrasados, pegue o título, ordene. Um laço com lista auxiliar faz o mesmo em oito linhas que precisam ser lidas por inteiro para se descobrir o objetivo.',
      },
      {
        kind: 'warning',
        text: 'Alterar uma coleção enquanto ela está sendo percorrida provoca erro em tempo de execução. Para remover itens durante a leitura, use `removeIf` ou monte uma lista nova — nunca remova dentro do laço.',
      },
      {
        kind: 'code',
        language: 'java',
        lines: [
          '// Errado: quebra ao executar',
          '// for (Emprestimo e : emprestimos) { if (e.estaQuitado()) emprestimos.remove(e); }',
          '',
          '// Certo',
          'emprestimos.removeIf(Emprestimo::estaQuitado);',
        ],
      },
    ],
    reflection: [
      'Você busca sempre pelo ISBN. Qual coleção usar e por quê?',
      'Por que generics transformarem erro de execução em erro de compilação é uma vantagem tão grande?',
      'O que acontece ao remover itens dentro de um laço que percorre a coleção?',
    ],
    checklist: [
      'Sei justificar a escolha entre lista, conjunto e mapa.',
      'Declaro o tipo em todas as coleções.',
      'Uso getOrDefault ou List.of para evitar nulo.',
      'Removo itens com removeIf, nunca dentro do laço.',
    ],
  },

  'Exceções e testes básicos': {
    problem:
      'Um empréstimo falhou e o sistema mostrou uma tela branca. No log só havia uma linha: "NullPointerException".',
    outcome:
      'Sinalizar falhas com informação suficiente para investigá-las, e escrever testes que provem as regras do domínio.',
    blocks: [
      {
        kind: 'paragraph',
        text: 'Uma exceção sem contexto é quase inútil. A diferença entre uma investigação de cinco minutos e uma de duas horas costuma estar na quantidade de informação que a mensagem carrega.',
      },
      {
        kind: 'code',
        language: 'java',
        caption: 'Uma exceção do próprio domínio:',
        lines: [
          'public class ItemIndisponivelException extends RuntimeException {',
          '    public ItemIndisponivelException(String isbn, StatusDoLivro status) {',
          '        super("Item " + isbn + " nao pode ser emprestado. Situacao atual: " + status);',
          '    }',
          '}',
        ],
      },
      {
        kind: 'table',
        headers: ['Mensagem', 'O que o investigador consegue fazer'],
        rows: [
          ['NullPointerException', 'Nada — precisa reproduzir para descobrir'],
          ['Erro ao emprestar', 'Sabe a operação, não o motivo'],
          [
            'Item 978-85-359-0277-5 nao pode ser emprestado. Situacao atual: EMPRESTADO',
            'Entende a causa sem abrir o sistema',
          ],
        ],
      },
      {
        kind: 'warning',
        text: 'Nunca capture uma exceção e siga adiante sem tratar. Um bloco de captura vazio faz o programa continuar em estado inconsistente, e o defeito aparece depois, num lugar sem relação com a causa.',
      },
      {
        kind: 'code',
        language: 'java',
        caption: 'Ao relançar, preserve a causa original:',
        lines: [
          'try {',
          '    repositorio.salvar(emprestimo);',
          '} catch (SQLException erro) {',
          '    throw new FalhaAoRegistrarException(',
          '        "Nao foi possivel registrar o emprestimo " + emprestimo.getId(), erro);',
          '}',
        ],
      },
      {
        kind: 'paragraph',
        text: 'Passar o erro original como segundo argumento mantém a cadeia completa no log. Sem isso, a mensagem nova substitui a antiga e a linha exata onde tudo começou se perde.',
      },
      { kind: 'heading', text: 'Testar as regras do domínio' },
      {
        kind: 'code',
        language: 'java',
        lines: [
          'class LivroTest {',
          '',
          '    @Test',
          '    void livroNovoNasceDisponivel() {',
          '        Livro livro = new Livro("978-85", "Dom Casmurro", "Machado de Assis");',
          '        assertTrue(livro.estaDisponivel());',
          '    }',
          '',
          '    @Test',
          '    void naoPermiteEmprestarDuasVezes() {',
          '        Livro livro = new Livro("978-85", "Dom Casmurro", "Machado de Assis");',
          '        livro.emprestar();',
          '',
          '        assertThrows(IllegalStateException.class, livro::emprestar);',
          '    }',
          '',
          '    @Test',
          '    void construtorRecusaTituloVazio() {',
          '        assertThrows(IllegalArgumentException.class,',
          '            () -> new Livro("978-85", "  ", "Machado de Assis"));',
          '    }',
          '}',
        ],
      },
      {
        kind: 'keyIdea',
        text: 'O segundo teste prova a regra que abriu o curso: um livro emprestado não pode ser emprestado de novo. Enquanto essa regra viver apenas na cabeça de quem escreveu, ela se perde na primeira alteração feita por outra pessoa. Como teste, ela se defende sozinha.',
      },
      {
        kind: 'tip',
        text: 'Nomeie o teste com a regra que ele prova, não com o método que ele chama. `naoPermiteEmprestarDuasVezes` diz o que o sistema garante; `testEmprestar` não diz nada.',
      },
    ],
    reflection: [
      'Reescreva uma mensagem de erro sua acrescentando o identificador e o estado atual.',
      'Por que preservar a causa original importa na investigação?',
      'Que regra do seu domínio ainda não está protegida por um teste?',
    ],
    checklist: [
      'Minhas exceções trazem identificador e situação.',
      'Não tenho bloco de captura vazio.',
      'Preservo a causa original ao relançar.',
      'Tenho testes para o caso comum, o limite e a regra violada.',
      'Meus testes têm nome da regra que provam.',
    ],
  },
};
