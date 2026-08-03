import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './core/auth.service';
import { SiteFooterComponent } from './shared/site-footer.component';
import { SiteHeaderComponent } from './shared/site-header.component';
import { SupportAssistantComponent } from './shared/support-assistant.component';

/**
 * Casca da aplicação.
 *
 * O cabeçalho e o rodapé do site somem no player e no painel administrativo,
 * que têm layout próprio e precisam da tela inteira. O assistente de suporte
 * permanece disponível em toda a jornada pública e do aluno, mas não aparece
 * no backoffice para não competir com as ferramentas operacionais.
 */
@Component({
  selector: 'rl-root',
  standalone: true,
  imports: [RouterOutlet, SiteHeaderComponent, SiteFooterComponent, SupportAssistantComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="rl-skip-link" href="#conteudo-principal">Pular para o conteúdo</a>

    @if (showChrome) {
      <rl-site-header />
    }

    <main id="conteudo-principal" tabindex="-1">
      <router-outlet />
    </main>

    @if (showChrome) {
      <rl-site-footer />
    }

    @if (showSupport) {
      <rl-support-assistant />
    }
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }

      main {
        flex: 1;
      }

      main:focus {
        outline: none;
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);

  showChrome = true;
  showSupport = true;

  ngOnInit(): void {
    this.auth.loadSession().subscribe();

    this.updateChrome(this.router.url);
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.updateChrome(event.urlAfterRedirects));
  }

  private updateChrome(url: string): void {
    const isPlayer = /^\/painel\/cursos\//.test(url);
    const isAdmin = url.startsWith('/admin');
    this.showChrome = !isPlayer && !isAdmin;
    this.showSupport = !isAdmin;
  }
}
