interface ReadingInput {
  courseSlug: string;
  courseTitle: string;
  lessonTitle: string;
  summary?: string;
  topics?: string[];
}

interface LessonExample {
  problem: string;
  explanation: string;
  example: string;
  guidedPractice: string[];
  reflection: string[];
  commonMistakes: string[];
}

const EXAMPLES: Record<string, LessonExample> = {
  'O que é um algoritmo': {
    problem: 'Uma pequena loja precisa separar pedidos aprovados, pendentes e cancelados antes de iniciar as entregas.',
    explanation:
      'Algoritmo é uma sequência finita e verificável de instruções. Ele recebe dados de entrada, aplica regras e produz uma saída. A linguagem pode mudar, mas essa estrutura permanece.',
    example: `**Entrada:** status do pagamento e endereço do cliente.\n\n**Processamento:**\n\n1. verificar se o status é aprovado;\n2. validar se o endereço está completo;\n3. encaminhar o pedido para separação ou para revisão.\n\n**Saída:** pedido liberado, pendente ou bloqueado.\n\nEm pseudocódigo:\n\n\`\`\`text\nreceber statusPagamento\nreceber enderecoCompleto\n\nse statusPagamento = "aprovado" e enderecoCompleto = verdadeiro então\n  exibir "liberar para separação"\nsenão\n  exibir "encaminhar para revisão"\nfim-se\n\`\`\``,
    guidedPractice: [
      'Liste as entradas necessárias para decidir se um aluno pode receber certificado.',
      'Escreva as regras em linguagem natural antes de criar o pseudocódigo.',
      'Teste um cenário aprovado, um pendente e um inválido.',
    ],
    reflection: ['Qual passo evita uma decisão ambígua?', 'Como você comprovaria que o algoritmo terminou corretamente?'],
    commonMistakes: ['Confundir algoritmo com linguagem de programação.', 'Escrever passos vagos como “resolver o problema”.', 'Não definir entrada nem resultado esperado.'],
  },
  'Decomposição e reconhecimento de padrões': {
    problem: 'Um sistema de matrícula parece complexo porque envolve cadastro, pagamento, acesso, progresso e certificado.',
    explanation:
      'Decompor é dividir um problema grande em partes menores com responsabilidades claras. Reconhecer padrões permite reaproveitar soluções semelhantes e abstrair detalhes que não influenciam a decisão atual.',
    example: `Podemos decompor a matrícula em cinco etapas:\n\n1. identificar o aluno;\n2. validar a oferta;\n3. registrar o pagamento;\n4. conceder acesso;\n5. acompanhar o progresso.\n\nA validação de oferta e a validação de cupom compartilham um padrão: ambas recebem dados, verificam regras de validade e devolvem um resultado com motivo.`,
    guidedPractice: ['Decomponha o processo de solicitar reembolso.', 'Marque quais etapas podem ser reutilizadas em outra funcionalidade.', 'Escolha uma etapa e detalhe suas entradas e saídas.'],
    reflection: ['Qual parte merece existir como função independente?', 'Que detalhe pode ser ignorado no primeiro momento sem perder a regra principal?'],
    commonMistakes: ['Criar partes pequenas demais sem significado.', 'Separar por tela em vez de responsabilidade.', 'Tentar resolver todas as exceções antes do fluxo principal.'],
  },
  'Variáveis, constantes e tipos de dados': {
    problem: 'Uma plataforma precisa guardar nome do aluno, preço do curso, quantidade de parcelas e situação do pagamento.',
    explanation:
      'Variáveis representam valores que podem mudar. Constantes representam decisões que não devem variar durante aquela execução. Tipos definem quais operações fazem sentido e ajudam a evitar combinações inválidas.',
    example: `\`nomeAluno\` é texto, \`precoEmCentavos\` é inteiro, \`parcelas\` é inteiro e \`pagamentoAprovado\` é lógico.\n\nGuardar dinheiro como centavos evita erros de ponto flutuante:\n\n\`\`\`text\nprecoEmCentavos = 5900\nparcelas = 2\nvalorBaseDaParcela = precoEmCentavos / parcelas\n\`\`\`\n\nAntes de converter uma entrada, valide se ela realmente contém um número.`,
    guidedPractice: ['Modele os dados de uma tarefa: título, prioridade, concluída e prazo.', 'Escolha o tipo de cada valor e justifique.', 'Teste uma entrada vazia e uma prioridade fora do intervalo.'],
    reflection: ['O valor pode mudar?', 'Que operações serão feitas com ele?', 'O que acontece se a entrada vier como texto?'],
    commonMistakes: ['Usar texto para qualquer informação.', 'Guardar dinheiro em número decimal sem estratégia.', 'Converter entrada sem validar.'],
  },
  'Operadores e expressões': {
    problem: 'Precisamos calcular desconto e decidir se uma compra pode ser parcelada.',
    explanation:
      'Operadores aritméticos calculam valores; relacionais comparam; lógicos combinam condições. Uma expressão deve ser legível e refletir diretamente a regra de negócio.',
    example: `\`valorFinal = valorOriginal - desconto\` é uma expressão aritmética.\n\n\`valorFinal >= 5000\` é uma comparação.\n\n\`pagamentoAtivo e parcelas <= limite\` combina duas condições.\n\nUse parênteses para tornar a intenção explícita:\n\n\`podeParcelar = pagamentoAtivo e (valorFinal >= 5000) e (parcelas <= 6)\`.`,
    guidedPractice: ['Calcule a média de três notas.', 'Crie uma expressão que valide idade mínima e aceite dos termos.', 'Monte uma tabela verdade com quatro combinações.'],
    reflection: ['A expressão pode ser lida como uma frase?', 'Há precedência de operadores que pode confundir?'],
    commonMistakes: ['Confundir atribuição com comparação.', 'Criar expressão longa sem nomes intermediários.', 'Ignorar divisão por zero.'],
  },
  'Condições e caminhos alternativos': {
    problem: 'O checkout precisa responder de forma diferente para pagamento aprovado, pendente, recusado ou expirado.',
    explanation:
      'Condições selecionam caminhos de execução. A ordem das verificações importa: casos específicos normalmente devem ser tratados antes de uma alternativa genérica.',
    example: `\`\`\`text\nse status = "aprovado" então\n  conceder acesso\nsenão se status = "pendente" então\n  mostrar instruções de pagamento\nsenão se status = "recusado" então\n  explicar a recusa sem expor dados sensíveis\nsenão\n  registrar status não reconhecido\nfim-se\n\`\`\`\n\nO caminho final protege o sistema contra valores inesperados.`,
    guidedPractice: ['Crie regras para classificar uma nota.', 'Inclua limites exatos, como 69, 70 e 100.', 'Adicione tratamento para nota negativa ou acima de 100.'],
    reflection: ['Existe um caminho sem resposta?', 'Condições se sobrepõem?', 'A ordem altera o resultado?'],
    commonMistakes: ['Não tratar valores de fronteira.', 'Repetir a mesma condição em vários lugares.', 'Usar “senão” para esconder entrada inválida.'],
  },
  'Repetições e contadores': {
    problem: 'Somar despesas de um mês e identificar a categoria com maior gasto.',
    explanation:
      'Repetições percorrem conjuntos ou repetem uma operação enquanto uma condição for verdadeira. Contadores registram quantidades; acumuladores guardam resultados progressivos.',
    example: `\`\`\`text\ntotal = 0\npara cada despesa em despesas faça\n  total = total + despesa.valor\nfim-para\nexibir total\n\`\`\`\n\nAntes do loop, o acumulador começa em zero. A cada item, ele recebe o valor anterior mais o valor atual.`,
    guidedPractice: ['Some cinco despesas.', 'Conte quantas são maiores que R$ 100.', 'Teste lista vazia e valor negativo.'],
    reflection: ['Qual é o critério de parada?', 'O acumulador foi inicializado corretamente?', 'O loop modifica a coleção que percorre?'],
    commonMistakes: ['Criar loop sem condição de parada.', 'Reiniciar o acumulador dentro do loop.', 'Usar repetição quando uma operação de coleção seria mais clara.'],
  },
  'Funções e responsabilidades': {
    problem: 'O cálculo de desconto aparece no checkout, na simulação e no relatório financeiro.',
    explanation:
      'Funções agrupam uma responsabilidade e permitem reutilização. Uma boa função recebe apenas o necessário, devolve um resultado previsível e evita alterar dados externos sem deixar isso claro.',
    example: `\`\`\`text\nfunção calcularDesconto(valor, percentual)\n  se percentual < 0 ou percentual > 100 então\n    retornar erro\n  fim-se\n  retornar valor * percentual / 100\nfim-função\n\`\`\`\n\nA validação pertence à função porque protege sua própria regra.`,
    guidedPractice: ['Crie uma função para validar prioridade.', 'Crie outra para formatar o resumo da tarefa.', 'Teste parâmetros comuns, limites e inválidos.'],
    reflection: ['O nome explica a responsabilidade?', 'A função faz mais de uma coisa?', 'O retorno é fácil de testar?'],
    commonMistakes: ['Criar função enorme.', 'Depender de variáveis globais.', 'Misturar cálculo, entrada e exibição.'],
  },
  'Erros, testes e depuração': {
    problem: 'Um total financeiro funciona em alguns casos, mas quebra quando a lista está vazia.',
    explanation:
      'Testar é comparar resultado esperado e observado. Depurar é investigar por que eles diferem. O objetivo não é adivinhar, mas reduzir o problema com evidências.',
    example: `Use uma tabela de teste:\n\n| Cenário | Entrada | Esperado |\n|---|---|---|\n| comum | [10, 20] | 30 |\n| vazio | [] | 0 |\n| inválido | [10, "x"] | erro claro |\n\nAo encontrar falha, registre valores intermediários e descubra em qual passo o comportamento se desvia.`,
    guidedPractice: ['Crie três casos para o organizador de tarefas.', 'Provoque um erro de propósito.', 'Explique a causa e a correção em linguagem simples.'],
    reflection: ['O teste demonstra uma regra?', 'A mensagem de erro ajuda a corrigir?', 'A correção pode quebrar outro cenário?'],
    commonMistakes: ['Testar apenas o caminho feliz.', 'Alterar várias coisas ao mesmo tempo.', 'Esconder erro sem entender a causa.'],
  },
  'Por que versionar código': {
    problem: 'Uma equipe mantém arquivos chamados projeto-final, projeto-final-2 e projeto-final-agora-vai.',
    explanation:
      'Controle de versão registra mudanças com autoria, data e contexto. Git permite comparar, reverter e integrar trabalho sem depender de cópias manuais.',
    example: `Um commit pode registrar: “adiciona validação de e-mail no cadastro”. Ele informa o propósito da mudança e cria um ponto recuperável.\n\nGit não substitui backup remoto, mas oferece histórico estruturado. GitHub hospeda o repositório e adiciona colaboração, revisão e automações.`,
    guidedPractice: ['Liste três problemas de controlar versões por nomes de arquivo.', 'Identifique uma mudança que deveria ser um commit separado.', 'Explique Git e GitHub com suas palavras.'],
    reflection: ['O histórico conta uma história compreensível?', 'Seria possível reverter apenas uma mudança?'],
    commonMistakes: ['Confundir Git com GitHub.', 'Usar commit como backup aleatório.', 'Versionar arquivos gerados e segredos.'],
  },
  'Instalação e configuração inicial': {
    problem: 'Commits aparecem sem nome correto ou o terminal não encontra o comando Git.',
    explanation:
      'A configuração inicial associa identidade aos commits e confirma que terminal, Git e editor estão prontos. Ela deve ser verificada antes de começar o projeto.',
    example: `\`\`\`bash\ngit --version\ngit config --global user.name "Seu Nome"\ngit config --global user.email "email@example.com"\ngit config --global --list\n\`\`\`\n\nUse um e-mail autorizado no GitHub. Não coloque token ou senha no comando nem no repositório.`,
    guidedPractice: ['Verifique a versão instalada.', 'Configure nome e e-mail.', 'Crie uma pasta de laboratório e abra-a pelo terminal.'],
    reflection: ['Qual configuração é global e qual pertence ao projeto?', 'O e-mail do commit será reconhecido pelo GitHub?'],
    commonMistakes: ['Executar comandos sem conferir a pasta atual.', 'Configurar credenciais como texto.', 'Usar conta compartilhada.'],
  },
  'Add, commit e status': {
    problem: 'Uma alteração existe no computador, mas não aparece no histórico.',
    explanation:
      'Git trabalha com área de trabalho, stage e repositório. `status` mostra o estado; `add` seleciona mudanças; `commit` registra o conjunto selecionado.',
    example: `\`\`\`bash\ngit status\ngit add README.md\ngit diff --staged\ngit commit -m "documenta como executar o projeto"\n\`\`\`\n\nRevisar o stage antes do commit evita incluir arquivos acidentais.`,
    guidedPractice: ['Crie README e faça o primeiro commit.', 'Altere dois arquivos, mas envie apenas um ao stage.', 'Compare `git diff` e `git diff --staged`.'],
    reflection: ['O commit possui uma única intenção?', 'A mensagem explica o porquê?'],
    commonMistakes: ['Usar `git add .` sem revisar.', 'Fazer commits gigantes.', 'Versionar `.env`.'],
  },
  'Repositório remoto e push': {
    problem: 'O projeto existe localmente, mas não está disponível para colaboração ou portfólio.',
    explanation:
      'Um remoto é uma referência para outro repositório. `push` envia commits; `pull` integra alterações remotas. A sincronização deve preservar histórico e evitar sobrescrever trabalho.',
    example: `\`\`\`bash\ngit remote add origin URL_DO_REPOSITORIO\ngit branch -M main\ngit push -u origin main\n\`\`\`\n\nDepois do `-u`, Git conhece a relação entre a branch local e a remota.`,
    guidedPractice: ['Crie um repositório vazio no GitHub.', 'Conecte-o ao laboratório local.', 'Faça uma pequena alteração e envie novamente.'],
    reflection: ['O repositório deve ser público ou privado?', 'Há dados sensíveis no histórico?'],
    commonMistakes: ['Criar README remoto e local sem entender o histórico.', 'Enviar segredo e apenas apagar depois.', 'Forçar push sem avaliar impacto.'],
  },
  'Branches e merge': {
    problem: 'Uma mudança experimental não pode interromper a versão principal do projeto.',
    explanation:
      'Branches criam linhas de trabalho independentes. Merge combina históricos. Conflitos acontecem quando Git não consegue decidir sozinho qual alteração deve prevalecer.',
    example: `\`\`\`bash\ngit switch -c feature/filtro-cursos\n# faça e registre as mudanças\ngit switch main\ngit merge feature/filtro-cursos\n\`\`\`\n\nAntes do merge, teste a branch e mantenha-a atualizada.`,
    guidedPractice: ['Crie uma branch para melhorar o README.', 'Faça dois commits pequenos.', 'Integre a mudança e exclua a branch local.'],
    reflection: ['A branch tem objetivo claro?', 'O conflito representa duas intenções diferentes?'],
    commonMistakes: ['Trabalhar tudo direto na main.', 'Resolver conflito removendo conteúdo sem entender.', 'Manter branches abandonadas.'],
  },
  'Pull requests e revisão': {
    problem: 'O revisor vê arquivos alterados, mas não entende o motivo nem como validar.',
    explanation:
      'Pull request organiza comunicação, evidências e decisão antes da integração. Uma boa descrição reduz retrabalho e permite revisão técnica e de produto.',
    example: `Uma descrição útil contém:\n\n- problema observado;\n- solução adotada;\n- o que ficou fora do escopo;\n- como testar;\n- riscos e imagens, quando aplicável.`,
    guidedPractice: ['Abra PR para a branch anterior.', 'Inclua passos de teste.', 'Revise seu próprio diff antes de solicitar revisão.'],
    reflection: ['Outra pessoa conseguiria validar sem falar com você?', 'Há mudança sem relação com o objetivo?'],
    commonMistakes: ['Título genérico como “ajustes”.', 'PR enorme.', 'Pedir revisão sem testar.'],
  },
  'README que explica o projeto': {
    problem: 'Um recrutador abre o repositório e não sabe o que ele resolve nem como executá-lo.',
    explanation:
      'README é a porta de entrada do projeto. Ele transforma código em evidência compreensível ao explicar contexto, solução, tecnologias, execução e decisões.',
    example: `Estrutura sugerida:\n\n1. título e problema;\n2. demonstração ou screenshot;\n3. funcionalidades;\n4. tecnologias;\n5. como executar;\n6. decisões e aprendizados;\n7. próximos passos.`,
    guidedPractice: ['Escreva uma frase que explique valor, não tecnologia.', 'Adicione instruções reproduzíveis.', 'Peça para alguém seguir o README sem ajuda.'],
    reflection: ['O README responde “por que este projeto existe”?', 'As instruções funcionam em ambiente limpo?'],
    commonMistakes: ['Copiar template sem adaptar.', 'Listar tecnologias sem explicar uso.', 'Expor credenciais em exemplos.'],
  },
  'Issues, releases e organização': {
    problem: 'Ideias, bugs e entregas ficam espalhados em mensagens e memória.',
    explanation:
      'Issues registram trabalho com contexto e critérios. Labels facilitam classificação. Releases marcam versões entregues e comunicam mudanças relevantes.',
    example: `Uma issue de bug deve incluir comportamento esperado, observado, passos para reproduzir e ambiente. Uma release pode agrupar correções e funcionalidades em uma versão como ` + '`v1.0.0`' + `.`,
    guidedPractice: ['Crie uma issue de melhoria.', 'Adicione critérios de aceite.', 'Publique uma release com resumo das mudanças.'],
    reflection: ['A issue pode ser concluída objetivamente?', 'A versão comunica uma entrega estável?'],
    commonMistakes: ['Issue sem contexto.', 'Usar label demais.', 'Criar release sem artefato validado.'],
  },
};

