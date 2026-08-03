# Modelo didático dos cursos de tecnologia

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

A entrega deve comprovar que o aluno consegue explicar suas decisões, executar a solução e testar caminhos comuns, limites e inválidos.

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

| Curso | Carga |
|---|---:|
| Git e GitHub na Prática | 18 h |
| Lógica de Programação e Algoritmos | 28 h |
| HTML e CSS do Zero | 32 h |
| JavaScript — Fundamentos | 36 h |
| Python para Iniciantes | 36 h |
| Java — Fundamentos e Orientação a Objetos | 44 h |

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
- testar navegação em celular;
- revisar tecnicamente todos os exemplos;
- conduzir testes com alunos iniciantes.
