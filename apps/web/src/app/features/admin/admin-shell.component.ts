import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { WEB_ROUTES } from '@romalearn/contracts';
import { AuthService } from '../../core/auth.service';
import { PLATFORM_CONFIG } from '../../core/platform.config';

@Component({
  selector: 'rl-admin-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="admin" [class.admin--menu-open]="menuOpen()">
      <header class="topbar">
        <button
          type="button"
          class="topbar__toggle"
          [attr.aria-expanded]="menuOpen()"
          aria-controls="menu-admin"
          (click)="menuOpen.set(!menuOpen())"
        >
          <span aria-hidden="true">☰</span>
          <span class="rl-visually-hidden">Alternar menu</span>
        </button>

        <p class="topbar__brand">{{ config.name }} · Administração</p>

        <div class="topbar__user">
          <span class="rl-small rl-muted">{{ auth.user()?.name }}</span>
          <a
            class="rl-button rl-button--secondary rl-button--small"
            [routerLink]="routes.dashboard"
          >
            Sair do painel
          </a>
        </div>
      </header>

      <div class="admin__body">
        <nav id="menu-admin" class="sidebar" aria-label="Menu administrativo">
          @for (item of menu; track item.path) {
            <a
              [routerLink]="item.path"
              routerLinkActive="active"
              [routerLinkActiveOptions]="{ exact: item.exact }"
              (click)="menuOpen.set(false)"
            >
              <span aria-hidden="true">{{ item.icon }}</span>
              {{ item.label }}
            </a>
          }
        </nav>

        <main class="content">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100vh;
        background: var(--rl-surface-muted);
      }

      .topbar {
        position: sticky;
        top: 0;
        z-index: 30;
        display: flex;
        align-items: center;
        gap: var(--rl-space-4);
        padding: var(--rl-space-3) var(--rl-space-5);
        background: var(--rl-neutral-900);
        color: #fff;
      }

      .topbar__toggle {
        width: 44px;
        height: 44px;
        border: 1px solid rgba(255, 255, 255, 0.25);
        border-radius: var(--rl-radius-md);
        background: transparent;
        color: inherit;
        cursor: pointer;
      }

      @media (min-width: 1024px) {
        .topbar__toggle {
          display: none;
        }
      }

      .topbar__brand {
        flex: 1;
        margin: 0;
        font-weight: var(--rl-weight-semibold);
        font-size: var(--rl-text-sm);
      }

      .topbar__user {
        display: flex;
        align-items: center;
        gap: var(--rl-space-3);
      }

      .topbar__user .rl-small {
        display: none;
        color: rgba(255, 255, 255, 0.75);
      }

      @media (min-width: 640px) {
        .topbar__user .rl-small {
          display: inline;
        }
      }

      .admin__body {
        display: flex;
        align-items: stretch;
      }

      .sidebar {
        position: fixed;
        top: 60px;
        bottom: 0;
        left: 0;
        z-index: 25;
        width: min(260px, 80vw);
        padding: var(--rl-space-4);
        background: var(--rl-surface-raised);
        border-right: 1px solid var(--rl-border);
        overflow-y: auto;
        transform: translateX(-100%);
        transition: transform var(--rl-transition-base);
      }

      .admin--menu-open .sidebar {
        transform: translateX(0);
      }

      @media (min-width: 1024px) {
        .sidebar {
          position: sticky;
          top: 60px;
          height: calc(100vh - 60px);
          transform: none;
          flex-shrink: 0;
        }
      }

      .sidebar a {
        display: flex;
        align-items: center;
        gap: var(--rl-space-3);
        padding: var(--rl-space-3);
        margin-bottom: var(--rl-space-1);
        border-radius: var(--rl-radius-md);
        color: var(--rl-text-muted);
        text-decoration: none;
        font-size: var(--rl-text-sm);
        min-height: 44px;
      }

      .sidebar a:hover {
        background: var(--rl-surface-muted);
      }

      .sidebar a.active {
        background: var(--rl-brand-50);
        color: var(--rl-brand-800);
        font-weight: var(--rl-weight-semibold);
      }

      .content {
        flex: 1;
        min-width: 0;
        padding: var(--rl-space-6) var(--rl-space-5) var(--rl-space-16);
      }

      @media (min-width: 768px) {
        .content {
          padding: var(--rl-space-8) var(--rl-space-8) var(--rl-space-16);
        }
      }
    `,
  ],
})
export class AdminShellComponent {
  readonly auth = inject(AuthService);
  readonly config = inject(PLATFORM_CONFIG);
  readonly routes = WEB_ROUTES;
  readonly menuOpen = signal(false);

  readonly menu = [
    { path: '/admin', label: 'Visão geral', icon: '📊', exact: true },
    { path: '/admin/cursos', label: 'Cursos', icon: '📚', exact: false },
    { path: '/admin/produtos', label: 'Produtos e ofertas', icon: '🏷️', exact: false },
    { path: '/admin/pedidos', label: 'Pedidos', icon: '🧾', exact: false },
    { path: '/admin/usuarios', label: 'Usuários e acessos', icon: '👥', exact: false },
    { path: '/admin/certificados', label: 'Certificados', icon: '🎓', exact: false },
    { path: '/admin/auditoria', label: 'Auditoria', icon: '🔍', exact: false },
    { path: '/admin/configuracoes', label: 'Configurações', icon: '⚙️', exact: false },
  ];
}