const COURSE_CONTEXT: Record<string, { audience: string; outcome: string; setup: string }> = {
  'logica-de-programacao-e-algoritmos': {
    audience: 'Você está construindo a base de raciocínio que será usada em qualquer linguagem.',
    outcome: 'Ao final, cada conceito será conectado ao organizador de tarefas do projeto final.',
    setup: 'Use papel, editor de texto ou pseudocódigo. O objetivo é compreender a lógica antes da sintaxe.',
  },
  'git-e-github-na-pratica': {
    audience: 'Você está aprendendo a registrar e comunicar evolução de projetos como em uma equipe real.',
    outcome: 'Cada aula melhora o repositório profissional que será entregue ao final.',
    setup: 'Tenha Git instalado, uma conta no GitHub e uma pasta exclusiva de laboratório.',
  },
  'html-e-css-do-zero': {
    audience: 'Você construirá interfaces entendidas por pessoas, navegadores e tecnologias assistivas.',
    outcome: 'Cada capítulo acrescenta uma parte da landing page responsiva do projeto final.',
    setup: 'Use navegador com DevTools e editor de código. Salve mudanças pequenas e teste em diferentes larguras.',
  },
  'javascript-fundamentos': {
    audience: 'Você transformará uma página estática em uma aplicação com dados, estado e interação.',
    outcome: 'Os exemplos evoluem para um painel que consulta API e trata carregamento, sucesso e erro.',
    setup: 'Abra o console do navegador e execute exemplos pequenos antes de conectá-los à interface.',
  },
  'python-para-iniciantes': {
    audience: 'Você aplicará programação a automações, arquivos e relatórios do dia a dia.',
    outcome: 'Cada conceito será reutilizado no organizador de relatórios do projeto final.',
    setup: 'Use ambiente virtual e dados fictícios. Preserve sempre o arquivo original durante testes.',
  },
  'java-fundamentos-e-orientacao-a-objetos': {
    audience: 'Você aprenderá a modelar regras de negócio com tipos, objetos e responsabilidades claras.',
    outcome: 'As classes e regras serão reunidas no sistema de gestão de biblioteca.',
    setup: 'Use uma versão LTS do JDK, IDE ou editor configurado e um projeto separado para experimentos.',
  },
};

