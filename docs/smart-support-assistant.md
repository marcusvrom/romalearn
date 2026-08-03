# Assistente inteligente de suporte

## Objetivo

Oferecer ajuda sempre visível para alunos e visitantes, resolver dúvidas recorrentes sem intervenção humana e encaminhar ao time somente solicitações que realmente precisam de análise.

## Experiência

O botão flutuante aparece no canto inferior da experiência pública, área do aluno e player. Ele não aparece no backoffice.

Fluxo:

1. aluno abre a central;
2. escolhe um tema;
3. seleciona uma dúvida frequente;
4. recebe uma resposta predefinida e, quando aplicável, um atalho para resolver sozinho;
5. informa se a resposta resolveu;
6. somente quando necessário descreve o problema para atendimento humano.

## Temas iniciais

- acesso e senha;
- pagamento e compra;
- cursos e atividades;
- certificados;
- áudio das aulas;
- problemas técnicos;
- outros assuntos.

## Princípios

- nunca esconder a possibilidade de atendimento humano;
- evitar respostas falsas ou promessas de prazo;
- não solicitar senha, cartão completo ou dados sensíveis;
- respostas devem ser editáveis pelo backoffice no futuro;
- cada escalonamento deve carregar contexto do tema e resposta já consultada;
- nenhuma IA é necessária para a primeira versão;
- respostas determinísticas reduzem custo e risco.

## Métricas necessárias

- aberturas do assistente;
- tema selecionado;
- resposta visualizada;
- resolução sem atendimento;
- solicitação humana;
- taxa de deflexão;
- CSAT da resposta automática;
- CSAT do atendimento humano;
- tempo até resolução;
- assuntos com maior escalonamento;
- respostas marcadas como não úteis.

## Contratos futuros

```http
GET /support/knowledge-base
POST /support/events
POST /support/conversations
GET /student/support/conversations
GET /admin/support/conversations
PATCH /admin/support/conversations/:id
POST /admin/support/conversations/:id/messages
```

Exemplo de criação de conversa:

```json
{
  "topic": "PAYMENT",
  "quickAnswerId": "pix-pending",
  "message": "Paguei há uma hora e o curso ainda não apareceu.",
  "context": {
    "currentPath": "/painel",
    "courseId": null,
    "orderId": null
  }
}
```

## Base de conhecimento futura

A base deverá ser administrável sem deploy e conter:

- tema;
- pergunta;
- resposta;
- palavras-chave;
- público aplicável;
- rotas de ação;
- regras de escalonamento;
- status publicado;
- versão;
- autor e aprovador;
- data da última revisão;
- métricas de utilidade e deflexão.

## Evolução de inteligência

### Etapa 1 — Regras e árvore guiada

Implementação atual, sem custo variável.

### Etapa 2 — Busca por palavras-chave

O aluno escreve uma pergunta e o sistema ranqueia respostas cadastradas localmente ou no backend.

### Etapa 3 — Busca semântica econômica

Embeddings gerados somente quando uma resposta é publicada. A consulta busca os trechos mais próximos, sem gerar uma resposta nova.

### Etapa 4 — IA generativa opcional

A IA reformula somente conteúdo aprovado da base de conhecimento, cita a fonte e não responde fora do escopo. Casos financeiros, reembolso, acesso e dados pessoais continuam seguindo regras rígidas e escalonamento humano.

## Critérios para atendimento humano

Escalonar quando:

- a resposta foi marcada como insuficiente;
- existe pagamento aprovado sem acesso;
- há solicitação de reembolso;
- dados de certificado precisam de correção;
- atividade exige análise pedagógica;
- erro técnico persiste após os passos básicos;
- o assunto não está coberto;
- o aluno pede explicitamente atendimento.

## Estado atual

A interface, temas, respostas, avaliação e formulário de escalonamento estão implementados no frontend. O envio ao backoffice depende da persistência das entidades de suporte e dos endpoints descritos acima.
