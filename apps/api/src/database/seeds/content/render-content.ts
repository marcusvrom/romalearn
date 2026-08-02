import {
  ActivityExample,
  ActivityRubric,
  ContentBlock,
  EbookReference,
  LessonContent,
} from './content-types';

/**
 * Converte o conteúdo estruturado da aula em Markdown.
 *
 * O Markdown gerado aqui é o mesmo que um gestor de conteúdo escreveria pelo
 * painel: o seed não usa nenhum recurso que o editor não tenha. A sanitização
 * acontece depois, na renderização para HTML.
 */

const CALLOUT_LABEL: Record<string, string> = {
  analogy: 'Imagine assim',
  warning: 'Atenção',
  tip: 'Dica',
  keyIdea: 'Ideia principal',
};

/** Escapa o caractere que quebraria a célula de uma tabela Markdown. */
function cell(text: string): string {
  return text.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function renderBlock(block: ContentBlock): string {
  switch (block.kind) {
    case 'heading':
      return `## ${block.text}`;

    case 'paragraph':
      return block.text;

    case 'analogy':
    case 'warning':
    case 'tip':
    case 'keyIdea':
      return `> **${CALLOUT_LABEL[block.kind]}:** ${block.text}`;

    case 'list':
      return block.items.map((item) => `- ${item}`).join('\n');

    case 'steps':
      return block.items.map((item, index) => `${index + 1}. ${item}`).join('\n');

    case 'table': {
      const header = `| ${block.headers.map(cell).join(' | ')} |`;
      const divider = `| ${block.headers.map(() => '---').join(' | ')} |`;
      const rows = block.rows.map((row) => `| ${row.map(cell).join(' | ')} |`);
      return [header, divider, ...rows].join('\n');
    }

    case 'template':
      return `**${block.label}**\n\n> ${block.text}`;
  }
}

function renderReference(reference: EbookReference): string {
  return (
    '## De onde vem este conteúdo\n\n' +
    `Esta aula resume o **${reference.chapter}** do e-book do ${reference.module} ` +
    `(páginas ${reference.pages}), disponível em "Materiais de apoio" aqui mesmo. ` +
    'O e-book segue sendo a fonte completa: leia o capítulo inteiro para os exemplos ' +
    'e as tabelas na íntegra.'
  );
}

/** Markdown de uma aula de leitura. */
export function renderLessonContent(content: LessonContent): string {
  const parts = content.blocks.map(renderBlock);

  if (content.checklist?.length) {
    parts.push(
      '## Antes de seguir, confira\n\n' + content.checklist.map((item) => `- ${item}`).join('\n'),
    );
  }

  if (content.summary?.length) {
    parts.push('## Resumo do capítulo\n\n' + content.summary.map((item) => `- ${item}`).join('\n'));
  }

  parts.push(renderReference(content.reference));

  return parts.join('\n\n');
}

/**
 * Markdown de uma atividade prática.
 *
 * A rubrica aparece **antes** do envio: o aluno precisa saber como será
 * avaliado enquanto ainda pode melhorar a entrega.
 */
export function renderActivityContent(
  instructions: string,
  rubric: ActivityRubric,
  reference: EbookReference,
  example?: ActivityExample,
): string {
  const criteria = [
    '| Critério | Peso | O que a correção observa |',
    '| --- | --- | --- |',
    ...rubric.criteria.map((c) => `| ${cell(c.title)} | ${c.weight}% | ${cell(c.whatToObserve)} |`),
  ].join('\n');

  return [
    '## O que fazer',
    instructions,
    '> **Atenção:** use sempre dados fictícios ou autorizados. Nunca envie senha, documento, ' +
      'dado de cliente ou informação interna da sua empresa.',
    '## Como sua entrega será avaliada',
    `Nota mínima para aprovação: **${rubric.passingScore}%**.`,
    criteria,
    '## O que reprova mesmo com nota alta',
    rubric.criticalFailures.map((item) => `- ${item}`).join('\n'),
    '## Como escrever seu relato',
    'Descreva o que você fez com suas palavras, passo a passo, citando cada critério da tabela ' +
      'acima. Diga também o que conferiu e o que ainda ficou com dúvida — reconhecer uma dúvida ' +
      `não tira nota. Escreva pelo menos ${rubric.minWords} palavras para que a correção consiga ` +
      'avaliar sua entrega.',
    ...(example ? [renderExample(example)] : []),
    renderReference(reference),
  ].join('\n\n');
}

/**
 * Exemplo comentado.
 *
 * Vem depois das instruções e da rubrica de propósito: o aluno primeiro
 * entende o que precisa fazer, e só então vê como um relato bom se parece.
 * O cenário do exemplo é outro, então ele orienta sem entregar a resposta.
 */
function renderExample(example: ActivityExample): string {
  return [
    '## Exemplo comentado',
    `Para você ver a forma esperada, aqui está a entrega de **outro** exercício: ${example.scenario} ` +
      'Repare no nível de detalhe, não no conteúdo — a sua atividade é diferente.',
    '> **Atenção:** este exemplo serve de referência. Uma entrega copiada dele é recusada ' +
      'automaticamente, antes mesmo da correção.',
    '### Um relato que seria aprovado',
    blockquote(example.goodReport),
    '**Por que funciona**',
    example.whyItWorks.map((item) => `- ${item}`).join('\n'),
    '### O mesmo trabalho, mal relatado',
    blockquote(example.weakReport),
    '**O que falta**',
    example.whyItFails.map((item) => `- ${item}`).join('\n'),
  ].join('\n\n');
}

/** Cita um texto de várias linhas preservando os parágrafos. */
function blockquote(text: string): string {
  return text
    .split('\n\n')
    .map((paragrafo) => `> ${paragrafo.trim()}`)
    .join('\n>\n');
}