function genericExample(input: ReadingInput): LessonExample {
  const topicText = (input.topics ?? []).join(', ');
  return {
    problem: `Uma equipe precisa aplicar ${input.lessonTitle.toLowerCase()} em uma funcionalidade real sem criar uma solução difícil de manter.`,
    explanation: `${input.summary ?? input.lessonTitle} Nesta aula, você verá como os conceitos ${topicText || 'principais'} se conectam, por que existem e quando são úteis.`,
    example: `Comece com o menor cenário que demonstra o conceito. Defina a entrada, o comportamento esperado e uma forma objetiva de conferir o resultado. Em seguida, acrescente uma regra e observe o que precisa mudar.`,
    guidedPractice: [
      `Reproduza um exemplo de ${input.lessonTitle.toLowerCase()}.`,
      'Altere uma entrada e preveja o resultado antes de executar.',
      'Teste um cenário comum, um limite e uma falha esperada.',
      'Registre o aprendizado em um commit pequeno e descritivo.',
    ],
    reflection: ['Por que este conceito existe?', 'Quando ele não deveria ser usado?', 'Como você provaria que sua implementação funciona?'],
    commonMistakes: ['Copiar sem explicar.', 'Adicionar complexidade antes de validar o básico.', 'Ignorar mensagens de erro e acessibilidade.'],
  };
}

