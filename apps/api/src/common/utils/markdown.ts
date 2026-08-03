import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';

/**
 * Conteúdo de aula é escrito em Markdown e servido como HTML.
 *
 * A sanitização acontece **no backend**: o front recebe HTML já seguro e
 * nunca decide o que é permitido. Nenhuma tag de script, iframe ou atributo
 * de evento sobrevive a esta função.
 */
const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'p',
    'br',
    'hr',
    'blockquote',
    'pre',
    'code',
    'strong',
    'em',
    'b',
    'i',
    'u',
    's',
    'mark',
    'small',
    'ul',
    'ol',
    'li',
    'table',
    'thead',
    'tbody',
    'tfoot',
    'tr',
    'th',
    'td',
    'caption',
    'a',
    'img',
    'figure',
    'figcaption',
    'span',
    'div',
  ],
  allowedAttributes: {
    a: ['href', 'title', 'target', 'rel'],
    img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
    th: ['scope', 'colspan', 'rowspan'],
    td: ['colspan', 'rowspan'],
    code: ['class'],
    span: ['class'],
    div: ['class'],
    figure: ['class'],
    figcaption: ['class'],
    ol: ['class'],
    li: ['class'],
    p: ['class'],
    strong: ['class'],
  },
  allowedSchemes: ['http', 'https', 'mailto'],
  // Bloqueia data: em imagens para evitar payloads embutidos.
  allowedSchemesByTag: { img: ['http', 'https'] },
  transformTags: {
    // Links externos nunca dão acesso ao `window.opener` da plataforma.
    a: (tagName, attribs) => ({
      tagName,
      attribs: { ...attribs, rel: 'noopener noreferrer nofollow' },
    }),
    img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: 'lazy' } }),
  },
  disallowedTagsMode: 'discard',
};

export function renderMarkdown(markdown: string | null | undefined): string {
  if (!markdown) return '';
  const rawHtml = marked.parse(markdown, { async: false, gfm: true, breaks: false });
  return sanitizeHtml(rawHtml, SANITIZE_OPTIONS);
}

/** Sanitiza HTML que já venha pronto (ex.: colado no painel administrativo). */
export function sanitizeContentHtml(html: string): string {
  return sanitizeHtml(html, SANITIZE_OPTIONS);
}

/** Texto simples para prévias e meta description. */
export function toPlainText(markdown: string, maxLength = 160): string {
  const text = sanitizeHtml(marked.parse(markdown, { async: false }), {
    allowedTags: [],
    allowedAttributes: {},
  })
    .replace(/\s+/g, ' ')
    .trim();

  return text.length <= maxLength ? text : `${text.slice(0, maxLength - 1).trimEnd()}…`;
}
