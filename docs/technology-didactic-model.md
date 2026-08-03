# Modelo didático dos cursos de tecnologia

## Como o conteúdo é escrito

As 55 leituras dos seis cursos técnicos são **escritas uma a uma**, em
`apps/api/src/database/seeds/content/tecnologia/`, um arquivo por curso. Elas
usam o mesmo modelo de blocos dos módulos de Office (`ContentBlock`), acrescido
de blocos `code` e `output` — um curso de programação sem código legível não
ensina nada.

Houve antes um gerador que montava a leitura a partir de um molde com o título
da aula. Ele produzia texto em que **78% das linhas eram idênticas em todas as
aulas**, e o "exemplo trabalhado" de 6 em cada 8 leituras era a frase
"Considere uma funcionalidade real relacionada a X" — que não é um exemplo. O
gerador foi removido.

Hoje o seed **falha** quando encontra uma aula de leitura sem conteúdo escrito,
em vez de preencher com molde. Uma aula sem conteúdo precisa aparecer, não ser
disfarçada.

### Regras que valem para toda leitura

- **Abre com um problema concreto**, antes de qualquer termo técnico. O aluno
  precisa reconhecer a situação para querer a explicação.
- **Um único registro de linguagem.** O material fala igual com quem tem
  dezesseis e com quem tem cinquenta e cinco anos: sem gíria, sem referência
  que dependa de época ou de cultura de nicho, e sem "é fácil" — que
  envergonha quem está com dificuldade.
- **Exemplos de contextos compartilhados**: contas de casa, lista de compras,
  estoque, prazos, notas escolares. Nunca exemplos que pressuponham videogame
  ou rede social.
- **Todo exemplo é executável e foi verificado.** Os 54 blocos de Python e
  JavaScript passam pelos parsers reais das duas linguagens; um exemplo com
  erro de sintaxe ensina errado.
- **Erros comuns, reflexões e checklist são específicos da aula** — nunca uma
  lista genérica repetida.

### Momentos guiados e mapas visuais

Nenhuma aula pode pedir apenas “pense”, “explique com suas palavras” ou
“reflita” e deixar o aluno decidir sozinho qual formato de resposta seria
adequado. Todo pedido de pensamento precisa aparecer com quatro apoios:

1. **caso para analisar**, retirado da situação concreta da própria aula;
2. **exemplo já trabalhado**, como analogia, linha de uma comparação ou
   decisão explicada no conteúdo;
3. **roteiro de raciocínio** em três movimentos: observar, explicar e aplicar;
4. **modelo de início de resposta**, com lacunas que orientam sem entregar a
   conclusão.

As leituras também exibem o infográfico “Mapa visual desta aula”, organizado
em observar, entender, experimentar e conferir. Ele usa somente informações
já escritas no capítulo, evitando inventar fatos ou repetir um diagrama
genérico sem ligação com o assunto.

O infográfico é uma lista ordenada semântica: no celular aparece na vertical,
em telas maiores vira um fluxo horizontal e no modo audiolivro continua sendo
narrado na ordem correta. Setas são apenas decoração visual; nenhum significado
depende delas.

### Contrato da aula “Antes de começar”

Cada curso publicado abre com uma aula introdutória autoral de aproximadamente
18 minutos. Ela não instala ambiente, não exige código e não pede entrega. Sua
função é dar ao aluno uma chegada segura antes da primeira parte prática.

Toda introdução precisa:

- contar a origem da disciplina ou ferramenta sem inventar um único criador
  quando a história é coletiva;
- apresentar o problema histórico que motivou a solução;
- conectar a solução a aplicações reconhecíveis no cotidiano;
- distinguir ideias que costumam ser confundidas, como Git e GitHub ou Java e
  JavaScript;
- propor uma exploração pequena, reversível e guiada;
- terminar com reflexão, checklist e links para fontes primárias ou oficiais;
- funcionar como áudio-livro, com períodos curtos, tabelas narráveis e cada
  passo compreensível sem depender de uma imagem.

A primeira prática continua nas partes seguintes. A introdução serve para o
aluno reconhecer o terreno, formar uma pergunta e saber por que vale aprender.

### Storytelling da jornada

Os cursos não são episódios isolados. O aluno atravessa quatro capítulos:

1. abre no Git o caderno de bordo que registrará toda a evolução;
2. aprende lógica para transformar uma situação confusa em regras testáveis;
3. coloca uma solução na web com HTML, CSS e JavaScript;
4. escolhe Python para automação e dados ou Java para modelagem de sistemas.

Cada capítulo termina com uma evidência de portfólio. A página da trilha deve
mostrar a transformação, a evidência e se a etapa é essencial ou uma escolha.
Python e Java nunca devem aparecer como dependências sequenciais entre si.

