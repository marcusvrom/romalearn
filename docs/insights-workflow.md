# Workflow de insights da RomaLearn

## Objetivo

Transformar recomendações analíticas em um processo operacional rastreável, sem executar ações sensíveis automaticamente.

## Estados

- `NEW`: regra ativada e ainda não analisada;
- `IN_REVIEW`: alguém está investigando evidências e hipóteses;
- `RESOLVED`: a ação foi concluída ou a condição deixou de existir;
- `IGNORED`: recomendação conscientemente descartada, preferencialmente com justificativa.

## Feedback

Cada insight pode receber:

- `USEFUL`;
- `NOT_USEFUL`;
- nota operacional com hipótese, responsável ou próximo passo.

A primeira versão persiste essas informações no navegador para validar a experiência sem custo adicional. A versão compartilhada deverá usar persistência server-side.

## Contrato futuro

```http
GET /admin/insights?status=NEW&domain=Financeiro
PATCH /admin/insights/:id
POST /admin/insights/:id/comments
GET /admin/insights/:id/history
```

Exemplo de atualização:

```json
{
  "status": "IN_REVIEW",
  "feedback": "USEFUL",
  "note": "Verificar expiração de Pix com o gateway",
  "assigneeId": "staff-user-id",
  "dueAt": "2026-08-10T18:00:00-03:00"
}
```

## Entidades sugeridas

- `insight_occurrences`: ocorrência atual da regra e evidência;
- `insight_workflow`: situação, responsável, prazo e nota;
- `insight_feedback`: utilidade e justificativa;
- `insight_history`: mudanças de estado e auditoria;
- `insight_rule_versions`: versão, parâmetros e janela analisada.

## Regras de segurança

- nenhuma recomendação altera preço, acesso, conteúdo ou pagamento automaticamente;
- toda evidência deve indicar período, amostra e fonte;
- mudanças de situação precisam de usuário e data;
- dados pessoais devem ser minimizados;
- regras financeiras e de suporte precisam ser reproduzíveis;
- IA futura pode explicar os resultados, mas não calcular números fora dos agregados oficiais.

## Próximas etapas

1. persistir workflow na API;
2. adicionar responsável e prazo;
3. registrar histórico de mudanças;
4. permitir transformar insight em tarefa;
5. comparar períodos;
6. adicionar limites configuráveis;
7. detectar anomalias;
8. medir precisão e utilidade das regras.
