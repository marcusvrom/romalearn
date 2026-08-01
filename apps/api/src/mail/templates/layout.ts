export interface TemplateBrand {
  platformName: string;
  supportEmail: string;
  webUrl: string;
}

export interface TemplateBody {
  title: string;
  intro: string;
  paragraphs?: string[];
  action?: { label: string; url: string };
  /** Frase de rodapé específica do e-mail (ex.: "se não foi você, ignore"). */
  note?: string;
}

/** Escapa texto interpolado no HTML — todo conteúdo dinâmico passa por aqui. */
export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Layout único, em português, com boa legibilidade em clientes de e-mail
 * antigos (tabelas e estilos inline).
 */
export function renderLayout(
  brand: TemplateBrand,
  body: TemplateBody,
): { html: string; text: string } {
  const paragraphs = body.paragraphs ?? [];

  const html = `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(body.title)}</title>
  </head>
  <body style="margin:0;padding:24px;background-color:#f4f6fb;font-family:Arial,Helvetica,sans-serif;color:#1f2937;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;margin:0 auto;background-color:#ffffff;border-radius:12px;overflow:hidden;">
      <tr>
        <td style="padding:24px;background-color:#1d4ed8;color:#ffffff;font-size:18px;font-weight:bold;">
          ${escapeHtml(brand.platformName)}
        </td>
      </tr>
      <tr>
        <td style="padding:24px;">
          <h1 style="margin:0 0 16px;font-size:20px;line-height:1.3;">${escapeHtml(body.title)}</h1>
          <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">${escapeHtml(body.intro)}</p>
          ${paragraphs
            .map(
              (paragraph) =>
                `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;">${escapeHtml(paragraph)}</p>`,
            )
            .join('')}
          ${
            body.action
              ? `<p style="margin:24px 0;">
                   <a href="${escapeHtml(body.action.url)}" style="display:inline-block;padding:14px 24px;background-color:#1d4ed8;color:#ffffff;text-decoration:none;border-radius:8px;font-size:16px;font-weight:bold;">${escapeHtml(body.action.label)}</a>
                 </p>
                 <p style="margin:0 0 16px;font-size:13px;line-height:1.6;color:#6b7280;">
                   Se o botão não funcionar, copie e cole este endereço no navegador:<br />
                   <span style="word-break:break-all;">${escapeHtml(body.action.url)}</span>
                 </p>`
              : ''
          }
          ${
            body.note
              ? `<p style="margin:0;font-size:14px;line-height:1.6;color:#6b7280;">${escapeHtml(body.note)}</p>`
              : ''
          }
        </td>
      </tr>
      <tr>
        <td style="padding:16px 24px;background-color:#f9fafb;font-size:13px;line-height:1.6;color:#6b7280;">
          Precisa de ajuda? Escreva para
          <a href="mailto:${escapeHtml(brand.supportEmail)}" style="color:#1d4ed8;">${escapeHtml(brand.supportEmail)}</a>.
          <br />Este é um e-mail automático — não é necessário responder.
        </td>
      </tr>
    </table>
  </body>
</html>`;

  const text = [
    body.title,
    '',
    body.intro,
    ...paragraphs,
    body.action ? `\n${body.action.label}: ${body.action.url}` : '',
    body.note ?? '',
    '',
    `Precisa de ajuda? Escreva para ${brand.supportEmail}.`,
  ]
    .filter(Boolean)
    .join('\n');

  return { html, text };
}