## Princípio central

Na RomaLearn, uma aula de leitura não é um resumo do assunto nem uma lista de tópicos. Ela precisa conduzir o aluno até a compreensão.

Toda leitura técnica deve responder:

1. o que é o conceito;
2. qual problema ele resolve;
3. por que ele existe;
4. como funciona passo a passo;
5. quando usar;
6. quando não usar;
7. quais erros são comuns;
8. como verificar se a solução funciona;
9. como o conceito participa do projeto do curso.

## Estrutura das leituras

As leituras técnicas seguem esta sequência:

- situação real que cria necessidade pelo conceito;
- objetivo de aprendizagem em linguagem simples;
- preparação do ambiente;
- conceitos essenciais;
- explicação do mecanismo;
- exemplo trabalhado;
- construção guiada;
- perguntas de reflexão;
- erros frequentes;
- checklist de compreensão;
- laboratório específico da tecnologia;
- conexão com a atividade e o projeto final.

Os exemplos usam cenários como checkout, matrícula, progresso, relatórios, organização de tarefas, catálogo, formulários, APIs, arquivos e sistemas administrativos.

## Papel das atividades práticas

A atividade não deve introduzir conteúdo essencial novo. Ela exercita e evidencia a absorção das leituras anteriores.

Cada atividade contém:

- situação-problema;
- conteúdo que será exercitado;
- enunciado;
- entregáveis claros;
- cenários mínimos de teste;
- sequência sugerida de desenvolvimento;
- reflexão obrigatória;
- checklist antes do envio.

Antes do campo de entrega, o aluno vê ainda um roteiro fixo para organizar o
relato: situação, ação, teste e evidência. O placeholder repete essa estrutura,
e a atividade mostra um exemplo de início diferente da resposta solicitada.
Assim, avaliar clareza deixa de depender de o aluno adivinhar como escrever.

A entrega deve comprovar que o aluno consegue explicar suas decisões, executar a solução e testar caminhos comuns, limites e inválidos.

## Contrato do áudio-livro

O texto precisa funcionar quando a tela deixa de ser o canal principal:

- títulos, parágrafos, listas, avisos, legendas e tabelas são narráveis;
- código em bloco é mantido como recurso visual e sempre recebe uma legenda
  que situa o exemplo;
- termos curtos em código dentro de uma frase continuam na narração;
- tabelas viram linhas faladas com o nome de cada coluna;
- parágrafos longos são divididos em trechos retomáveis;
- siglas e tecnologias usam o dicionário de pronúncia em português;
- nenhum código é lido mecanicamente caractere por caractere.

O modo áudio é uma forma completa de acompanhar a explicação, mas o aluno
pausa para observar e executar exemplos visuais quando a prática exige código.

## Projetos finais

Os projetos finais integram os conceitos do curso e exigem aprovação por rubrica. Eles não são concluídos apenas pelo envio de uma mensagem.

Cada projeto deve incluir:

- solução verificável;
- repositório e README quando aplicável;
- instruções de execução;
- testes ou cenários documentados;
- decisões e limitações;
- cuidados com dados sensíveis;
- reflexão sobre próximos passos.

## Profundidade e carga horária

Cargas revisadas para homologação:

| Curso                                     | Carga |
| ----------------------------------------- | ----: |
| Git e GitHub na Prática                   |  18 h |
| Lógica de Programação e Algoritmos        |  28 h |
| HTML e CSS do Zero                        |  32 h |
| JavaScript — Fundamentos                  |  36 h |
| Python para Iniciantes                    |  36 h |
| Java — Fundamentos e Orientação a Objetos |  44 h |

Essas cargas ainda devem ser validadas com alunos reais, medindo tempo de leitura, prática e projeto.

## Persona de teste

Após executar:

```bash
pnpm seed
pnpm seed:demo
```

A conta abaixo recebe acesso à trilha administrativa e à trilha de Desenvolvimento de Software:

```text
trilha@romalearn.local
```

Nome exibido: **Fernando Trilha**.

A senha é definida por `SEED_DEMO_PASSWORD` ou usa o padrão local documentado pelo comando de seed.

## Validação antes da publicação

- executar build, lint e testes;
- executar o seed duas vezes para validar idempotência;
- abrir todas as leituras como Fernando Trilha;
- validar Markdown, blocos de código e leitor de áudio;
- entregar pelo menos uma atividade de cada curso;
- verificar rubricas e questionários;
- percorrer a aula somente pelo áudio e confirmar que exemplos e tabelas continuam contextualizados;
- testar navegação em celular;
- revisar tecnicamente todos os exemplos;
- conduzir testes com alunos iniciantes.
