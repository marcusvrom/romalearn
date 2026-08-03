/**
 * Detecção de entrega copiada do exemplo.
 *
 * Publicar um exemplo comentado ajuda quem está começando, mas convida à
 * cópia. Sem esta verificação, colar o exemplo passaria pela correção com nota
 * alta — o aluno não aprenderia nada e a nota deixaria de significar algo.
 *
 * A comparação usa trigramas de palavras: sequências de três palavras em
 * comum. Isso resiste a mudanças cosméticas — trocar uma palavra aqui, mexer
 * na ordem de dois parágrafos ali — sem acusar quem apenas escreveu sobre o
 * mesmo assunto, já que texto original raramente repete longas sequências.
 */

/** Proporção de trigramas em comum a partir da qual a entrega é recusada. */
export const COPY_THRESHOLD = 0.5;

function normalize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function trigrams(words: string[]): Set<string> {
  const resultado = new Set<string>();
  for (let i = 0; i + 2 < words.length; i += 1) {
    resultado.add(`${words[i]} ${words[i + 1]} ${words[i + 2]}`);
  }
  return resultado;
}

/**
 * Quanto do exemplo aparece na entrega, de 0 a 1.
 *
 * A referência é o **exemplo**, não a entrega: quem cola o exemplo e escreve
 * mais dois parágrafos por cima continua sendo pego, porque a proporção do
 * exemplo reproduzida segue alta.
 */
export function copiedRatio(submission: string, example: string): number {
  const doExemplo = trigrams(normalize(example));
  if (doExemplo.size === 0) return 0;

  const daEntrega = trigrams(normalize(submission));

  let comuns = 0;
  for (const trigrama of doExemplo) {
    if (daEntrega.has(trigrama)) comuns += 1;
  }

  return comuns / doExemplo.size;
}

/** Verdadeiro quando a entrega reproduz o exemplo além do aceitável. */
export function looksCopied(submission: string, example: string | null | undefined): boolean {
  if (!example) return false;
  return copiedRatio(submission, example) >= COPY_THRESHOLD;
}
