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

export interface LearningFlowStage {
  label: string;
  text: string;
}

export interface GuidedThinkingOptions {
  caseStudy: string;
  example: string;
}

const GUIDED_MOMENT_TITLES = [
  'pare e pense',
  'pratique agora',
  'reflexao obrigatoria',
  'pense e responda',
  'agora e com voce',
];

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function plainText(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[`*_#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function shortText(text: string, maxLength = 180): string {
  const clean = plainText(text);
  if (clean.length <= maxLength) return clean;

  const slice = clean.slice(0, maxLength);
  const sentenceEnd = Math.max(slice.lastIndexOf('. '), slice.lastIndexOf('? '));
  const safeEnd = sentenceEnd >= 70 ? sentenceEnd + 1 : slice.lastIndexOf(' ');
  return `${slice.slice(0, safeEnd > 0 ? safeEnd : maxLength).trim()}…`;
}

function normalizeTitle(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function isGuidedMoment(block: ContentBlock): block is Extract<ContentBlock, { kind: 'heading' }> {
  return block.kind === 'heading' && GUIDED_MOMENT_TITLES.includes(normalizeTitle(block.text));
}

function firstParagraph(blocks: ContentBlock[]): string {
  return blocks.find((block) => block.kind === 'paragraph')?.text ?? '';
}

function firstKeyIdea(blocks: ContentBlock[]): string {
  const keyIdea = blocks.find((block) => block.kind === 'keyIdea');
  if (keyIdea?.kind === 'keyIdea') return keyIdea.text;

  const analogy = blocks.find((block) => block.kind === 'analogy');
  return analogy?.kind === 'analogy' ? analogy.text : '';
}

function firstExample(blocks: ContentBlock[]): string {
  const analogy = blocks.find((block) => block.kind === 'analogy');
  if (analogy?.kind === 'analogy') return analogy.text;

  const table = blocks.find((block) => block.kind === 'table');
  if (table?.kind === 'table' && table.rows[0]) {
    return table.headers
      .map((header, index) => `${header}: ${table.rows[0]?.[index] ?? '—'}`)
      .join('; ');
  }

  const keyIdea = blocks.find((block) => block.kind === 'keyIdea');
  return keyIdea?.kind === 'keyIdea' ? keyIdea.text : firstParagraph(blocks);
}

function firstAction(blocks: ContentBlock[]): string {
  const steps = blocks.find((block) => block.kind === 'steps');
  if (steps?.kind === 'steps') return steps.items[0] ?? '';

  const list = blocks.find(
    (block) => block.kind === 'list' && block.items.some((item) => !item.includes('http')),
  );
  return list?.kind === 'list' ? (list.items.find((item) => !item.includes('http')) ?? '') : '';
}

/**
 * Infográfico textual e responsivo. O `ol` mantém a ordem compreensível para
 * leitores de tela, enquanto o CSS apresenta o mesmo conteúdo como fluxo.
 */
export function renderLearningFlow(title: string, stages: LearningFlowStage[]): string {
  const visibleStages = stages.filter((stage) => stage.text.trim().length > 0);
  if (visibleStages.length < 2) return '';

  const items = visibleStages
    .map(
      (stage) =>
        '<li class="rl-learning-flow__step">' +
        `<strong class="rl-learning-flow__label">${escapeHtml(stage.label)}</strong>` +
        `<span class="rl-learning-flow__text">${escapeHtml(shortText(stage.text))}</span>` +
        '</li>',
    )
    .join('');

  return (
    '<figure class="rl-learning-flow">' +
    `<figcaption class="rl-learning-flow__title">${escapeHtml(title)}</figcaption>` +
    `<ol class="rl-learning-flow__steps">${items}</ol>` +
    '</figure>'
  );
}

/**
 * Apoio colocado imediatamente depois de pedidos de reflexão ou prática.
 * Toda pergunta passa a ter um caso, um exemplo e um formato de resposta.
 */
export function renderGuidedThinking(options: GuidedThinkingOptions): string {
  return (
    '<div class="rl-guided-thinking">' +
    '<p class="rl-guided-thinking__title"><strong>Você não precisa responder no escuro</strong></p>' +
    `<p><strong>Caso para analisar:</strong> ${escapeHtml(shortText(options.caseStudy, 240))}</p>` +
    `<p><strong>Exemplo já trabalhado:</strong> ${escapeHtml(shortText(options.example, 240))}</p>` +
    '<p><strong>Monte sua resposta em três partes:</strong></p>' +
    '<ol class="rl-guided-thinking__steps">' +
    '<li><strong>Observe:</strong> cite um fato, entrada, ação ou resultado do caso.</li>' +
    '<li><strong>Explique:</strong> ligue essa observação ao conceito da aula.</li>' +
    '<li><strong>Aplique:</strong> diga o que faria ou como conferiria a decisão.</li>' +
    '</ol>' +
    '<p class="rl-guided-thinking__starter"><strong>Modelo para começar:</strong> “No caso apresentado, observei ____. Isso se relaciona com ____ porque ____. Eu confirmaria minha resposta ____.”</p>' +
    '</div>'
  );
}

function learningMap(content: LessonContent): string {
  return renderLearningFlow('Mapa visual desta aula', [
    { label: 'Observe', text: firstParagraph(content.blocks) },
    { label: 'Entenda', text: firstKeyIdea(content.blocks) },
    { label: 'Experimente', text: firstAction(content.blocks) },
    {
      label: 'Confira',
      text: content.checklist?.[0] ?? content.summary?.[0] ?? firstKeyIdea(content.blocks),
    },
  ]);
}

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

    case 'code': {
      const fence = ['```' + block.language, ...block.lines, '```'].join('\n');
      const caption = block.caption ?? `Exemplo em ${block.language}:`;
      return `${caption}\n\n${fence}`;
    }

    case 'output': {
      // Sem linguagem: é o que a tela mostrou, não código para copiar.
      const fence = ['```text', ...block.lines, '```'].join('\n');
      return `${block.caption ?? 'O que aparece na tela:'}\n\n${fence}`;
    }
  }
}

function renderReference(reference: EbookReference): string {
  if (reference.sourceType === 'ORIGINAL') {
    return (
      '## Autoria e referências\n\n' +
      `Esta aula, **${reference.chapter}**, é material original da ${reference.module}. ` +
      'Os conceitos técnicos devem ser conferidos nas documentações oficiais indicadas ao longo do curso.'
    );
  }

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
  const map = learningMap(content);
  const mapPosition = content.blocks[1]?.kind === 'keyIdea' ? 1 : 0;
  const parts: string[] = [];

  content.blocks.forEach((block, index) => {
    parts.push(renderBlock(block));

    if (index === mapPosition && map) parts.push(map);

    if (isGuidedMoment(block)) {
      const previous = content.blocks.slice(0, index);
      parts.push(
        renderGuidedThinking({
          caseStudy: firstParagraph(previous),
          example: firstExample(previous),
        }),
      );
    }
  });

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
    renderLearningFlow('Da leitura à entrega', [
      { label: 'Entenda', text: 'Leia o cenário e destaque o resultado pedido.' },
      { label: 'Faça', text: 'Execute uma etapa por vez usando dados fictícios.' },
      { label: 'Teste', text: 'Compare o resultado com os critérios e corrija uma falha por vez.' },
      { label: 'Relate', text: 'Explique decisões, evidências, conferências e dúvidas.' },
    ]),
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
    renderGuidedThinking({
      caseStudy: example?.scenario ?? instructions,
      example:
        example?.goodReport ??
        'Em um teste com dado fictício, registre o que mudou, por que mudou e como você conferiu.',
    }),
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
