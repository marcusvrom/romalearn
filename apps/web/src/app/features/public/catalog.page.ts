import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CourseSummaryDto, WEB_ROUTES } from '@romalearn/contracts';
import {
  AlertComponent,
  CourseCardComponent,
  EmptyStateComponent,
  LoadingStateComponent,
} from '@romalearn/ui';
import { CatalogService } from '../../core/catalog.service';
import { SeoService } from '../../core/seo.service';

type Filter = 'todos' | 'gratuitos' | 'pagos';

@Component({
  selector: 'rl-catalog-page',
  standalone: true,
  imports: [
    RouterLink,
    CourseCardComponent,
    LoadingStateComponent,
    EmptyStateComponent,
    AlertComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rl-container rl-section">
      <header class="head">
        <p class="rl-eyebrow">Catálogo</p>
        <h1>Todos os cursos</h1>
        <p class="rl-lead">
          Comece pelo módulo gratuito ou vá direto ao assunto que você precisa resolver. Todos os
          cursos são em português, com linguagem simples e atividades práticas.
        </p>
      </header>

      <div class="filters" role="group" aria-label="Filtrar cursos">
        @for (option of filters; track option.value) {
          <button
            type="button"
            class="rl-button rl-button--small"
            [class.rl-button--primary]="filter() === option.value"
            [class.rl-button--secondary]="filter() !== option.value"
            [attr.aria-pressed]="filter() === option.value"
            (click)="filter.set(option.value)"
          >
            {{ option.label }}
          </button>
        }
      </div>

      @if (loading()) {
        <rl-loading label="Carregando o catálogo…" />
      } @else if (error()) {
        <rl-alert tone="error" title="Não foi possível carregar os cursos">
          {{ error() }}
        </rl-alert>
      } @else if (visibleCourses().length === 0) {
        <rl-empty
          title="Nenhum curso nesta seleção"
          description="Experimente outro filtro para ver o que está disponível."
        />
      } @else {
        <div class="rl-grid rl-grid--3">
          @for (course of visibleCourses(); track course.id) {
            <rl-course-card [course]="course" [link]="routes.course(course.slug)" />
          }
        </div>
      }

      <aside class="rl-card banner">
        <div>
          <h2>Ainda não sabe por onde começar?</h2>
          <p class="rl-muted">
            O módulo gratuito mostra o caminho completo e ajuda a identificar sua maior lacuna.
          </p>
        </div>
        <a class="rl-button rl-button--primary" [routerLink]="routes.register">
          Começar de graça
        </a>
      </aside>
    </div>
  `,
  styles: [
    `
      .head {
        max-width: 62ch;
        margin-bottom: var(--rl-space-8);
      }

      .filters {
        display: flex;
        flex-wrap: wrap;
        gap: var(--rl-space-2);
        margin-bottom: var(--rl-space-8);
      }

      .banner {
        display: flex;
        flex-direction: column;
        gap: var(--rl-space-5);
        margin-top: var(--rl-space-12);
        background: var(--rl-brand-50);
        border-color: var(--rl-brand-300);
      }

      .banner h2 {
        font-size: var(--rl-text-xl);
        margin-bottom: var(--rl-space-2);
      }

      @media (min-width: 720px) {
        .banner {
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
        }
      }
    `,
  ],
})
export class CatalogPage implements OnInit {
  private readonly catalog = inject(CatalogService);
  private readonly seo = inject(SeoService);

  readonly routes = WEB_ROUTES;
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly courses = signal<CourseSummaryDto[]>([]);
  readonly filter = signal<Filter>('todos');

  readonly filters: { value: Filter; label: string }[] = [
    { value: 'todos', label: 'Todos' },
    { value: 'gratuitos', label: 'Gratuitos' },
    { value: 'pagos', label: 'Trilha paga' },
  ];

  readonly visibleCourses = computed(() => {
    const all = this.courses();
    switch (this.filter()) {
      case 'gratuitos':
        return all.filter((course) => course.isFree);
      case 'pagos':
        return all.filter((course) => !course.isFree);
      default:
        return all;
    }
  });

  ngOnInit(): void {
    this.seo.apply({
      title: 'Cursos',
      description:
        'Catálogo de cursos profissionalizantes em português: computador e Windows, Word, Excel, ' +
        'PowerPoint e inteligência artificial para rotinas administrativas.',
      path: '/cursos',
    });

    this.catalog.listCourses().subscribe({
      next: (courses) => {
        this.courses.set(courses);
        this.loading.set(false);
      },
      error: (err: { message: string }) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }
}
