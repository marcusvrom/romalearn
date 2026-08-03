import { Routes } from '@angular/router';

/** Área do aluno. Nada aqui é indexado por buscadores. */
export const studentRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard.page').then((m) => m.DashboardPage),
  },
  {
    path: 'certificados',
    loadComponent: () => import('./certificates.page').then((m) => m.CertificatesPage),
  },
  {
    path: 'compras',
    loadComponent: () => import('./purchases.page').then((m) => m.PurchasesPage),
  },
  {
    path: 'perfil',
    loadComponent: () => import('./profile.page').then((m) => m.ProfilePage),
  },
  {
    // O player tem layout próprio, em tela cheia.
    path: 'cursos/:courseSlug',
    loadComponent: () => import('./player/player.page').then((m) => m.PlayerPage),
    children: [
      {
        path: 'aulas/:lessonSlug',
        loadComponent: () => import('./player/lesson.page').then((m) => m.LessonPage),
      },
    ],
  },
];
