# ADR 0005 — Certificado com snapshot imutável

**Status:** aceito · **Data:** 2026-01

## Contexto

Um certificado é um documento que outras pessoas vão conferir, às vezes anos depois. Se ele for
apenas uma consulta ao estado atual do banco, mudar o nome do aluno ou corrigir a carga horária do
curso reescreveria a história de certificados já emitidos.

## Decisão

No momento da emissão, gravamos um **snapshot imutável**: nome do aluno, título do curso, carga
horária, instituição emissora, datas de conclusão e emissão e a estrutura concluída.

O PDF e a validação pública leem exclusivamente o snapshot.

Complementos:

- **emissão única**, garantida por índice único parcial `(userId, courseId)` — mesmo com chamadas
  concorrentes, o aluno nunca fica com dois certificados do mesmo curso;
- código público de validação sem caracteres ambíguos (sem `0`/`O`, `1`/`I`), para funcionar
  quando alguém digita a partir do papel;
- reemissão mantém o mesmo código e incrementa a versão — quem já tem o link continua validando;
- revogação é registrada com justificativa e aparece na hora na validação pública;
- histórico completo em `certificate_events`.

## Consequências

- dados duplicados entre `certificates` e as tabelas de origem — proposital;
- corrigir um erro em certificado emitido exige revogar e emitir de novo, com registro do motivo;
- a validação pública é uma consulta simples, sem `JOIN`, e não depende de o curso ainda existir;
- a página pública mostra apenas o necessário: nunca e-mail, telefone ou identificadores internos.
