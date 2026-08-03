import {
  AngularNodeAppEngine,
  createNodeRequestHandler,
  isMainModule,
  writeResponseToNodeResponse,
} from '@angular/ssr/node';
import express from 'express';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');

const app = express();
const angularApp = new AngularNodeAppEngine();

/**
 * Servidor de renderização (SSR).
 *
 * As páginas públicas são renderizadas no servidor para indexação; a área do
 * aluno e o painel administrativo carregam no navegador e são marcados como
 * `noindex` pelo SeoService.
 */

// Cabeçalhos de segurança do documento HTML.
app.use((_req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

// Arquivos estáticos do build, com cache longo (nomes têm hash).
app.use(
  express.static(browserDistFolder, {
    maxAge: '1y',
    index: false,
    redirect: false,
  }),
);

// Sitemap gerado a partir das rotas públicas conhecidas.
app.get('/sitemap.xml', async (_req, res) => {
  const siteUrl = (process.env['WEB_PUBLIC_URL'] ?? 'http://localhost:4200').replace(/\/$/, '');
  const apiUrl = process.env['API_INTERNAL_URL'] ?? 'http://localhost:3333/api';

  const paths = ['/', '/cursos', '/termos', '/privacidade', '/suporte'];

  try {
    const response = await fetch(`${apiUrl}/catalog/courses`);
    if (response.ok) {
      const courses = (await response.json()) as { slug: string }[];
      paths.push(...courses.map((course) => `/cursos/${course.slug}`));
    }

    const programs = await fetch(`${apiUrl}/catalog/programs`);
    if (programs.ok) {
      const list = (await programs.json()) as { slug: string }[];
      paths.push(...list.map((program) => `/trilhas/${program.slug}`));
    }
  } catch {
    // Sem a API disponível, publica ao menos as rotas estáticas.
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${paths
  .map(
    (path) =>
      `  <url><loc>${siteUrl}${path}</loc><changefreq>weekly</changefreq><priority>${
        path === '/' ? '1.0' : '0.7'
      }</priority></url>`,
  )
  .join('\n')}
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.send(body);
});

// Demais rotas passam pelo renderizador do Angular.
app.use((req, res, next) => {
  angularApp
    .handle(req)
    .then((response) => (response ? writeResponseToNodeResponse(response, res) : next()))
    .catch(next);
});

if (isMainModule(import.meta.url)) {
  const port = Number(process.env['WEB_PORT'] ?? 4000);
  app.listen(port, () => {
    process.stdout.write(`Servidor SSR no ar em http://localhost:${port}\n`);
  });
}

export const reqHandler = createNodeRequestHandler(app);
