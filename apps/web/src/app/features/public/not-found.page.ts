import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WEB_ROUTES } from '@romalearn/contracts';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'rl-not-found-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rl-container rl-container--narrow rl-section wrapper">
      <p class="code" aria-hidden="true">404</p>
      <h1>Não encontramos esta página</h1>
      <p class="rl-lead">
        O endereço pode ter mudado ou o conteúdo pode ter saído do ar. Que tal recomeçar por aqui?
      </p>
      <div class="actions">
        <a class="rl-button rl-button--primary" [routerLink]="routes.home">Ir para o início</a>
        <a class="rl-button rl-button--secondary" [routerLink]="routes.catalog">Ver os cursos</a>
      </div>
    </div>
  `,
  styles: [
    `
      .wrapper {
        text-align: center;
      }

      .code {
        font-size: 4rem;
        font-weight: var(--rl-weight-bold);
        color: var(--rl-brand-300);
        margin-bottom: var(--rl-space-2);
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: var(--rl-space-3);
        justify-content: center;
        margin-top: var(--rl-space-8);
      }
    `,
  ],
})
export class NotFoundPage implements OnInit {
  private readonly seo = inject(SeoService);
  readonly routes = WEB_ROUTES;

  ngOnInit(): void {
    this.seo.apply({
      title: 'Página não encontrada',
      description: 'A página que você procura não existe ou foi movida.',
      path: '/404',
      noIndex: true,
    });
  }
}
