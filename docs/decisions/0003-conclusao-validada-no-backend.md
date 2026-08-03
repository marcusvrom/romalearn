# ADR 0003 — Conclusão de aula validada no backend

**Status:** aceito · **Data:** 2026-01

## Contexto

O certificado é a entrega mais visível da plataforma. Se "concluir uma aula" for apenas um botão
no front-end, o certificado não significa nada — e a especificação é explícita: abrir a página não
pode concluir a aula.

## Decisão

Cada tipo de aula tem uma **regra de conclusão** avaliada exclusivamente no servidor:

| Regra                 | Exigência                              |
| --------------------- | -------------------------------------- |
| `MANUAL_CONFIRMATION` | Confirmação explícita do aluno         |
| `MINIMUM_TIME`        | Tempo mínimo de permanência registrado |
| `VIDEO_WATCH_RATIO`   | Proporção mínima do vídeo assistida    |
| `QUIZ_PASSED`         | Tentativa aprovada no questionário     |
| `ACTIVITY_SUBMITTED`  | Envio da atividade prática             |

O player envia batidas periódicas de progresso, mas **cada chamada aceita no máximo 120
segundos**. Um cliente adulterado que envie `elapsedSeconds: 999999` não pula a exigência.

A proporção assistida só cresce: voltar o vídeo não apaga o avanço, mas também não permite
inflá-la.

Quando a regra não é satisfeita, a API devolve uma mensagem em português explicando exatamente o
que falta — o front-end apenas exibe.

## Consequências

- o certificado corresponde a estudo real;
- o front-end fica mais simples: não reimplementa regra nenhuma;
- adicionar um tipo de aula é adicionar um caso em `completion-rules.ts`, coberto por testes
  unitários;
- há custo de escrita no banco a cada batida de progresso — aceitável no volume atual e
  facilmente mitigável com escrita em lote se necessário.
