import { Routes } from '@angular/router';
import { UserRole } from '@romalearn/contracts';
import { authGuard, guestGuard, staffGuard } from './core/guards';

/**
 * Rotas em português, legíveis e estáveis (boas para SEO e para o aluno).
 *
 * Tudo é carregado sob demanda: a landing page não baixa o código da área
 * do aluno nem o do painel administrativo.
 */
export const routes: Routes = [
  // ----- Área pública -------------------------------------------------
  {
    path: '',
    loadComponent: () => import('./features/public/landing.page').then((m) => m.LandingPage),
  },
  {
    path: 'cursos',
    loadComponent: () => import('./features/public/catalog.page').then((m) => m.CatalogPage),
  },
  {
    path: 'cursos/:slug',
    loadComponent: () => import('./features/public/course.page').then((m) => m.CoursePage),
  },
  {
    path: 'trilhas/:slug',
    loadComponent: () => import('./features/public/program.page').then((m) => m.ProgramPage),
  },
  {
    path: 'certificados/verificar/:codigo',
    loadComponent: () =>
      import('./features/public/certificate-verification.page').then(
        (m) => m.CertificateVerificationPage,
      ),
  },
  {
    path: 'termos',
    loadComponent: () => import('./features/public/legal.page').then((m) => m.LegalPage),
    data: { document: 'terms' },
  },
  {
    path: 'privacidade',
    loadComponent: () => import('./features/public/legal.page').then((m) => m.LegalPage),
    data: { document: 'privacy' },
  },
  {
    path: 'suporte',
    loadComponent: () => import('./features/public/support.page').then((m) => m.SupportPage),
  },

  // ----- Autenticação ---------------------------------------------------
  {
    path: 'entrar',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'criar-conta',
    canActivate: [guestGuard],
    loadComponent: () => import('./features/auth/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'recuperar-senha',
    loadComponent: () =>
      import('./features/auth/forgot-password.page').then((m) => m.ForgotPasswordPage),
  },
  {
    path: 'redefinir-senha',
    loadComponent: () =>
      import('./features/auth/reset-password.page').then((m) => m.ResetPasswordPage),
  },
  {
    path: 'confirmar-email',
    loadComponent: () => import('./features/auth/verify-email.page').then((m) => m.VerifyEmailPage),
  },

  // ----- Checkout --------------------------------------------------------
  {
    path: 'checkout/:offerId',
    canActivate: [authGuard],
    loadComponent: () => import('./features/checkout/checkout.page').then((m) => m.CheckoutPage),
  },

  // ----- Área do aluno ---------------------------------------------------
  {
    path: 'painel',
    canActivate: [authGuard],
    loadChildren: () => import('./features/student/student.routes').then((m) => m.studentRoutes),
  },

  // ----- Painel administrativo -------------------------------------------
  {
    path: 'admin',
    canActivate: [staffGuard],
    data: { roles: [UserRole.ADMIN, UserRole.CONTENT_MANAGER, UserRole.SUPPORT] },
    loadChildren: () => import('./features/admin/admin.routes').then((m) => m.adminRoutes),
  },

  {
    path: '**',
    loadComponent: () => import('./features/public/not-found.page').then((m) => m.NotFoundPage),
  },
];
