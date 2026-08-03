import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { WEB_ROUTES } from '@romalearn/contracts';
import { AuthService } from '../../core/auth.service';
import { PLATFORM_CONFIG } from '../../core/platform.config';
import { ThemeToggleComponent } from '../../shared/theme-toggle.component';
import { BACKOFFICE_NAVIGATION } from './backoffice-navigation.config';

@Component({
  selector: 'rl-admin-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ThemeToggleComponent],
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

        <div class="topbar__identity">
          <p class="topbar__brand">{{ config.name }} · Backoffice</p>
          <p class="topbar__context">Operação, conteúdo, vendas e relacionamento</p>
        </div>

        <div class="topbar__user">
          <rl-theme-toggle />
          <span class="rl-small rl-muted">{{ auth.user()?.name }}</span>
          <a class="rl-button rl-button--secondary rl-button--small" [routerLink]="routes.dashboard">
            Sair do backoffice
          </a>
        </div>
      </header>

      <div class="admin__body">
        <nav id="menu-admin" class="sidebar" aria-label="Menu do backoffice">
          @for (group of navigation; track group.label) {
            <section class="sidebar__group" [attr.aria-labelledby]="groupId(group.label)">
              <h2 [id]="groupId(group.label)">{{ group.label }}</h2>
              @for (item of group.items; track item.path) {
                <a
                  [routerLink]="item.path"
                  routerLinkActive="active"
                  [routerLinkActiveOptions]="{ exact: item.exact ?? false }"
                  (click)="menuOpen.set(false)"
                >
                  <span aria-hidden="true">{{ item.icon }}</span>
                  <span>{{ item.label }}</span>
                  @if (item.badge) {
                    <span class="sidebar__badge">{{ item.badge }}</span>
                  }
                </a>
              }
            </section>
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
      :host { display: block; min-height: 100vh; background: var(--rl-surface-muted); }
      .topbar { position: sticky; top: 0; z-index: 30; display: flex; align-items: center; gap: var(--rl-space-4); padding: var(--rl-space-3) var(--rl-space-5); background: var(--rl-neutral-900); color: #fff; }
      .topbar__toggle { width: 44px; height: 44px; border: 1px solid rgba(255,255,255,.25); border-radius: var(--rl-radius-md); background: transparent; color: inherit; cursor: pointer; }
      .topbar__identity { flex: 1; min-width: 0; }
      .topbar__brand, .topbar__context { margin: 0; }
      .topbar__brand { font-weight: var(--rl-weight-semibold); font-size: var(--rl-text-sm); }
      .topbar__context { display: none; color: rgba(255,255,255,.65); font-size: var(--rl-text-xs); }
      .topbar__user { display: flex; align-items: center; gap: var(--rl-space-3); }
      .topbar__user .rl-small { display: none; color: rgba(255,255,255,.75); }
      .admin__body { display: flex; align-items: stretch; }
      .sidebar { position: fixed; top: 68px; bottom: 0; left: 0; z-index: 25; width: min(290px, 86vw); padding: var(--rl-space-4); background: var(--rl-surface-raised); border-right: 1px solid var(--rl-border); overflow-y: auto; transform: translateX(-100%); transition: transform var(--rl-transition-base); }
      .admin--menu-open .sidebar { transform: translateX(0); }
      .sidebar__group + .sidebar__group { margin-top: var(--rl-space-5); padding-top: var(--rl-space-4); border-top: 1px solid var(--rl-border); }
      .sidebar__group h2 { margin: 0 0 var(--rl-space-2); padding: 0 var(--rl-space-3); color: var(--rl-text-subtle); font-size: var(--rl-text-xs); text-transform: uppercase; letter-spacing: .08em; }
      .sidebar a { display: flex; align-items: center; gap: var(--rl-space-3); min-height: 44px; padding: var(--rl-space-3); margin-bottom: var(--rl-space-1); border-radius: var(--rl-radius-md); color: var(--rl-text-muted); text-decoration: none; font-size: var(--rl-text-sm); }
      .sidebar a:hover { background: var(--rl-surface-muted); }
      .sidebar a.active { background: var(--rl-brand-50); color: var(--rl-brand-on-surface); font-weight: var(--rl-weight-semibold); }
      .sidebar__badge { margin-left: auto; padding: .1rem .45rem; border-radius: 999px; background: var(--rl-surface-muted); color: var(--rl-text-subtle); font-size: .7rem; }
      .content { flex: 1; min-width: 0; padding: var(--rl-space-6) var(--rl-space-5) var(--rl-space-16); }
      @media (min-width: 640px) { .topbar__user .rl-small, .topbar__context { display: block; } }
      @media (min-width: 768px) { .content { padding: var(--rl-space-8) var(--rl-space-8) var(--rl-space-16); } }
      @media (min-width: 1024px) { .topbar__toggle { display: none; } .sidebar { position: sticky; top: 68px; height: calc(100vh - 68px); transform: none; flex-shrink: 0; } }
    `,
  ],
})
export class AdminShellComponent {
  readonly auth = inject(AuthService);
  readonly config = inject(PLATFORM_CONFIG);
  readonly routes = WEB_ROUTES;
  readonly menuOpen = signal(false);
  readonly navigation = BACKOFFICE_NAVIGATION;

  groupId(label: string): string {
    return `nav-${label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-')}`;
  }
}