export function buildTechnologyReadingContent(input: ReadingInput): string {
  const context = COURSE_CONTEXT[input.courseSlug] ?? {
    audience: 'Você aprenderá um conceito aplicável a problemas reais.',
    outcome: 'O conhecimento será reutilizado no projeto final.',
    setup: 'Prepare um ambiente de testes separado e use dados fictícios.',
  };
  const lesson = EXAMPLES[input.lessonTitle] ?? genericExample(input);
  const topics = input.topics ?? [];

  return [
    `# ${input.lessonTitle}`,
    `## Por que esta aula importa\n\n${context.audience}\n\n${lesson.problem}`,
    `## O que você vai aprender\n\n${input.summary ?? lesson.explanation}\n\nAo final, você deverá conseguir explicar **o que é**, **como funciona**, **por que é útil** e **quais cuidados tomar**.`,
    `## Prepare seu ambiente\n\n${context.setup}`,
    topics.length
      ? `## Conceitos essenciais\n\n${topics.map((topic, index) => `${index + 1}. **${topic}** — compreenda a responsabilidade do conceito, observe um exemplo e identifique uma situação real em que ele ajuda.`).join('\n')}`
      : '',
    `## Entendendo passo a passo\n\n${lesson.explanation}\n\nNão memorize apenas comandos. Pergunte sempre: qual problema esta ferramenta resolve? Que dado entra? Qual transformação acontece? Como verificamos a saída?`,
    `## Exemplo do dia a dia\n\n${lesson.example}`,
    `## Vamos construir juntos\n\n${lesson.guidedPractice.map((step, index) => `${index + 1}. ${step}`).join('\n')}`,
    `## Pare e pense\n\n${lesson.reflection.map((question) => `- ${question}`).join('\n')}`,
    `## Erros comuns e como evitá-los\n\n${lesson.commonMistakes.map((mistake) => `- ${mistake}`).join('\n')}`,
    `## Verificação rápida\n\nAntes de avançar, confirme:\n\n- [ ] Consigo explicar o conceito sem ler o texto.\n- [ ] Reproduzi o exemplo.\n- [ ] Modifiquei o exemplo e previ o resultado.\n- [ ] Testei uma situação inválida ou limite.\n- [ ] Registrei uma dúvida ou descoberta.`,
    `## Conexão com o projeto\n\n${context.outcome} Guarde o código, as anotações e os testes desta aula: eles serão matéria-prima da atividade prática e do projeto.`,
  ].filter(Boolean).join('\n\n');
}
