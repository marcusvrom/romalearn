import { Logger } from '@nestjs/common';
import { LessonType } from '@romalearn/contracts';
import { DataSource } from 'typeorm';
import { Course } from '../../catalog/entities/course.entity';
import { Lesson } from '../../catalog/entities/lesson.entity';
import { TECHNOLOGY_COURSES } from './technology-catalog-data';

const WORKLOAD_BY_COURSE: Record<string, number> = {
  'logica-de-programacao-e-algoritmos': 28,
  'git-e-github-na-pratica': 18,
  'html-e-css-do-zero': 32,
  'javascript-fundamentos': 36,
  'python-para-iniciantes': 36,
  'java-fundamentos-e-orientacao-a-objetos': 44,
};

const LABS: Record<string, string> = {
  'Como a web funciona': `## Laboratório: acompanhe uma requisição\n\n1. Abra as ferramentas do desenvolvedor.\n2. Acesse uma página e selecione a aba **Network**.\n3. Recarregue a página.\n4. Localize o documento HTML e observe URL, método, status e tamanho.\n5. Compare uma resposta 200 com um recurso inexistente.\n\nQuando você digita uma URL, o navegador resolve o endereço, envia uma requisição HTTP, recebe uma resposta e interpreta HTML, CSS e JavaScript. O servidor não “envia uma tela pronta”: ele entrega recursos que o navegador combina.`,
  'Estrutura de um documento HTML': `## Exemplo completo\n\n\`\`\`html\n<!doctype html>\n<html lang="pt-BR">\n  <head>\n    <meta charset="utf-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1">\n    <title>Portfólio de Ana</title>\n  </head>\n  <body>\n    <header>\n      <h1>Ana Souza</h1>\n      <p>Desenvolvedora em formação</p>\n    </header>\n    <main>\n      <section aria-labelledby="projetos">\n        <h2 id="projetos">Projetos</h2>\n      </section>\n    </main>\n  </body>\n</html>\n\`\`\`\n\nAltere o idioma, o título e o conteúdo. Depois remova temporariamente a meta viewport e observe o comportamento no modo mobile.`,
  'HTML semântico e acessibilidade': `## Exemplo: formulário compreensível\n\n\`\`\`html\n<form>\n  <div>\n    <label for="email">E-mail</label>\n    <input id="email" name="email" type="email" required aria-describedby="email-ajuda">\n    <small id="email-ajuda">Usaremos este endereço para responder.</small>\n  </div>\n  <button type="submit">Enviar mensagem</button>\n</form>\n\`\`\`\n\nO label identifica o campo mesmo quando o valor já foi digitado. O texto de ajuda está associado ao input. Teste usando apenas Tab e Shift+Tab.`,
  'Seletores, cascata e especificidade': `## Experimento de cascata\n\n\`\`\`css\np { color: #333; }\n.card p { color: #2457d6; }\n#destaque { color: #b42318; }\n\`\`\`\n\nCrie um parágrafo dentro de `.card` com id `destaque`. Preveja a cor antes de abrir o navegador. Em seguida, remova o id e compare. Evite resolver conflitos aumentando especificidade sem necessidade; prefira uma arquitetura de classes previsível.`,
  'Box model, tipografia e cores': `## Exemplo: cartão previsível\n\n\`\`\`css\n* { box-sizing: border-box; }\n.card {\n  max-width: 32rem;\n  padding: 1.5rem;\n  border: 1px solid #d0d5dd;\n  border-radius: .75rem;\n}\n.card h2 { line-height: 1.2; }\n.card p { line-height: 1.6; max-width: 65ch; }\n\`\`\`\n\nUse o inspetor para visualizar conteúdo, padding, borda e margem. Aumente a fonte do navegador para 200% e verifique se nada fica cortado.`,
  'Flexbox e Grid': `## Escolhendo a ferramenta\n\nUse Flexbox para organizar itens em um eixo, como ações de um cabeçalho. Use Grid quando linhas e colunas trabalham juntas.\n\n\`\`\`css\n.cards {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(min(100%, 16rem), 1fr));\n  gap: 1rem;\n}\n\`\`\`\n\nAdicione de um a sete cards e redimensione a tela. Observe como `auto-fit` e `minmax` reduzem a necessidade de breakpoints arbitrários.`,
  'Mobile first e media queries': `## Exemplo mobile first\n\n\`\`\`css\n.hero { padding: 2rem 1rem; }\n.hero__actions { display: grid; gap: .75rem; }\n\n@media (min-width: 48rem) {\n  .hero { padding: 5rem 2rem; }\n  .hero__actions { display: flex; }\n}\n\`\`\`\n\nA regra base atende telas pequenas. A media query adiciona espaço quando existe largura disponível. Teste também zoom, orientação horizontal e textos longos.`,
  'Formulários e estados de interação': `## Estados que não podem faltar\n\n\`\`\`css\nbutton:hover { transform: translateY(-1px); }\nbutton:focus-visible { outline: 3px solid currentColor; outline-offset: 3px; }\nbutton:disabled { opacity: .55; cursor: not-allowed; }\ninput[aria-invalid="true"] { border-color: #b42318; }\n\`\`\`\n\nNão comunique erro somente por cor. Inclua mensagem textual próxima ao campo e mova o foco apenas quando isso realmente ajudar.`,
  'Performance e publicação': `## Auditoria prática\n\nAntes de publicar:\n\n- converta imagens grandes para WebP ou AVIF;\n- defina largura e altura para reduzir deslocamento de layout;\n- remova CSS não utilizado;\n- verifique links e título;\n- execute Lighthouse em modo móvel;\n- publique em uma branch dedicada e valide a URL final.\n\nCompare a página antes e depois de otimizar uma imagem e registre a diferença de bytes e tempo.`,
  'Variáveis, tipos e operadores': `## Exemplo JavaScript\n\n\`\`\`javascript\nconst coursePriceCents = 8900;\nconst couponPercent = 10;\nconst discountCents = Math.round(coursePriceCents * couponPercent / 100);\nconst finalPriceCents = coursePriceCents - discountCents;\nconsole.log({ finalPriceCents });\n\`\`\`\n\nTroque o cupom por texto, zero, número negativo e 100. Antes de calcular, crie uma função que valide o intervalo permitido.`,
  'Condições, loops e funções': `## Exemplo JavaScript: progresso\n\n\`\`\`javascript\nfunction progressLabel(completed, total) {\n  if (!Number.isInteger(total) || total <= 0) return 'Curso sem aulas';\n  const percentage = Math.round(completed / total * 100);\n  if (percentage >= 100) return 'Concluído';\n  if (percentage > 0) return percentage + '% concluído';\n  return 'Ainda não iniciado';\n}\n\nfor (const sample of [[0, 10], [5, 10], [10, 10], [0, 0]]) {\n  console.log(sample, progressLabel(...sample));\n}\n\`\`\``,
  'Arrays e objetos': `## Exemplo JavaScript: catálogo\n\n\`\`\`javascript\nconst courses = [\n  { id: 1, title: 'Git', free: true, students: 120 },\n  { id: 2, title: 'Lógica', free: false, students: 85 },\n];\n\nconst freeCourses = courses.filter(course => course.free);\nconst titles = courses.map(course => course.title);\nconst logic = courses.find(course => course.id === 2);\n\`\`\`\n\nExplique por que `filter`, `map` e `find` devolvem resultados diferentes. Depois crie um ranking sem alterar a ordem original.`,
  'DOM e seleção de elementos': `## Exemplo seguro de atualização\n\n\`\`\`javascript\nconst status = document.querySelector('[data-status]');\nif (status) {\n  status.textContent = '3 cursos encontrados';\n  status.classList.add('is-success');\n}\n\`\`\`\n\nPrefira `textContent` para texto vindo de dados. Evite montar HTML com entrada do usuário. Teste o código também quando o elemento não existir.`,
  'Eventos e formulários': `## Exemplo: envio controlado\n\n\`\`\`javascript\nconst form = document.querySelector('form');\nform?.addEventListener('submit', event => {\n  event.preventDefault();\n  const data = new FormData(form);\n  const title = String(data.get('title') ?? '').trim();\n  if (title.length < 3) {\n    showError('Informe pelo menos 3 caracteres.');\n    return;\n  }\n  addTask({ title, done: false });\n  form.reset();\n});\n\`\`\`\n\nRegistre o listener uma única vez. A função de regra não deve depender diretamente do HTML para ser testável.`,
  'Estado e armazenamento local': `## Exemplo: persistência defensiva\n\n\`\`\`javascript\nfunction loadTasks() {\n  try {\n    const raw = localStorage.getItem('tasks');\n    const parsed = raw ? JSON.parse(raw) : [];\n    return Array.isArray(parsed) ? parsed : [];\n  } catch {\n    return [];\n  }\n}\n\nfunction saveTasks(tasks) {\n  localStorage.setItem('tasks', JSON.stringify(tasks));\n}\n\`\`\`\n\nArmazenamento local não é banco seguro. Não guarde senha, token ou dado sensível.`,
  'Promises, async e await': `## Exemplo: estados assíncronos\n\n\`\`\`javascript\nasync function loadCourses() {\n  setView('loading');\n  try {\n    const response = await fetch('/api/courses');\n    if (!response.ok) throw new Error('HTTP ' + response.status);\n    const courses = await response.json();\n    setView(courses.length ? 'success' : 'empty', courses);\n  } catch (error) {\n    setView('error', error);\n  }\n}\n\`\`\`\n\n` + '`await`' + ` pausa apenas a função assíncrona. A interface precisa continuar comunicando o estado ao usuário.`,
  'Fetch e APIs REST': `## Leia a resposta antes de usar os dados\n\nUma requisição pode completar tecnicamente e ainda retornar 404 ou 500. Verifique ` + '`response.ok`' + `, valide o formato recebido e trate cancelamento ou repetição quando o usuário muda a busca rapidamente.\n\nNo DevTools, compare método, URL, headers, payload, status e tempo. Nunca coloque chave secreta no JavaScript enviado ao navegador.`,
  'Ambiente e primeiro programa': `## Primeiro programa Python\n\n\`\`\`bash\npython --version\npython -m venv .venv\n# ative o ambiente conforme seu sistema\npython app.py\n\`\`\`\n\n\`\`\`python\ndef main():\n    print('Ambiente preparado com sucesso')\n\nif __name__ == '__main__':\n    main()\n\`\`\`\n\nO ambiente virtual isola dependências do projeto e facilita reprodução.`,
  'Variáveis, tipos e entrada de dados': `## Exemplo Python: entrada validada\n\n\`\`\`python\ndef read_positive_amount(prompt: str) -> float:\n    while True:\n        raw = input(prompt).strip().replace(',', '.')\n        try:\n            value = float(raw)\n        except ValueError:\n            print('Digite um número válido.')\n            continue\n        if value < 0:\n            print('O valor não pode ser negativo.')\n            continue\n        return value\n\`\`\`\n\nSeparar leitura e validação evita repetir regras em todo o programa.`,
  'Condições e repetições': `## Exemplo Python: resumo financeiro\n\n\`\`\`python\nexpenses = [120.0, 89.9, 42.5]\nbudget = 300.0\ntotal = 0.0\nfor expense in expenses:\n    total += expense\n\nif total > budget:\n    print(f'Orçamento excedido em R$ {total - budget:.2f}')\nelif total == budget:\n    print('Orçamento totalmente utilizado')\nelse:\n    print(f'Saldo disponível: R$ {budget - total:.2f}')\n\`\`\``,
  'Listas, tuplas e dicionários': `## Modelando um registro\n\n\`\`\`python\nstudent = {\n    'id': 42,\n    'name': 'Fernando',\n    'courses': ['Git', 'Lógica'],\n    'active': True,\n}\n\nfor course in student['courses']:\n    print(course)\n\`\`\`\n\nLista representa uma coleção ordenada; tupla é útil para agrupamento imutável; dicionário associa chaves a valores. Escolha pela semântica, não por hábito.`,
  'Funções, módulos e pacotes': `## Separação de responsabilidades\n\n\`\`\`python\n# reports/calculator.py\ndef total_by_category(rows: list[dict]) -> dict[str, float]:\n    totals: dict[str, float] = {}\n    for row in rows:\n        category = row['category']\n        totals[category] = totals.get(category, 0.0) + row['amount']\n    return totals\n\`\`\`\n\nA função recebe dados já validados e devolve resultado. Leitura de arquivo e impressão ficam em outros módulos.`,
  'Erros e testes básicos': `## Teste pequeno e erro específico\n\n\`\`\`python\ndef divide(total: float, count: int) -> float:\n    if count <= 0:\n        raise ValueError('count deve ser positivo')\n    return total / count\n\nassert divide(10, 2) == 5\n\ntry:\n    divide(10, 0)\nexcept ValueError as error:\n    assert str(error) == 'count deve ser positivo'\n\`\`\`\n\nNão use ` + '`except:`' + ` vazio: ele esconde erros inesperados.`,
  'Arquivos CSV e JSON': `## Exemplo Python: leitura preservando o original\n\n\`\`\`python\nfrom csv import DictReader\nfrom pathlib import Path\n\ndef read_rows(path: Path) -> list[dict[str, str]]:\n    if not path.exists():\n        raise FileNotFoundError(path)\n    with path.open(encoding='utf-8', newline='') as file:\n        return list(DictReader(file))\n\`\`\`\n\nLeia em modo de leitura e gere a saída em outro caminho. Valide colunas antes de calcular.`,
  'Automação de tarefas': `## Exemplo: organizar relatórios sem destruir arquivos\n\nUse ` + '`pathlib`' + ` para localizar arquivos, crie uma pasta de saída e adote nomes com data. Primeiro execute em uma pasta de laboratório. Prefira copiar ou gerar novos arquivos; mover e excluir devem exigir confirmação e log.`,
  'JDK, JVM e primeiro programa': `## Como Java chega à execução\n\nO JDK contém compilador e ferramentas. ` + '`javac`' + ` transforma código-fonte em bytecode. A JVM executa esse bytecode.\n\n\`\`\`java\npublic final class App {\n    public static void main(String[] args) {\n        System.out.println("Ambiente Java pronto");\n    }\n}\`\`\`\n\nCompile e execute pelo terminal ou IDE. Explique a diferença entre erro de compilação e erro em execução.`,
  'Tipos, operadores e controle de fluxo': `## Exemplo Java: classificação explícita\n\n\`\`\`java\nstatic String classify(double grade) {\n    if (grade < 0 || grade > 10) {\n        throw new IllegalArgumentException("Nota deve estar entre 0 e 10");\n    }\n    if (grade >= 7) return "APROVADO";\n    if (grade >= 5) return "RECUPERACAO";\n    return "REPROVADO";\n}\n\`\`\`\n\nTeste 4.9, 5, 6.9, 7, 10 e valores inválidos.`,
  'Métodos e organização do código': `## Método com contrato claro\n\nUm método deve ter nome orientado à ação, parâmetros suficientes e retorno previsível. Evite um método que leia o teclado, calcule, salve e imprima. Separe ` + '`readInput`' + `, ` + '`calculate`' + ` e ` + '`displayResult`' + ` para facilitar testes.`,
  'Classes, objetos e construtores': `## Exemplo Java: entidade válida desde a criação\n\n\`\`\`java\npublic final class Book {\n    private final String isbn;\n    private final String title;\n\n    public Book(String isbn, String title) {\n        if (isbn == null || isbn.isBlank()) throw new IllegalArgumentException("ISBN obrigatório");\n        if (title == null || title.isBlank()) throw new IllegalArgumentException("Título obrigatório");\n        this.isbn = isbn;\n        this.title = title;\n    }\n}\n\`\`\`\n\nO construtor impede objetos incompletos.`,
  'Encapsulamento e validação': `## Proteja a regra, não apenas o campo\n\nEm vez de um setter genérico para disponibilidade, exponha operações como ` + '`borrow()`' + ` e ` + '`returnBook()`' + `. Assim o objeto controla transições válidas e não pode ficar em estado contraditório.`,
  'Herança, interfaces e composição': `## Prefira contratos e composição quando possível\n\n\`\`\`java\npublic interface NotificationSender {\n    void send(String destination, String message);\n}\n\npublic final class LoanService {\n    private final NotificationSender sender;\n    public LoanService(NotificationSender sender) { this.sender = sender; }\n}\n\`\`\`\n\nA interface permite trocar e-mail por uma implementação falsa nos testes.`,
  'Coleções e generics': `## Escolhendo coleção\n\nUse ` + '`List<Book>`' + ` para ordem e repetição, ` + '`Set<String>`' + ` para valores únicos e ` + '`Map<String, Book>`' + ` para busca por ISBN. Generics fazem o compilador rejeitar tipos incompatíveis antes da execução.`,
  'Exceções e testes básicos': `## Exceção de domínio e teste\n\nCrie uma exceção específica para livro indisponível e teste tanto o caminho válido quanto a falha. Uma mensagem deve explicar o problema sem vazar detalhes internos. Teste regra, não implementação privada.`,
};

