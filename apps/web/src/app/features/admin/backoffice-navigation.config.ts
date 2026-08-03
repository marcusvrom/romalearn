export interface BackofficeNavItem {
  path: string;
  label: string;
  icon: string;
  exact?: boolean;
  badge?: string;
}

export interface BackofficeNavGroup {
  label: string;
  items: BackofficeNavItem[];
}

export const BACKOFFICE_NAVIGATION: BackofficeNavGroup[] = [
  {
    label: 'Visão do negócio',
    items: [
      { path: '/admin', label: 'Visão geral', icon: '📊', exact: true },
      { path: '/admin/financeiro', label: 'Financeiro', icon: '💳' },
      { path: '/admin/analytics', label: 'Analytics de conteúdo', icon: '📈' },
      { path: '/admin/insights', label: 'Intelligence Center', icon: '💡', badge: 'Novo' },
    ],
  },
  {
    label: 'Conteúdo e vendas',
    items: [
      { path: '/admin/cursos', label: 'Cursos e aulas', icon: '📚' },
      { path: '/admin/produtos', label: 'Produtos, ofertas e cupons', icon: '🏷️' },
      { path: '/admin/pedidos', label: 'Pedidos e pagamentos', icon: '🧾' },
      { path: '/admin/certificados', label: 'Certificados', icon: '🎓' },
    ],
  },
  {
    label: 'Relacionamento',
    items: [
      { path: '/admin/atendimento', label: 'Central de atendimento', icon: '💬', badge: 'Base' },
      { path: '/admin/usuarios', label: 'Alunos e acessos', icon: '👥' },
    ],
  },
  {
    label: 'Governança',
    items: [
      { path: '/admin/auditoria', label: 'Auditoria', icon: '🔍' },
      { path: '/admin/configuracoes', label: 'Configurações', icon: '⚙️' },
    ],
  },
];
