import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ProductDto, ProgramSummaryDto, WEB_ROUTES } from '@romalearn/contracts';
import { AlertComponent, CourseCardComponent, LoadingStateComponent } from '@romalearn/ui';
import { AuthService } from '../../core/auth.service';
import { CatalogService } from '../../core/catalog.service';
import { formatCurrency } from '../../core/format';
import { SeoService } from '../../core/seo.service';

/** Página comercial da trilha completa. */
@Component({
  selector: 'rl-program-page',
  standalone: true,
  imports: [RouterLink, CourseCardComponent, LoadingStateComponent, AlertComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading()) {
      <div class="rl-container rl-section"><rl-loading label="Carregando a trilha…" /></div>
    }
    @if (!loading() && error()) {
      <div class="rl-container rl-section">
        <rl-alert tone="error" title="Trilha não encontrada">{{ error() }}</rl-alert>
        <a class="rl-button rl-button--secondary" [routerLink]="routes.catalog">Ver os cursos</a>
      </div>
    }
    @if (!loading() && !error() && program(); as program) {
      <header class="head">
        <div class="rl-container head__inner">
          <div>
            <p class="rl-eyebrow">Trilha completa</p>
            <h1>{{ program.title }}</h1>
            <p class="rl-lead">{{ program.shortDescription }}</p>

            <div class="badges">
              <span class="rl-badge rl-badge--brand">{{ program.courses.length }} módulos</span>
              <span class="rl-badge">{{ program.totalWorkloadHours }} horas</span>
              <span class="rl-badge">Acesso vitalício</span>
            </div>
          </div>

          <aside class="rl-card buy">
            @if (offer(); as offer) {
              <p class="buy__label">Investimento</p>
              <p class="buy__price">{{ formatCurrency(offer.priceCents, offer.currency) }}</p>
              @if (offer.installmentsAllowed > 1) {
                <p class="rl-small rl-muted">
                  em até {{ offer.installmentsAllowed }}x, conforme o meio de pagamento
                </p>
              }
              @if (offer.environment === 'SANDBOX') {
                <p class="rl-small sandbox">
                  Preço de demonstração (ambiente de testes). Nenhuma cobrança real é feita.
                </p>
              }
              <button
                type="button"
                class="rl-button rl-button--primary rl-button--block"
                (click)="buy()"
              >
                Comprar a trilha
              </button>
            } @else {
              <p class="buy__label">Em breve</p>
              <p class="rl-small rl-muted">
                A trilha ainda não está disponível para compra. Comece pelo módulo gratuito.
              </p>
            }
            <a
              class="rl-button rl-button--secondary rl-button--block"
              [routerLink]="routes.register"
            >
              Começar pelo módulo gratuito
            </a>
          </aside>
        </div>
      </header>

      <div class="rl-container rl-section">
        @if (program.fullDescription) {
          <section class="block">
            <h2>Sobre a trilha</h2>
            @for (
              paragraph of program.fullDescription.split(
                '

'
              );
              track $index
            ) {
              <p class="rl-muted">{{ paragraph }}</p>
            }
          </section>
        }

        @if (program.objectives.length > 0) {
          <section class="block">
            <h2>O que você vai conquistar</h2>
            <ul class="checks">
              @for (objective of program.objectives; track objective) {
                <li>{{ objective }}</li>
              }
            </ul>
          </section>
        }

        <section class="block">
          <h2>Módulos incluídos</h2>
          <div class="rl-grid rl-grid--3">
            @for (course of program.courses; track course.id) {
              <rl-course-card [course]="course" [link]="routes.course(course.slug)" />
            }
          </div>
        </section>
      </div>
    }
  `,
  styles: [
    `
      .head {
        background: var(--rl-surface-muted);
        border-bottom: 1px solid var(--rl-border);
        padding-block: var(--rl-space-12);
      }

      .head__inner {
        display: grid;
        gap: var(--rl-space-8);
        align-items: start;
      }

      @media (min-width: 960px) {
        .head__inner {
          grid-template-columns: 1.7fr 1fr;
          gap: var(--rl-space-12);
        }
      }

      .badges {
        display: flex;
        flex-wrap: wrap;
        gap: var(--rl-space-2);
        margin-top: var(--rl-space-5);
      }

      .buy {
        display: flex;
        flex-direction: column;
        gap: var(--rl-space-3);
      }

      .buy__label {
        margin: 0;
        font-size: var(--rl-text-sm);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--rl-text-subtle);
      }

      .buy__price {
        margin: 0;
        font-size: var(--rl-text-3xl);
        font-weight: var(--rl-weight-bold);
      }

      .sandbox {
        margin: 0;
        color: var(--rl-warn-700);
        background: var(--rl-warn-100);
        padding: var(--rl-space-2) var(--rl-space-3);
        border-radius: var(--rl-radius-sm);
      }

      .block {
        margin-bottom: var(--rl-space-12);
      }

      .checks {
        list-style: none;
        margin: 0;
        padding: 0;

        li {
          position: relative;
          padding-left: var(--rl-space-6);
          margin-bottom: var(--rl-space-3);
          color: var(--rl-text-muted);
        }

        li::before {
          content: '✓';
          position: absolute;
          left: 0;
          color: var(--rl-accent-600);
          font-weight: var(--rl-weight-bold);
        }
      }
    `,
  ],
})
export class ProgramPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly catalog = inject(CatalogService);
  private readonly seo = inject(SeoService);
  private readonly auth = inject(AuthService);

  readonly routes = WEB_ROUTES;
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly program = signal<ProgramSummaryDto | null>(null);
  readonly offer = signal<ProductDto['offers'][number] | null>(null);
  readonly formatCurrency = formatCurrency;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (slug) this.load(slug);
    });
  }

  private load(slug: string): void {
    this.loading.set(true);

    this.catalog.findProgram(slug).subscribe({
      next: (program) => {
        this.program.set(program);
        this.loading.set(false);

        this.seo.apply({
          title: program.title,
          description: program.shortDescription,
          path: WEB_ROUTES.program(program.slug),
          type: 'article',
        });

        this.catalog.listProducts().subscribe({
          next: (products) => {
            const product = products.find((item) => item.programId === program.id);
            this.offer.set(product?.offers[0] ?? null);
          },
          error: () => this.offer.set(null),
        });
      },
      error: (err: { message: string }) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  buy(): void {
    const offer = this.offer();
    if (!offer) return;

    if (!this.auth.isAuthenticated()) {
      void this.router.navigate([WEB_ROUTES.login], {
        queryParams: { redirecionar: WEB_ROUTES.checkout(offer.id) },
      });
      return;
    }

    void this.router.navigateByUrl(WEB_ROUTES.checkout(offer.id));
  }
}