function genericLab(courseSlug: string, title: string, topics: string[]): string {
  const technology = courseSlug.includes('html')
    ? 'HTML/CSS'
    : courseSlug.includes('javascript')
      ? 'JavaScript'
      : courseSlug.includes('python')
        ? 'Python'
        : courseSlug.includes('java-')
          ? 'Java'
          : courseSlug.includes('git')
            ? 'Git/GitHub'
            : 'pseudocódigo';

  return `## Laboratório aplicado em ${technology}\n\nCrie um exemplo mínimo relacionado a **${title}** usando ${topics.join(', ') || 'os conceitos da aula'}. Antes de executar, escreva o comportamento esperado. Depois:\n\n1. execute o cenário comum;\n2. altere uma entrada;\n3. teste um limite;\n4. provoque uma falha controlada;\n5. explique por que o resultado mudou;\n6. registre a evolução no repositório de estudos.\n\nO objetivo não é produzir muito código, mas comprovar que você compreendeu a relação entre entrada, regra e resultado.`;
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
      await courseRepository.update(
        { id: course.id },
        { workloadHours: WORKLOAD_BY_COURSE[courseData.slug] ?? course.workloadHours },
      );

      for (const section of courseData.sections) {
        for (const lessonData of section.lessons) {
          if (lessonData.type !== LessonType.RICH_TEXT) continue;

          const lesson = await lessonRepository.findOneOrFail({
            where: { courseId: course.id, title: lessonData.title },
          });
          const lab = LABS[lessonData.title] ?? genericLab(
            courseData.slug,
            lessonData.title,
            lessonData.topics ?? [],
          );
          const marker = '\n\n---\n\n## Laboratório específico da aula';
          const base = (lesson.contentMarkdown ?? '').split(marker)[0];
          await lessonRepository.update(
            { id: lesson.id },
            { contentMarkdown: `${base}${marker}\n\n${lab.replace(/^## /, '')}` },
          );
          enriched += 1;
        }
      }
    }

    this.logger.log(`${enriched} leituras receberam laboratórios específicos; cargas horárias revisadas.`);
  }
}
