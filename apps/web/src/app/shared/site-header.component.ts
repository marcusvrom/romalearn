import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { WEB_ROUTES } from '@romalearn/contracts';
import { filter } from 'rxjs/operators';
import { AuthService } from '../core/auth.service';
import { PLATFORM_CONFIG } from '../core/platform.config';
import { ThemeToggleComponent } from './theme-toggle.component';

/**
 * Cabeçalho do site.
 *
 * No celular o menu é uma gaveta: cobre o conteúdo, prende o foco enquanto
 * está aberta e fecha com Escape, com o véu ou ao navegar. O menu anterior
 * empurrava a página para baixo e deixava o foco vazar para links fora da
 * tela.
 */
@Component({
  selector: 'rl-site-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ThemeToggleComponent],
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
          #botaoMenu
          [attr.aria-expanded]="menuOpen()"
          aria-controls="menu-principal"
          (click)="toggleMenu()"
        >
          <span class="rl-visually-hidden">{{ menuOpen() ? 'Fechar menu' : 'Abrir menu' }}</span>
          <span class="toggle__bars" [class.toggle__bars--open]="menuOpen()" aria-hidden="true">
            <span></span><span></span><span></span>
          </span>
        </button>

        <!--
          O véu só existe com a gaveta aberta; clicar nele fecha.

          É um atalho de ponteiro, não um controle: quem usa teclado fecha com
          Escape e quem usa leitor de tela fecha pelo próprio botão do menu,
          que continua alcançável por cima da gaveta. Torná-lo focável só
          acrescentaria uma parada de tabulação sem rótulo no meio do menu,
          então ele fica fora da árvore de acessibilidade.
        -->
        @if (menuOpen()) {
          <div class="scrim" aria-hidden="true" (click)="closeMenu()"></div>
        }

        <nav
          id="menu-principal"
          class="nav"
          #gaveta
          [class.nav--open]="menuOpen()"
          aria-label="Principal"
        >
          <a [routerLink]="routes.catalog" routerLinkActive="active" (click)="closeMenu()">
            Cursos
          </a>
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

          <!--
            O seletor de tema vive dentro do menu: no celular a gaveta cobre a
            barra inteira, e um seletor ali atrás seria inalcançável. No
            computador o menu é a própria barra, então ele aparece à direita,
            depois dos links — que é onde se espera encontrá-lo.
          -->
          <div class="nav__tema">
            <rl-theme-toggle />
          </div>
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
        border-bottom: 1px solid var(--rl-border);
      }

      /*
       * O desfoque fica numa camada própria, e não no cabeçalho.
       *
       * A propriedade backdrop-filter transforma o elemento em bloco de
       * contenção de tudo que é position: fixed lá dentro. Aplicada ao
       * cabeçalho, ela prendia a gaveta e o véu à faixa de 68px da barra: a
       * gaveta virava um toco no topo e o véu não cobria a página. Num
       * pseudo-elemento o efeito é o mesmo aos olhos e a gaveta volta a se
       * medir pela janela.
       */
      .header::before {
        content: '';
        position: absolute;
        inset: 0;
        z-index: -1;
        background: color-mix(in srgb, var(--rl-surface) 88%, transparent);
        backdrop-filter: blur(12px);
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
        /*
         * Acima da gaveta (z-index 2): o mesmo botão abre e fecha, e ele
         * precisa continuar alcançável com a gaveta aberta — senão o único
         * jeito de sair seria o véu ou o Escape.
         */
        position: relative;
        z-index: 3;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 44px;
        height: 44px;
        border: 1px solid var(--rl-border);
        border-radius: var(--rl-radius-md);
        background: transparent;
        color: var(--rl-text);
        cursor: pointer;
      }

      /* Três traços que viram um X — o mesmo desenho nos dois estados. */
      .toggle__bars {
        display: grid;
        gap: 4px;
        width: 18px;

        span {
          display: block;
          height: 2px;
          border-radius: 2px;
          background: currentColor;
          transition:
            transform var(--rl-transition-base) var(--rl-ease-out),
            opacity var(--rl-transition-fast);
        }
      }

      .toggle__bars--open span:nth-child(1) {
        transform: translateY(6px) rotate(45deg);
      }
      .toggle__bars--open span:nth-child(2) {
        opacity: 0;
      }
      .toggle__bars--open span:nth-child(3) {
        transform: translateY(-6px) rotate(-45deg);
      }

      .scrim {
        position: fixed;
        inset: 0;
        z-index: 1;
        background: var(--rl-scrim);
        animation: aparecer var(--rl-transition-base) var(--rl-ease-out);
      }

      @keyframes aparecer {
        from {
          opacity: 0;
        }
      }

      /* ----- Gaveta (celular) ----- */
      .nav {
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 2;
        display: flex;
        flex-direction: column;
        gap: var(--rl-space-2);
        width: min(320px, 84vw);
        padding: calc(var(--rl-header-height) + var(--rl-space-4)) var(--rl-space-5)
          var(--rl-space-8);
        overflow-y: auto;
        background: var(--rl-surface-raised);
        border-left: 1px solid var(--rl-border);
        box-shadow: var(--rl-shadow-lg);
        transform: translateX(100%);
        /*
         * A visibilidade some junto com a gaveta: sem isso os links continuam
         * na ordem do Tab mesmo fora da tela. A transição a segura até o fim
         * do deslize para não cortar a animação.
         */
        visibility: hidden;
        transition:
          transform var(--rl-transition-slow) var(--rl-ease-out),
          visibility var(--rl-transition-slow);
      }

      .nav--open {
        transform: translateX(0);
        visibility: visible;
      }

      .nav a:not(.rl-button),
      .nav button:not(.rl-button) {
        padding: var(--rl-space-3) 0;
        color: var(--rl-text-muted);
        text-decoration: none;
        font-weight: var(--rl-weight-medium);
      }

      .nav a.active {
        color: var(--rl-brand-link);
      }

      /* Na gaveta os botões ocupam a largura toda. */
      .nav .rl-button {
        justify-content: center;
        width: 100%;
        margin-top: var(--rl-space-2);
      }

      /* Na gaveta o seletor de tema fecha a lista, separado por um fio. */
      .nav__tema {
        margin-top: var(--rl-space-6);
        padding-top: var(--rl-space-5);
        border-top: 1px solid var(--rl-border);
      }

      @media (min-width: 900px) {
        .toggle,
        .scrim {
          display: none;
        }

        .nav {
          position: static;
          z-index: auto;
          flex-direction: row;
          align-items: center;
          gap: var(--rl-space-5);
          width: auto;
          padding: 0;
          overflow: visible;
          background: none;
          border: 0;
          box-shadow: none;
          transform: none;
          visibility: visible;
          transition: none;
        }

        .nav .rl-button {
          width: auto;
          margin-top: 0;
        }

        .nav__tema {
          margin-top: 0;
          padding-top: 0;
          border-top: 0;
        }
      }
    `,
  ],
})
export class SiteHeaderComponent implements OnDestroy {
  readonly auth = inject(AuthService);
  readonly config = inject(PLATFORM_CONFIG);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);

  private readonly gaveta = viewChild.required<ElementRef<HTMLElement>>('gaveta');
  private readonly botaoMenu = viewChild.required<ElementRef<HTMLButtonElement>>('botaoMenu');

  readonly routes = WEB_ROUTES;
  readonly menuOpen = signal(false);

  constructor() {
    // Cada link já fecha a gaveta no clique, mas voltar pelo botão do
    // navegador também precisa fechar — senão ela fica aberta sobre a página
    // nova.
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => this.closeMenu());
  }

  ngOnDestroy(): void {
    this.releaseScroll();
  }

  toggleMenu(): void {
    if (this.menuOpen()) this.closeMenu();
    else this.openMenu();
  }

  openMenu(): void {
    this.menuOpen.set(true);
    // A página atrás da gaveta não deve rolar junto.
    this.document.body.style.overflow = 'hidden';
    // O foco só entra depois que a gaveta deixa de estar `hidden`.
    setTimeout(() => this.focusables()[0]?.focus(), 0);
  }

  closeMenu(): void {
    if (!this.menuOpen()) return;
    this.menuOpen.set(false);
    this.releaseScroll();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (!this.menuOpen()) return;
    this.closeMenu();
    // O foco volta para o botão que abriu, não para o topo da página.
    this.botaoMenu().nativeElement.focus();
  }

  /**
   * Prende o foco dentro da gaveta.
   *
   * Sem isto o Tab passa por baixo do véu e chega a links que o aluno não
   * consegue ver — um caminho sem volta para quem navega por teclado.
   */
  @HostListener('document:keydown.tab', ['$event'])
  @HostListener('document:keydown.shift.tab', ['$event'])
  onTab(event: Event): void {
    if (!this.menuOpen() || !this.isDrawerLayout()) return;
    if (!(event instanceof KeyboardEvent)) return;

    const focusables = this.focusables();
    if (focusables.length === 0) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = this.document.activeElement;

    if (event.shiftKey && (active === first || active === this.botaoMenu().nativeElement)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && active === last) {
      event.preventDefault();
      first.focus();
    }
  }

  logout(): void {
    this.closeMenu();
    this.auth.logout();
    void this.router.navigateByUrl(WEB_ROUTES.home);
  }

  /** Acima de 900px a gaveta vira barra comum e não há foco a prender. */
  private isDrawerLayout(): boolean {
    const view = this.document.defaultView;
    return view ? !view.matchMedia('(min-width: 900px)').matches : false;
  }

  private focusables(): HTMLElement[] {
    return Array.from(
      this.gaveta().nativeElement.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
    );
  }

  private releaseScroll(): void {
    this.document.body.style.removeProperty('overflow');
  }
}
