import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WEB_ROUTES } from '@romalearn/contracts';
import { PLATFORM_CONFIG } from '../core/platform.config';
import { LogoComponent } from './logo.component';

@Component({
  selector: 'rl-site-footer',
  standalone: true,
  imports: [RouterLink, LogoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="footer">
      <div class="rl-container grid">
        <div>
          <p class="brand"><rl-logo [size]="22" /> {{ config.name }}</p>
          <p class="rl-small rl-muted">{{ config.tagline }}</p>
          <p class="rl-small rl-muted">
            Materiais didáticos em português, com linguagem simples e prática guiada.
          </p>
        </div>

        <nav aria-label="Conteúdo">
          <h2>Conteúdo</h2>
          <ul>
            <li><a [routerLink]="routes.catalog">Todos os cursos</a></li>
            <li><a [routerLink]="['/']" fragment="modulo-gratuito">Módulo gratuito</a></li>
            <li><a [routerLink]="['/']" fragment="trilha">Trilha completa</a></li>
            <li><a [routerLink]="['/']" fragment="certificados">Certificados</a></li>
          </ul>
        </nav>

        <nav aria-label="Conta">
          <h2>Conta</h2>
          <ul>
            <li><a [routerLink]="routes.login">Entrar</a></li>
            <li><a [routerLink]="routes.register">Criar conta</a></li>
            <li><a [routerLink]="routes.forgotPassword">Recuperar senha</a></li>
          </ul>
        </nav>

        <nav aria-label="Institucional">
          <h2>Institucional</h2>
          <ul>
            <li><a [routerLink]="routes.terms">Termos de Uso</a></li>
            <li><a [routerLink]="routes.privacy">Política de Privacidade</a></li>
            <li><a [routerLink]="routes.support">Suporte</a></li>
            <li>
              <a [href]="'mailto:' + config.supportEmail">{{ config.supportEmail }}</a>
            </li>
          </ul>
        </nav>
      </div>

      <div class="rl-container bottom">
        <p class="rl-small rl-muted">
          © {{ year }} {{ config.legalName }}. Todos os direitos reservados.
        </p>
        <p class="rl-small rl-muted">
          Microsoft, Windows, Word, Excel e PowerPoint são marcas da Microsoft Corporation. Este
          material é independente e não possui vínculo com a Microsoft.
        </p>
      </div>
    </footer>
  `,
  styles: [
    `
      .footer {
        background: var(--rl-surface-muted);
        border-top: 1px solid var(--rl-border);
        padding-top: var(--rl-space-12);
        margin-top: var(--rl-space-16);
      }

      .grid {
        display: grid;
        gap: var(--rl-space-8);
      }

      @media (min-width: 720px) {
        .grid {
          grid-template-columns: 1.6fr repeat(3, 1fr);
        }
      }

      .brand {
        display: inline-flex;
        align-items: center;
        gap: var(--rl-space-2);
        font-family: var(--rl-font-display);
        letter-spacing: -0.02em;
        font-weight: var(--rl-weight-bold);
        font-size: var(--rl-text-lg);
        margin-bottom: var(--rl-space-2);
      }

      h2 {
        font-size: var(--rl-text-sm);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--rl-text-subtle);
        margin-bottom: var(--rl-space-3);
      }

      ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      li + li {
        margin-top: var(--rl-space-2);
      }

      li a {
        color: var(--rl-text-muted);
        text-decoration: none;
        font-size: var(--rl-text-sm);
      }

      li a:hover {
        color: var(--rl-brand-link);
        text-decoration: underline;
      }

      .bottom {
        margin-top: var(--rl-space-10);
        padding-block: var(--rl-space-5);
        border-top: 1px solid var(--rl-border);
      }

      .bottom p {
        margin-bottom: var(--rl-space-2);
      }
    `,
  ],
})
export class SiteFooterComponent {
  readonly config = inject(PLATFORM_CONFIG);
  readonly routes = WEB_ROUTES;
  readonly year = new Date().getFullYear();
}
