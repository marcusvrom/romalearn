# Roadmap da RomaLearn

## Visão

A RomaLearn deve evoluir como uma plataforma de desenvolvimento profissional contínuo: cursos, e-books, atividades, projetos, áudio, certificados e trilhas orientadas por objetivo.

A prioridade é ajudar o aluno a entender:

1. onde está;
2. qual é a próxima melhor ação;
3. o que será capaz de produzir;
4. quais evidências profissionais terá ao concluir;
5. qual caminho faz sentido depois.

## Princípios

- Uma próxima ação por vez.
- Resultado prático antes de volume de conteúdo.
- Evidências profissionais antes de promessas de emprego.
- Acessibilidade e linguagem simples desde a base.
- Infraestrutura econômica até que receita e volumetria justifiquem serviços gerenciados.
- Evolução orientada por analytics, conversão, retenção e conclusão.

## Fase 0 — Fundação e validação

Objetivo: colocar a primeira versão em produção com baixo custo e segurança operacional mínima.

- Validar `pnpm lint`, `pnpm build:web` e testes críticos do PR de jornada otimizada.
- Preparar deploy em VPS Contabo com Docker Compose.
- Executar Angular SSR, API NestJS, PostgreSQL, proxy reverso e worker.
- Configurar Cloudflare para DNS, proxy, SSL, cache e proteção básica.
- Usar Cloudflare R2 para e-books, áudios, imagens, certificados e anexos.
- Configurar backup diário do PostgreSQL para armazenamento externo.
- Manter retenção mínima de 30 dias e executar teste mensal de restauração.
- Configurar alertas de uptime, CPU, RAM, disco e falha de backup.
- Validar matrícula gratuita, checkout, progresso, atividades e certificados.

### Critério de saída

Produto utilizável, seguro para validação e com orçamento operacional de aproximadamente R$ 50 a R$ 150 por mês enquanto a volumetria permitir.

## Fase 1 — Jornada do aluno

Objetivo: aumentar ativação, continuidade e conclusão.

- Finalizar e validar o modo áudio.
- Validar VoiceOver, TalkBack, NVDA e navegação por teclado.
- Criar modo foco e preferências de leitura.
- Criar onboarding curto por objetivo profissional.
- Destacar a próxima melhor ação no painel.
- Criar mapa visual da trilha.
- Adicionar metas semanais opcionais.
- Criar marcos intermediários e mensagens de progresso.
- Expor aulas de amostra sem cadastro.
- Melhorar a apresentação dos e-books com capa, páginas, atualização e amostra.

### Métricas

- matrícula no módulo gratuito;
- primeira aula concluída;
- retorno em sete dias;
- conclusão de curso;
- uso e conclusão do modo áudio.

## Fase 2 — Conversão e portfólio

Objetivo: transformar aprendizagem em evidência profissional e receita sustentável.

- Melhorar página comercial e checkout.
- Resolver a oferta comercial no backend, sem depender de `offers[0]`.
- Criar projetos finais vinculados às atividades.
- Criar a área `Meus Projetos`.
- Permitir perfil profissional público opcional.
- Melhorar o feedback por rubrica.
- Criar recomendações de próximo curso.
- Implantar analytics com consentimento e funil completo.

### Métricas

- visita para cadastro;
- cadastro para matrícula;
- módulo gratuito para compra;
- projeto concluído;
- certificado emitido.

## Fase 3 — Conteúdo técnico

Objetivo: expandir a plataforma para desenvolvimento de software sem perder a progressão pedagógica.

Sequência recomendada:

1. lógica de programação e algoritmos;
2. Git e GitHub para iniciantes;
3. HTML e CSS;
4. JavaScript;
5. TypeScript;
6. especializações em frontend, Java, Python, backend, dados e IA;
7. APIs, bancos de dados, testes e Docker;
8. projeto integrador.

Cada curso técnico deve ter:

- pré-requisitos explícitos;
- desafios curtos;
- projeto final publicável;
- rubrica objetiva;
- orientação de Git e portfólio;
- ligação clara com o próximo curso;
- conteúdo de áudio editorial próprio para explicar código.

## Fase 4 — Inteligência artificial educacional

Objetivo: adicionar apoio personalizado sem criar dependência ou custo descontrolado.

- Assistente limitado ao conteúdo dos cursos.
- Resumos, flashcards e exercícios personalizados.
- Revisão espaçada baseada no histórico.
- Simulador de entrevista.
- Limites de uso por plano.
- Métricas de qualidade e custo por aluno.
- Proteções contra respostas fora de contexto e exposição de dados.

## Fase 5 — Escala operacional

Objetivo: migrar para serviços gerenciados somente quando a operação justificar.

- Separar PostgreSQL da VPS.
- Introduzir Redis apenas mediante gargalo comprovado.
- Separar workers e aplicação.
- Implementar alta disponibilidade e banco gerenciado.
- Processar áudio, certificados e e-mails de forma assíncrona.
- Avaliar migração parcial ou completa para AWS ou outro provedor gerenciado.

## Infraestrutura inicial econômica

```text
Cloudflare
├── DNS, proxy, SSL e cache
└── R2 para arquivos permanentes

VPS Contabo
├── Caddy ou Nginx
├── Angular SSR
├── API NestJS
├── PostgreSQL
└── Worker
```

### Configuração inicial

- 4 vCPU compartilhadas;
- 8 GB de RAM;
- Ubuntu LTS;
- Docker Compose;
- swap de 2 a 4 GB apenas como proteção contra picos;
- arquivos permanentes fora da VPS.

### Distribuição de memória sugerida

- PostgreSQL: até 2 GB;
- API NestJS: até 1 GB;
- Angular SSR: até 1 GB;
- worker: 512 MB;
- sistema, proxy, cache e margem: restante.

### Gatilhos para separar o banco

- RAM acima de 75% de forma recorrente;
- CPU acima de 70% durante períodos prolongados;
- I/O do banco causando lentidão perceptível;
- backups ou manutenção exigindo indisponibilidade relevante;
- indisponibilidade começando a gerar prejuízo;
- necessidade de alta disponibilidade ou recuperação point-in-time.

## Priorização

Cada item deve ser avaliado por:

1. impacto na aprendizagem, ativação ou receita;
2. redução de risco operacional, de pagamento ou de dados;
3. evidência por analytics ou feedback de alunos;
4. esforço e custo recorrente;
5. dependências técnicas e pedagógicas.

O backlog operacional e de produto é mantido no Notion e deve ser revisado a cada ciclo de entrega.