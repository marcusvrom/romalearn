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
- `support_sla_events`.

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

O Intelligence Center deve ser baseado em agregados confiáveis e explicar a origem de cada conclusão.

Exemplos:

- queda de conversão de um curso;
- aumento de recusa em cartão;
- aula com abandono anormal;
- aumento de chamados sobre um mesmo tema;
- oportunidade de bundle;
- curso com alta visualização e baixa compra.

A IA nunca deve alterar preços, reembolsar pedidos, publicar conteúdo ou responder ao aluno sem autorização humana explícita.

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
- tabelas acessíveis e responsivas;
- dados pessoais minimizados;
- retenção e anonimização alinhadas à LGPD;
- métricas agregadas em vez de consultas pesadas em tempo real.

## Ordem recomendada

1. validar a fundação visual e rotas;
2. implementar agregados financeiros;
3. persistir eventos de visualização e funil;
4. criar analytics de cursos e aulas;
5. implementar entidades e API de suporte;
6. adicionar chat e SLA;
7. ampliar edição editorial;
8. criar Intelligence Center somente após dados confiáveis.
