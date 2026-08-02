import { RenderMode, ServerRoute } from '@angular/ssr';

/**
 * Estratégia de renderização por rota.
 *
 * Páginas públicas com conteúdo dinâmico (curso, trilha, validação de
 * certificado) são renderizadas no servidor a cada requisição — o conteúdo
 * muda quando a equipe publica algo, sem precisar de novo build.
 *
 * Páginas institucionais estáticas são pré-renderizadas no build.
 *
 * Área do aluno, checkout e painel administrativo dependem da sessão e por
 * isso rodam apenas no navegador.
 */
export const serverRoutes: ServerRoute[] = [
  // Institucionais: prerender no build.
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'cursos', renderMode: RenderMode.Server },
  { path: 'termos', renderMode: RenderMode.Prerender },
  { path: 'privacidade', renderMode: RenderMode.Prerender },
  { path: 'suporte', renderMode: RenderMode.Prerender },

  // Conteúdo dinâmico indexável: SSR sob demanda.
  { path: 'cursos/:slug', renderMode: RenderMode.Server },
  { path: 'trilhas/:slug', renderMode: RenderMode.Server },
  { path: 'certificados/verificar/:codigo', renderMode: RenderMode.Server },

  // Fluxos que dependem de sessão: só no navegador.
  { path: 'entrar', renderMode: RenderMode.Client },
  { path: 'criar-conta', renderMode: RenderMode.Client },
  { path: 'recuperar-senha', renderMode: RenderMode.Client },
  { path: 'redefinir-senha', renderMode: RenderMode.Client },
  { path: 'confirmar-email', renderMode: RenderMode.Client },
  { path: 'checkout/**', renderMode: RenderMode.Client },
  { path: 'painel/**', renderMode: RenderMode.Client },
  { path: 'admin/**', renderMode: RenderMode.Client },

  { path: '**', renderMode: RenderMode.Server },
];
