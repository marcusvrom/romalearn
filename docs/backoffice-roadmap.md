# Backoffice RomaLearn

## Objetivo

Transformar o painel administrativo em um centro operacional completo para conteúdo, vendas, finanças, alunos, atendimento, analytics e governança.

A implementação deve evoluir em etapas e nunca exibir métricas inventadas. Quando o backend ainda não fornece um dado, a interface deve apresentar um estado vazio e o contrato necessário para habilitá-lo.

## Fase 1 — Fundação implementada

- navegação agrupada por domínio;
- identidade visual de backoffice;
- visão financeira com receita, pedidos pendentes e falhas de webhook;
- base de analytics de conteúdo;
- base da central de atendimento;
- gráficos acessíveis de negócio e suporte;
- Intelligence Center determinístico inicial;
- reutilização dos dados e permissões existentes;
- documentação dos próximos contratos de API.

## Fase 2 — Financeiro completo

### Indicadores

- receita bruta e líquida;
- ticket médio;
- aprovação, recusa, reembolso e chargeback;
- receita por produto, oferta, cupom e campanha;
- Pix, cartão e outros métodos;
- à vista e parcelado por quantidade de parcelas;
- custos estimados do gateway;
- valores a receber e datas de liquidação.

### Endpoints sugeridos

- `GET /admin/finance/summary`
- `GET /admin/finance/payment-methods`
- `GET /admin/finance/installments`
- `GET /admin/finance/products`
- `GET /admin/finance/timeline`

Filtros comuns: período, produto, oferta, método de pagamento, status e campanha.

## Fase 3 — Analytics de produto e aprendizagem

### Funil comercial

1. visualização da landing;
2. visualização do curso;
3. início do cadastro;
4. matrícula ou início do checkout;
5. pagamento aprovado;
6. primeira aula iniciada;
7. curso concluído.

### Métricas de conteúdo

- cursos mais e menos vistos;
- cursos mais e menos comprados;
- conversão por curso;
- conclusão e abandono;
- progressão por aula;
- ponto de saída;
- uso do modo áudio;
- velocidade de áudio preferida;
- questionários e atividades com maior dificuldade.

### Eventos mínimos

Os eventos devem ser agregáveis por aluno anônimo, sessão, curso, aula, campanha e dispositivo, respeitando consentimento e minimização de dados.

## Fase 4 — Central de atendimento

### Entidades

- `support_conversations`;
- `support_messages`;
- `support_participants`;
- `support_assignments`;
- `support_tags`;
- `support_notes`;
- `support_attachments`;
- `support_sla_events`;
- `support_satisfaction_surveys`.

### Recursos

- chat interno;
- e-mail integrado;
- anexos;
- notas privadas;
- responsáveis e filas;
- status e SLA;
- macros de resposta;
- histórico completo do aluno;
- vinculação com pedidos, cursos, acessos e certificados;
- pesquisa e filtros;
- CSAT pós-atendimento;
- auditoria.

WebSocket ou SSE pode ser adicionado quando houver necessidade de atualização em tempo real. A primeira versão pode usar atualização periódica para reduzir complexidade.

## Fase 5 — Conteúdo e operação editorial

- edição completa de cursos, trilhas, e-books e materiais;
- versionamento editorial;
- rascunho, revisão, aprovação e publicação;
- agenda de publicação;
- pré-visualização pública e autenticada;
- `narrationText` e áudio gerado;
- histórico de alterações;
- permissões por curso e professor;
- checklist de qualidade e acessibilidade.

## Fase 6 — Intelligence Center

O Intelligence Center deve transformar métricas confiáveis em recomendações acionáveis, explicando a origem de cada conclusão.

### Primeira versão implementada

- rota `/admin/insights`;
- filtros por domínio;
- severidade e prioridade;
- evidência que originou cada insight;
- ação recomendada;
- links para investigação;
- regras determinísticas sem custo de IA;
- nenhuma ação sensível executada automaticamente.

### Domínios planejados

- financeiro;
- conversão;
- conteúdo e aprendizagem;
- suporte e satisfação;
- operação e infraestrutura;
- marketing e campanhas;
- acessibilidade;
- segurança e auditoria.

### Exemplos de regras

- falha de webhook com risco de acesso não liberado;
- aumento de pagamentos pendentes;
- curso com baixa conclusão;
- curso publicado sem matrícula;
- produto com tração para bundle;
- curso com alta visualização e baixa compra;
- aumento de chamados por categoria;
- queda de CSAT;
- SLA de primeira resposta deteriorando;
- crescimento de reembolsos ou chargebacks;
- baixa adesão ao áudio ou abandono em uma aula específica.

### Evolução técnica

1. regras determinísticas versionadas;
2. metas e limites configuráveis;
3. comparação com períodos anteriores;
4. detecção estatística de anomalias;
5. feedback humano: útil, ignorado ou resolvido;
6. criação opcional de tarefa a partir do insight;
7. IA somente para resumir, agrupar e explicar;
8. trilha de auditoria da regra, dados e decisão.

A IA nunca deve alterar preços, reembolsar pedidos, publicar conteúdo, bloquear usuários ou responder ao aluno sem autorização humana explícita.

## Perfis e permissões

### Administrador

Acesso total, configurações, papéis, auditoria e integrações.

### Conteúdo

Cursos, aulas, e-books, atividades, analytics dos próprios conteúdos e publicação conforme permissão.

### Suporte

Alunos, conversas, pedidos para consulta, acessos, certificados e ações de suporte autorizadas.

### Financeiro

Pedidos, pagamentos, reembolsos, relatórios e exportações, sem edição de conteúdo.

### Marketing

Campanhas, cupons, ofertas, funis e analytics comerciais, sem acesso a dados sensíveis desnecessários.

## Requisitos não funcionais

- autorização validada no backend;
- auditoria para ações sensíveis;
- exportação assíncrona para relatórios grandes;
- datas e valores com fuso e moeda explícitos;
- filtros refletidos na URL;
- estados vazios e de erro claros;
- tabelas e gráficos acessíveis e responsivos;
- dados pessoais minimizados;
- retenção e anonimização alinhadas à LGPD;
- métricas agregadas em vez de consultas pesadas em tempo real;
- insights sempre acompanhados de evidência e regra identificável.

## Ordem recomendada

1. validar a fundação visual, gráficos e rotas;
2. implementar agregados financeiros e parcelas;
3. persistir eventos de visualização e funil;
4. criar analytics de cursos e aulas;
5. implementar entidades e API de suporte;
6. adicionar chat, SLA e satisfação;
7. ampliar edição editorial;
8. evoluir o Intelligence Center com histórico, metas e anomalias;
9. adicionar IA opcional apenas após dados confiáveis.
