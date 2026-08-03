import { renderMarkdown, sanitizeContentHtml, toPlainText } from './markdown';

describe('Sanitização de conteúdo', () => {
  it('converte Markdown em HTML', () => {
    const html = renderMarkdown('# Título\n\nTexto com **negrito**.');
    expect(html).toContain('<h1>Título</h1>');
    expect(html).toContain('<strong>negrito</strong>');
  });

  it('remove scripts embutidos no conteúdo', () => {
    const html = renderMarkdown('Olá\n\n<script>alert("xss")</script>');
    expect(html).not.toContain('<script');
    expect(html).not.toContain('alert');
  });

  it('remove atributos de evento', () => {
    const html = sanitizeContentHtml('<p onclick="roubar()">Clique</p>');
    expect(html).not.toContain('onclick');
    expect(html).toContain('Clique');
  });

  it('bloqueia links javascript:', () => {
    const html = sanitizeContentHtml('<a href="javascript:alert(1)">link</a>');
    expect(html).not.toContain('javascript:');
  });

  it('bloqueia iframes', () => {
    const html = sanitizeContentHtml('<iframe src="https://exemplo.com"></iframe>');
    expect(html).not.toContain('<iframe');
  });

  it('adiciona rel de segurança em links externos', () => {
    const html = renderMarkdown('[site](https://exemplo.com)');
    expect(html).toContain('rel="noopener noreferrer nofollow"');
  });

  it('marca imagens como lazy e recusa data URIs', () => {
    expect(renderMarkdown('![alt](https://exemplo.com/a.png)')).toContain('loading="lazy"');
    expect(sanitizeContentHtml('<img src="data:image/png;base64,AAA" />')).not.toContain('data:');
  });

  it('gera texto simples truncado para prévias', () => {
    const text = toPlainText('# Um título bem longo\n\nCom bastante conteúdo depois dele.', 20);
    expect(text.length).toBeLessThanOrEqual(20);
    expect(text).not.toContain('#');
  });
});
