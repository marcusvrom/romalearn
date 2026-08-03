import { Logger } from '@nestjs/common';
import { LessonType } from '@romalearn/contracts';
import { DataSource } from 'typeorm';
import { Course } from '../../catalog/entities/course.entity';
import { Lesson } from '../../catalog/entities/lesson.entity';
import { TECHNOLOGY_COURSES } from './technology-catalog-data';

function markdown(lines: string[]): string {
  return lines.join('\n');
}

function codeFence(language: string, lines: string[]): string {
  return ['```' + language, ...lines, '```'].join('\n');
}

function section(title: string, paragraphs: string[], code?: string): string {
  return markdown(['## ' + title, '', ...paragraphs, ...(code ? ['', code] : [])]);
}

const LABS: Record<string, string> = {
  'Como a web funciona': section('Laboratório: acompanhe uma requisição', [
    '1. Abra as ferramentas do desenvolvedor.',
    '2. Acesse uma página e selecione a aba **Network**.',
    '3. Recarregue a página.',
    '4. Localize o documento HTML e observe URL, método, status e tamanho.',
    '5. Compare uma resposta 200 com um recurso inexistente.',
    '',
    'O navegador resolve o endereço, envia uma requisição HTTP, recebe uma resposta e interpreta HTML, CSS e JavaScript. O servidor entrega recursos; o navegador combina esses recursos para formar a experiência.',
  ]),

  'Estrutura de um documento HTML': section(
    'Exemplo completo',
    [
      'Altere o idioma, o título e o conteúdo. Depois remova temporariamente a meta viewport e observe o comportamento no modo mobile.',
    ],
    codeFence('html', [
      '<!doctype html>',
      '<html lang="pt-BR">',
      '  <head>',
      '    <meta charset="utf-8">',
      '    <meta name="viewport" content="width=device-width, initial-scale=1">',
      '    <title>Portfólio de Ana</title>',
      '  </head>',
      '  <body>',
      '    <header>',
      '      <h1>Ana Souza</h1>',
      '      <p>Desenvolvedora em formação</p>',
      '    </header>',
      '    <main>',
      '      <section aria-labelledby="projetos">',
      '        <h2 id="projetos">Projetos</h2>',
      '      </section>',
      '    </main>',
      '  </body>',
      '</html>',
    ]),
  ),

  'HTML semântico e acessibilidade': section(
    'Exemplo: formulário compreensível',
    [
      'O label identifica o campo mesmo quando o valor já foi digitado. O texto de ajuda está associado ao input. Teste usando apenas Tab e Shift+Tab.',
    ],
    codeFence('html', [
      '<form>',
      '  <div>',
      '    <label for="email">E-mail</label>',
      '    <input id="email" name="email" type="email" required aria-describedby="email-ajuda">',
      '    <small id="email-ajuda">Usaremos este endereço para responder.</small>',
      '  </div>',
      '  <button type="submit">Enviar mensagem</button>',
      '</form>',
    ]),
  ),

  'Flexbox e Grid': section(
    'Escolhendo a ferramenta',
    [
      'Use Flexbox para organizar itens em um eixo, como ações de um cabeçalho. Use Grid quando linhas e colunas trabalham juntas.',
      'Adicione de um a sete cards e redimensione a tela. Observe como auto-fit e minmax reduzem a necessidade de breakpoints arbitrários.',
    ],
    codeFence('css', [
      '.cards {',
      '  display: grid;',
      '  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));',
      '  gap: 1rem;',
      '}',
    ]),
  ),

  'Variáveis, tipos e operadores': section(
    'Exemplo JavaScript: preço e desconto',
    [
      'Troque o cupom por texto, zero, número negativo e 100. Antes de calcular, crie uma função que valide o intervalo permitido.',
    ],
    codeFence('javascript', [
      'const coursePriceCents = 8900;',
      'const couponPercent = 10;',
      'const discountCents = Math.round(coursePriceCents * couponPercent / 100);',
      'const finalPriceCents = coursePriceCents - discountCents;',
      'console.log({ finalPriceCents });',
    ]),
  ),

  'Arrays e objetos': section(
    'Exemplo JavaScript: catálogo',
    [
      'Explique por que filter, map e find devolvem resultados diferentes. Depois crie um ranking sem alterar a ordem original.',
    ],
    codeFence('javascript', [
      'const courses = [',
      "  { id: 1, title: 'Git', free: true, students: 120 },",
      "  { id: 2, title: 'Lógica', free: false, students: 85 },",
      '];',
      '',
      'const freeCourses = courses.filter((course) => course.free);',
      'const titles = courses.map((course) => course.title);',
      'const logic = courses.find((course) => course.id === 2);',
    ]),
  ),

  'Promises, async e await': section(
    'Exemplo: estados assíncronos',
    [
      'O operador await pausa apenas a função assíncrona. A interface precisa continuar comunicando carregamento, sucesso, vazio e erro ao usuário.',
    ],
    codeFence('javascript', [
      'async function loadCourses() {',
      "  setView('loading');",
      '  try {',
      "    const response = await fetch('/api/courses');",
      "    if (!response.ok) throw new Error('HTTP ' + response.status);",
      '    const courses = await response.json();',
      "    setView(courses.length ? 'success' : 'empty', courses);",
      '  } catch (error) {',
      "    setView('error', error);",
      '  }',
      '}',
    ]),
  ),

  'Fetch e APIs REST': section('Leia a resposta antes de usar os dados', [
    'Uma requisição pode completar tecnicamente e ainda retornar 404 ou 500. Verifique response.ok, valide o formato recebido e trate repetição ou cancelamento quando o usuário muda a busca rapidamente.',
    'No DevTools, compare método, URL, headers, payload, status e tempo. Nunca coloque chave secreta no JavaScript enviado ao navegador.',
  ]),

  'Ambiente e primeiro programa': section(
    'Primeiro programa Python',
    ['O ambiente virtual isola dependências do projeto e facilita a reprodução por outra pessoa.'],
    markdown([
      codeFence('bash', [
        'python --version',
        'python -m venv .venv',
        '# ative o ambiente conforme seu sistema',
        'python app.py',
      ]),
      '',
      codeFence('python', [
        'def main():',
        "    print('Ambiente preparado com sucesso')",
        '',
        "if __name__ == '__main__':",
        '    main()',
      ]),
    ]),
  ),

  'Variáveis, tipos e entrada de dados': section(
    'Exemplo Python: entrada validada',
    ['Separar leitura e validação evita repetir regras em todo o programa.'],
    codeFence('python', [
      'def read_positive_amount(prompt: str) -> float:',
      '    while True:',
      "        raw = input(prompt).strip().replace(',', '.')",
      '        try:',
      '            value = float(raw)',
      '        except ValueError:',
      "            print('Digite um número válido.')",
      '            continue',
      '        if value < 0:',
      "            print('O valor não pode ser negativo.')",
      '            continue',
      '        return value',
    ]),
  ),

  'Erros e testes básicos': section(
    'Teste pequeno e erro específico',
    [
      'Não use um except genérico vazio: ele pode esconder erros inesperados. Teste o resultado correto e também a falha esperada.',
    ],
    codeFence('python', [
      'def divide(total: float, count: int) -> float:',
      '    if count <= 0:',
      "        raise ValueError('count deve ser positivo')",
      '    return total / count',
      '',
      'assert divide(10, 2) == 5',
      '',
      'try:',
      '    divide(10, 0)',
      'except ValueError as error:',
      "    assert str(error) == 'count deve ser positivo'",
    ]),
  ),

  'JDK, JVM e primeiro programa': section(
    'Como Java chega à execução',
    [
      'O JDK contém compilador e ferramentas. javac transforma código-fonte em bytecode. A JVM executa esse bytecode. Compile e execute pelo terminal ou pela IDE e compare erro de compilação com erro em execução.',
    ],
    codeFence('java', [
      'public final class App {',
      '    public static void main(String[] args) {',
      '        System.out.println("Ambiente Java pronto");',
      '    }',
      '}',
    ]),
  ),

  'Tipos, operadores e controle de fluxo': section(
    'Exemplo Java: classificação explícita',
    [
      'Teste 4.9, 5, 6.9, 7, 10 e valores inválidos. Os limites fazem parte da regra e precisam ser documentados.',
    ],
    codeFence('java', [
      'static String classify(double grade) {',
      '    if (grade < 0 || grade > 10) {',
      '        throw new IllegalArgumentException("Nota deve estar entre 0 e 10");',
      '    }',
      '    if (grade >= 7) return "APROVADO";',
      '    if (grade >= 5) return "RECUPERACAO";',
      '    return "REPROVADO";',
      '}',
    ]),
  ),

  'Métodos e organização do código': section('Método com contrato claro', [
    'Um método deve ter nome orientado à ação, parâmetros suficientes e retorno previsível. Evite um método que leia o teclado, calcule, salve e imprima. Separe readInput, calculate e displayResult para facilitar testes.',
  ]),

  'Classes, objetos e construtores': section(
    'Exemplo Java: entidade válida desde a criação',
    ['O construtor impede objetos incompletos e concentra as regras obrigatórias de criação.'],
    codeFence('java', [
      'public final class Book {',
      '    private final String isbn;',
      '    private final String title;',
      '',
      '    public Book(String isbn, String title) {',
      '        if (isbn == null || isbn.isBlank()) {',
      '            throw new IllegalArgumentException("ISBN obrigatório");',
      '        }',
      '        if (title == null || title.isBlank()) {',
      '            throw new IllegalArgumentException("Título obrigatório");',
      '        }',
      '        this.isbn = isbn;',
      '        this.title = title;',
      '    }',
      '}',
    ]),
  ),

  'Encapsulamento e validação': section('Proteja a regra, não apenas o campo', [
    'Em vez de um setter genérico para disponibilidade, exponha operações como borrow() e returnBook(). Assim o objeto controla transições válidas e não pode ficar em estado contraditório.',
  ]),

  'Herança, interfaces e composição': section(
    'Prefira contratos e composição quando possível',
    [
      'A interface permite trocar e-mail por uma implementação falsa nos testes, sem alterar a regra do serviço.',
    ],
    codeFence('java', [
      'public interface NotificationSender {',
      '    void send(String destination, String message);',
      '}',
      '',
      'public final class LoanService {',
      '    private final NotificationSender sender;',
      '',
      '    public LoanService(NotificationSender sender) {',
      '        this.sender = sender;',
      '    }',
      '}',
    ]),
  ),

  'Coleções e generics': section('Escolhendo a coleção', [
    'Use List<Book> para ordem e repetição, Set<String> para valores únicos e Map<String, Book> para busca por ISBN. Generics fazem o compilador rejeitar tipos incompatíveis antes da execução.',
  ]),

  'Exceções e testes básicos': section('Exceção de domínio e teste', [
    'Crie uma exceção específica para livro indisponível e teste tanto o caminho válido quanto a falha. A mensagem deve explicar o problema sem vazar detalhes internos. Teste a regra observável, não a implementação privada.',
  ]),
};

