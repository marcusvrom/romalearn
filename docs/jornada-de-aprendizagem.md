# Jornada de aprendizagem da RomaLearn

## Objetivo

A RomaLearn deve crescer como uma plataforma de jornadas profissionais, não como uma lista plana de cursos. Cada aluno precisa entender rapidamente:

1. onde está;
2. qual é a próxima melhor ação;
3. o que será capaz de produzir;
4. quais evidências profissionais terá ao concluir;
5. qual caminho faz sentido depois.

## Áreas de aprendizagem

A taxonomia inicial está em `apps/web/src/app/core/learning-paths.config.ts` e separa o catálogo em seis áreas:

- Carreira e competências digitais;
- Produtividade e administração;
- Fundamentos de programação;
- Desenvolvimento web;
- Backend e engenharia de software;
- Dados e inteligência artificial.

Cursos como lógica de programação, HTML, CSS, JavaScript, Java e Python devem entrar nessas áreas sem quebrar a experiência atual.

## Princípios de UX

### Uma próxima ação por vez

O painel prioriza a última jornada em andamento e apresenta um CTA principal. Outros cursos continuam acessíveis, mas não competem visualmente com a retomada.

### Resultado antes do conteúdo

Toda página comercial deve destacar o que o aluno conseguirá criar: documento, planilha, site, API, automação ou projeto de portfólio.

### Evidência antes de promessa

A plataforma não promete emprego. Ela ajuda o aluno a construir evidências verificáveis: projetos, atividades avaliadas, certificados e histórico de evolução.

### Catálogo orientado por objetivo

O aluno deve poder navegar por metas como “primeiro emprego”, “rotina administrativa”, “começar a programar” ou “trabalhar com backend”, e não depender apenas do nome de tecnologias.

## Eventos de produto

`ProductAnalyticsService` define eventos sem dados pessoais e desacopla a aplicação de um fornecedor específico. O navegador emite `romalearn:product-event`, que poderá ser conectado a uma solução de analytics após definição de consentimento e política de privacidade.

Eventos prioritários:

- visualização de curso;
- início de matrícula gratuita;
- início de checkout;
- retomada de curso;
- início e conclusão de aula;
- envio de atividade;
- envio de questionário;
- conclusão de curso;
- abertura e download de e-book.

## Próximas etapas técnicas

1. Persistir no perfil o objetivo profissional e a área preferida.
2. Criar onboarding curto após o cadastro.
3. Expor aulas de amostra sem exigir conta.
4. Adicionar capa, páginas de amostra e metadados aos e-books.
5. Criar uma entidade de projeto/portfólio vinculada às atividades finais.
6. Resolver a melhor oferta no backend em vez de usar a primeira oferta do array.
7. Adicionar metas semanais opcionais e lembretes configuráveis.
8. Criar testes de componentes para dashboard, curso, checkout e player.

## Critérios para novos cursos de programação

Cada curso técnico deve conter:

- pré-requisitos explícitos;
- diagnóstico inicial opcional;
- ambiente de prática guiado;
- pequenos desafios ao longo do curso;
- projeto final publicável;
- rubrica objetiva;
- instruções de Git e GitHub quando aplicável;
- orientação sobre portfólio;
- acessibilidade e linguagem adequada ao nível;
- ligação clara com o próximo curso da jornada.

### Sequência sugerida

1. Lógica de programação e algoritmos;
2. Git e GitHub para iniciantes;
3. HTML e CSS;
4. JavaScript;
5. TypeScript;
6. escolha de especialização: frontend, Java, Python ou dados;
7. APIs, bancos de dados, testes e Docker;
8. projeto integrador.
