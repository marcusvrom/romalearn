import { Routes } from '@angular/router';
import { UserRole } from '@romalearn/contracts';
import { staffGuard } from '../../core/guards';

/**
 * Backoffice da RomaLearn.
 *
 * Os guards organizam a experiência; a autorização real continua sendo
 * validada pela API em cada operação sensível.
 */
export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./admin-shell.component').then((m) => m.AdminShellComponent),
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/dashboard.page').then((m) => m.AdminDashboardPage),
      },
      {
        path: 'financeiro',
        canActivate: [staffGuard],
        data: { roles: [UserRole.ADMIN, UserRole.SUPPORT] },
        loadComponent: () =>
          import('./pages/finance-overview.page').then((m) => m.AdminFinanceOverviewPage),
      },
      {
        path: 'analytics',
        loadComponent: () =>
          import('./pages/content-analytics.page').then((m) => m.AdminContentAnalyticsPage),
      },
      {
        path: 'atendimento',
        canActivate: [staffGuard],
        data: { roles: [UserRole.ADMIN, UserRole.SUPPORT] },
        loadComponent: () =>
          import('./pages/support-center.page').then((m) => m.AdminSupportCenterPage),
      },
      {
        path: 'cursos',
        loadComponent: () => import('./pages/courses.page').then((m) => m.AdminCoursesPage),
      },
      {
        path: 'cursos/:id',
        loadComponent: () =>
          import('./pages/course-editor.page').then((m) => m.AdminCourseEditorPage),
      },
      {
        path: 'produtos',
        loadComponent: () => import('./pages/commerce.page').then((m) => m.AdminCommercePage),
      },
      {
        path: 'pedidos',
        loadComponent: () => import('./pages/orders.page').then((m) => m.AdminOrdersPage),
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./pages/users.page').then((m) => m.AdminUsersPage),
      },
      {
        path: 'certificados',
        loadComponent: () =>
          import('./pages/certificates.page').then((m) => m.AdminCertificatesPage),
      },
      {
        path: 'auditoria',
        canActivate: [staffGuard],
        data: { roles: [UserRole.ADMIN, UserRole.SUPPORT] },
        loadComponent: () => import('./pages/audit.page').then((m) => m.AdminAuditPage),
      },
      {
        path: 'configuracoes',
        canActivate: [staffGuard],
        data: { roles: [UserRole.ADMIN] },
        loadComponent: () => import('./pages/settings.page').then((m) => m.AdminSettingsPage),
      },
    ],
  },
];