function genericLab(courseSlug: string, title: string, topics: string[]): string {
  const technology = courseSlug.includes('html')
    ? 'HTML e CSS'
    : courseSlug.includes('javascript')
      ? 'JavaScript'
      : courseSlug.includes('python')
        ? 'Python'
        : courseSlug.includes('java-')
          ? 'Java'
          : courseSlug.includes('git')
            ? 'Git e GitHub'
            : 'pseudocódigo';

  return section('Laboratório aplicado em ' + technology, [
    'Crie um exemplo mínimo relacionado a **' +
      title +
      '** usando ' +
      (topics.join(', ') || 'os conceitos da aula') +
      '.',
    '',
    'Antes de executar, escreva o comportamento esperado. Depois:',
    '',
    '1. execute o cenário comum;',
    '2. altere uma entrada;',
    '3. teste um limite;',
    '4. provoque uma falha controlada;',
    '5. explique por que o resultado mudou;',
    '6. registre a evolução no repositório de estudos.',
    '',
    'O objetivo não é produzir muito código, mas comprovar que você compreendeu a relação entre entrada, regra e resultado.',
  ]);
}

export class TechnologyPracticalExamplesService {
  private readonly logger = new Logger('TechnologyPracticalExamples');

  constructor(private readonly dataSource: DataSource) {}

  async run(): Promise<void> {
    const courseRepository = this.dataSource.getRepository(Course);
    const lessonRepository = this.dataSource.getRepository(Lesson);
    let enriched = 0;

    for (const courseData of TECHNOLOGY_COURSES) {
      const course = await courseRepository.findOneOrFail({ where: { slug: courseData.slug } });

      for (const sectionData of courseData.sections) {
        for (const lessonData of sectionData.lessons) {
          if (lessonData.type !== LessonType.RICH_TEXT) continue;

          const lesson = await lessonRepository.findOneOrFail({
            where: { courseId: course.id, title: lessonData.title },
          });

          const lab =
            LABS[lessonData.title] ??
            genericLab(courseData.slug, lessonData.title, lessonData.topics ?? []);
          const marker = '\n\n---\n\n## Laboratório específico da aula';
          const base = (lesson.contentMarkdown ?? '').split(marker)[0];

          await lessonRepository.update(
            { id: lesson.id },
            {
              contentMarkdown: base + marker + '\n\n' + lab.replace(/^## /, ''),
            },
          );
          enriched += 1;
        }
      }
    }

    this.logger.log(enriched + ' leituras receberam laboratórios específicos.');
  }
}
