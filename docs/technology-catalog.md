# Catálogo de tecnologia da RomaLearn

## Objetivo

Adicionar uma trilha inicial de desenvolvimento de software à RomaLearn sem transformar o catálogo em uma lista desconectada de linguagens.

## Sequência recomendada

1. Git e GitHub na Prática — gratuito;
2. Lógica de Programação e Algoritmos — pago;
3. HTML e CSS do Zero;
4. JavaScript — Fundamentos;
5. especialização inicial em Python ou Java.

O curso gratuito de Git/GitHub reduz a barreira de entrada e já entrega uma evidência profissional: um repositório organizado. Lógica permanece como base acadêmica da trilha, mas passa a compor a oferta paga.

## Cursos incluídos na Beta

### Git e GitHub na Prática

Porta de entrada gratuita. Trabalha versionamento, branches, pull requests, documentação e criação de um repositório profissional.

### Lógica de Programação e Algoritmos

Curso pago de fundamentos. Trabalha decomposição, variáveis, operadores, decisões, repetições, funções, testes e projeto final.

### HTML e CSS do Zero

HTML semântico, acessibilidade, CSS, Flexbox, Grid, responsividade e publicação de uma landing page.

### JavaScript — Fundamentos

Fundamentos da linguagem, arrays, objetos, DOM, eventos, armazenamento local, assincronicidade e consumo de APIs.

### Python para Iniciantes

Sintaxe, estruturas de dados, funções, tratamento de erros, arquivos e automação.

### Java — Fundamentos e Orientação a Objetos

JDK/JVM, sintaxe, métodos, classes, objetos, encapsulamento, interfaces, coleções, exceções e testes básicos.

## Estratégia comercial da Beta

- Git e GitHub é gratuito e funciona como aquisição, ativação e criação da primeira evidência profissional;
- Lógica de Programação possui oferta SANDBOX de R$ 59 para homologação;
- os demais cursos recebem ofertas SANDBOX para homologação;
- valores atuais são provisórios e não devem ser tratados como preço final;
- ofertas antigas incompatíveis são arquivadas automaticamente pelo seed;
- a publicação em produção exige revisão comercial e troca do ambiente da oferta.

## Estrutura pedagógica

Cada curso possui:

- primeira aula liberada como amostra;
- conteúdo estruturado com objetivo, explicação, exemplo, prática, erros comuns e checklist;
- práticas intermediárias;
- projeto final com rubrica pública;
- questionário de conclusão;
- carga horária e pré-requisitos explícitos;
- progressão orientada a evidências profissionais.

## Projetos finais

- Git/GitHub: repositório profissional;
- Lógica: organizador de tarefas;
- HTML/CSS: landing page publicada;
- JavaScript: painel consumindo API;
- Python: organizador de relatórios;
- Java: sistema de gestão de biblioteca.

## Consistência do seed

Depois de cadastrar o catálogo, o seed executa uma etapa de estabilização que:

- aplica a política gratuito/pago definida para cada curso;
- cria ou reativa a oferta correta;
- arquiva a oferta antiga incompatível;
- normaliza rubricas dos projetos finais conforme o contrato do corretor;
- mantém a execução idempotente durante a homologação.

## Antes da venda oficial

1. executar lint, build, testes e seed em banco vazio;
2. revisar tecnicamente todos os exemplos;
3. adicionar repositórios iniciais e soluções comentadas;
4. validar atividades e rubricas com alunos iniciantes;
5. revisar acessibilidade e narração técnica;
6. criar capas e identidade visual;
7. confirmar carga horária observada na Beta;
8. definir preços, bundles e política de parcelamento;
9. revisar direitos autorais e referências;
10. validar certificado e checkout ponta a ponta.

## Execução

```bash
pnpm seed
```

O seed é idempotente por slug e pode ser executado novamente durante a homologação.
