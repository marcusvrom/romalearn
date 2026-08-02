import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { WEB_ROUTES } from '@romalearn/contracts';
import { AuthService } from '../core/auth.service';
import { PLATFORM_CONFIG } from '../core/platform.config';

/** Cabeçalho do site, com menu acessível por teclado no celular. */
@Component({
  selector: 'rl-site-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="header">
      <div class="rl-container bar">
        <a class="brand" [routerLink]="routes.home" [attr.aria-label]="config.name + ' — início'">
          <span class="mark" aria-hidden="true">RL</span>
          <span class="name">{{ config.name }}</span>
        </a>

        <button
          type="button"
          class="toggle"
          [attr.aria-expanded]="menuOpen()"
          aria-controls="menu-principal"
          (click)="toggleMenu()"
        >
          <span class="rl-visually-hidden">{{ menuOpen() ? 'Fechar menu' : 'Abrir menu' }}</span>
          <span aria-hidden="true">{{ menuOpen() ? '✕' : '☰' }}</span>
        </button>

        <nav id="menu-principal" class="nav" [class.nav--open]="menuOpen()" aria-label="Principal">
          <a [routerLink]="routes.catalog" routerLinkActive="active" (click)="closeMenu()"
            >Cursos</a
          >
          <a [routerLink]="['/']" fragment="como-funciona" (click)="closeMenu()">Como funciona</a>
          <a [routerLink]="['/']" fragment="perguntas" (click)="closeMenu()">Dúvidas</a>

          @if (auth.isAuthenticated()) {
            @if (auth.isStaff()) {
              <a [routerLink]="routes.admin" routerLinkActive="active" (click)="closeMenu()">
                Painel administrativo
              </a>
            }
            <a
              class="rl-button rl-button--secondary rl-button--small"
              [routerLink]="routes.dashboard"
              (click)="closeMenu()"
            >
              Minha área
            </a>
            <button
              type="button"
              class="rl-button rl-button--ghost rl-button--small"
              (click)="logout()"
            >
              Sair
            </button>
          } @else {
            <a
              class="rl-button rl-button--ghost rl-button--small"
              [routerLink]="routes.login"
              (click)="closeMenu()"
            >
              Entrar
            </a>
            <a
              class="rl-button rl-button--primary rl-button--small"
              [routerLink]="routes.register"
              (click)="closeMenu()"
            >
              Começar de graça
            </a>
          }
        </nav>
      </div>
    </header>
  `,
  styles: [
    `
      .header {
        position: sticky;
        top: 0;
        z-index: 40;
        background: color-mix(in srgb, var(--rl-surface) 92%, transparent);
        backdrop-filter: blur(8px);
        border-bottom: 1px solid var(--rl-border);
      }

      .bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--rl-space-4);
        min-height: var(--rl-header-height);
      }

      .brand {
        display: flex;
        align-items: center;
        gap: var(--rl-space-3);
        text-decoration: none;
        color: var(--rl-text);
        font-weight: var(--rl-weight-bold);
      }

      .mark {
        display: grid;
        place-items: center;
        width: 34px;
        height: 34px;
        border-radius: var(--rl-radius-md);
        background: linear-gradient(135deg, var(--rl-brand-600), var(--rl-accent-500));
        color: #fff;
        font-size: var(--rl-text-sm);
        letter-spacing: 0.02em;
      }

      .toggle {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        border: 1px solid var(--rl-border);
        border-radius: var(--rl-radius-md);
        background: transparent;
        color: var(--rl-text);
        font-size: 1.1rem;
        cursor: pointer;
      }

      .nav {
        display: none;
        flex-direction: column;
        gap: var(--rl-space-2);
        width: 100%;
        padding: var(--rl-space-4) 0;
      }

      .nav--open {
        display: flex;
      }

      .nav a:not(.rl-button),
      .nav button:not(.rl-button) {
        padding: var(--rl-space-3) 0;
        color: var(--rl-text-muted);
        text-decoration: none;
        font-weight: var(--rl-weight-medium);
      }

      .nav a.active {
        color: var(--rl-brand-700);
      }

      @media (min-width: 900px) {
        .toggle {
          display: none;
        }

        .nav {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: var(--rl-space-5);
          width: auto;
          padding: 0;
        }
      }
    `,
  ],
})
export class SiteHeaderComponent {
  readonly auth = inject(AuthService);
  readonly config = inject(PLATFORM_CONFIG);
  private readonly router = inject(Router);

  readonly routes = WEB_ROUTES;
  readonly menuOpen = signal(false);

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  logout(): void {
    this.closeMenu();
    this.auth.logout();
    void this.router.navigateByUrl(WEB_ROUTES.home);
  }
}
