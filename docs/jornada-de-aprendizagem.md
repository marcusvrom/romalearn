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

## Modo áudio das aulas

A primeira versão usa a Web Speech API e as vozes disponíveis no aparelho do aluno. O recurso funciona como uma alternativa de consumo do conteúdo, sem substituir leitores de tela do sistema operacional e sem alterar sozinho a conclusão da aula.

Recursos implementados:

- reprodução e pausa;
- navegação entre trechos narráveis;
- velocidade entre 0,75x e 2x;
- velocidade inicial de 1,75x para novos usuários;
- preservação da preferência já salva para usuários existentes;
- perfis Calmo, Natural, Focado e Revisão;
- perfil Focado em 1,75x destacado como recomendado;
- seleção automática da melhor voz em português brasileiro disponível;
- seleção manual de voz;
- pausas editoriais entre título, parágrafos curtos e avisos;
- normalização de siglas e termos técnicos comuns;
- posição salva por aula;
- preferências persistidas no aparelho;
- compatibilidade com SSR;
- controles acessíveis por teclado e áreas de status;
- foco visível e respeito a `prefers-reduced-motion` no player;
- remoção de scripts, iframes, elementos ocultos e código em bloco da narração;
- preservação de termos técnicos escritos como código dentro de frases;
- transformação de tabelas em linhas narráveis com seus cabeçalhos;
- legenda narrável antes de todo exemplo de código;
- divisão de parágrafos longos em trechos retomáveis;
- analytics de início, perfil, velocidade e conclusão, sem dados pessoais.

### Decisão sobre velocidade padrão

O perfil inicial é **Focado, em 1,75x**. Durante testes manuais, esse ritmo apresentou uma fala mais contínua e confortável nas vozes disponíveis no aparelho, reduzindo a percepção de pausas artificiais.

A decisão não remove a autonomia do aluno:

- a velocidade pode ser alterada antes ou durante a reprodução;
- qualquer escolha fica salva localmente;
- preferências existentes não são sobrescritas;
- o analytics deve confirmar se 1,75x também apresenta boa retenção para outros alunos.

Evoluções planejadas:

1. campo editorial `narrationText` para adaptar aulas técnicas;
2. sincronização da posição e preferências entre aparelhos;
3. continuidade automática entre aulas;
4. áudio pré-gerado com Amazon Polly e armazenado no S3 ou R2;
5. reprodução em segundo plano e fila de aulas;
6. resumos em áudio por módulo;
7. destaque sincronizado do trecho narrado;
8. dicionário editorial de pronúncia administrável;
9. testes com usuários para comparar compreensão e abandono por perfil.

### Validação necessária antes do merge

- executar `pnpm lint` e `pnpm build:web`;
- testar Chrome, Edge, Safari/iOS e Android;
- confirmar carregamento e ordenação das vozes em cada sistema;
- validar teclado, VoiceOver, TalkBack e NVDA;
- testar pausa, troca de perfil e retomada após recarregar a página;
- verificar se preferências anteriores continuam preservadas;
- verificar contraste do player nos temas claro e escuro;
- comparar 1,5x, 1,75x e 2x com alunos iniciantes.

## Eventos de produto

`ProductAnalyticsService` define eventos sem dados pessoais e desacopla a aplicação de um fornecedor específico. O navegador emite `romalearn:product-event`, que poderá ser conectado a uma solução de analytics após definição de consentimento e política de privacidade.

Eventos prioritários:

- visualização de curso;
- início de matrícula gratuita;
- início de checkout;
- retomada de curso;
- início e conclusão de aula;
- início do modo áudio;
- mudança de perfil ou velocidade da narração;
- conclusão da narração;
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
9. Criar preferências globais de acessibilidade: fonte, contraste e redução de movimento.

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
- conteúdo narrável adaptado, sem leitura mecânica de código;
- acessibilidade e linguagem adequada ao nível;
- ligação clara com o próximo curso da jornada.

### Sequência sugerida

1. Git e GitHub para iniciantes — porta gratuita e caderno de bordo;
2. Lógica de programação e algoritmos — fundação para resolver problemas;
3. HTML e CSS — estrutura, acessibilidade e apresentação;
4. JavaScript — comportamento, estado e dados;
5. escolha de especialização: Python ou Java;
6. continuidade futura em TypeScript, frontend, APIs ou dados;
7. bancos de dados, testes e Docker;
8. projeto integrador.

A ordem pedagógica e a estratégia comercial são coerentes: Git é gratuito e
vem primeiro porque prepara o repositório usado no restante da jornada; Lógica
é a fundação conceitual paga. Python e Java formam rotas alternativas na mesma
etapa, portanto a carga da trilha é exibida como faixa, não como a soma das duas.
