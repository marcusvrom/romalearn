import { ChangeDetectionStrategy, Component, Input, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WEB_ROUTES } from '@romalearn/contracts';
import { PLATFORM_CONFIG } from '../../core/platform.config';
import { LogoComponent } from '../../shared/logo.component';

/** Moldura comum das telas de conta, para manter tudo consistente. */
@Component({
  selector: 'rl-auth-shell',
  standalone: true,
  imports: [RouterLink, LogoComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="wrapper">
      <div class="panel">
        <a class="brand" [routerLink]="routes.home"><rl-logo [size]="22" /> {{ config.name }}</a>
        <h1>{{ heading }}</h1>
        @if (subheading) {
          <p class="rl-muted">{{ subheading }}</p>
        }
        <ng-content />
      </div>

      <aside class="aside" aria-hidden="true">
        <blockquote>
          “Aprender é o começo. O valor profissional aparece quando você pratica, entrega, confere,
          explica e continua evoluindo.”
        </blockquote>
        <p>Módulo Extra Gratuito — Carreira Digital e Destaque Profissional</p>
      </aside>
    </div>
  `,
  styles: [
    `
      .wrapper {
        display: grid;
        min-height: calc(100vh - var(--rl-header-height));
      }

      @media (min-width: 960px) {
        .wrapper {
          grid-template-columns: 1fr 1fr;
        }
      }

      .panel {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: var(--rl-space-12) var(--rl-space-5);
        max-width: 480px;
        width: 100%;
        margin-inline: auto;
      }

      .brand {
        display: inline-flex;
        align-items: center;
        gap: var(--rl-space-2);
        font-family: var(--rl-font-display);
        letter-spacing: -0.02em;
        font-weight: var(--rl-weight-bold);
        text-decoration: none;
        color: var(--rl-brand-link);
        margin-bottom: var(--rl-space-8);
        display: inline-block;
      }

      h1 {
        font-size: var(--rl-text-2xl);
        margin-bottom: var(--rl-space-2);
      }

      .aside {
        display: none;
        flex-direction: column;
        justify-content: center;
        padding: var(--rl-space-16);
        background: linear-gradient(140deg, var(--rl-brand-700), var(--rl-brand-900));
        color: #fff;
      }

      @media (min-width: 960px) {
        .aside {
          display: flex;
        }
      }

      blockquote {
        margin: 0 0 var(--rl-space-5);
        font-size: var(--rl-text-xl);
        line-height: var(--rl-leading-snug);
      }

      .aside p {
        color: color-mix(in srgb, #fff 75%, transparent);
        font-size: var(--rl-text-sm);
        margin: 0;
      }
    `,
  ],
})
export class AuthShellComponent {
  @Input({ required: true }) heading!: string;
  @Input() subheading = '';

  readonly config = inject(PLATFORM_CONFIG);
  readonly routes = WEB_ROUTES;
}
