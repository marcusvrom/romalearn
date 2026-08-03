import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CourseSummaryDto, ProgramSummaryDto, WEB_ROUTES } from '@romalearn/contracts';
import {
  AlertComponent,
  CourseCardComponent,
  EmptyStateComponent,
  LoadingStateComponent,
} from '@romalearn/ui';
import { CatalogService } from '../../core/catalog.service';
import { SeoService } from '../../core/seo.service';

type Filter = 'todos' | 'gratuitos' | 'pagos';

interface CatalogJourneyStage {
  stage: number;
  title: string;
  courseTitles: string[];
  isChoice: boolean;
}

interface CatalogJourney {
  program: ProgramSummaryDto;
  stages: CatalogJourneyStage[];
}

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
          Escolha uma jornada para seguir uma ordem recomendada ou vá direto ao assunto que precisa
          resolver. Todos os cursos são em português, com linguagem simples e atividades práticas.
        </p>
      </header>

      @if (catalogJourneys().length > 0) {
        <section class="journeys" aria-labelledby="journeys-title">
          <div class="section-head">
            <p class="rl-eyebrow">Ordem recomendada</p>
            <h2 id="journeys-title">Escolha a transformação que você quer viver</h2>
          </div>

          <div class="journeys__grid">
            @for (journey of catalogJourneys(); track journey.program.id) {
              <article class="rl-card journey">
                <h3>{{ journey.program.title }}</h3>
                <p class="rl-muted">{{ journey.program.shortDescription }}</p>
                <ol class="journey__steps">
                  @for (stage of journey.stages; track stage.stage) {
                    <li>
                      <span class="journey__stage">Etapa {{ stage.stage }}</span>
                      <strong>{{ stage.title }}</strong>
                      <span class="rl-small rl-muted">
                        {{ stage.courseTitles.join(stage.isChoice ? ' ou ' : ' + ') }}
                        @if (stage.isChoice) {
                          — escolha uma rota
                        }
                      </span>
                    </li>
                  }
                </ol>
                <a
                  class="rl-button rl-button--secondary"
                  [routerLink]="routes.program(journey.program.slug)"
                >
                  Ver jornada completa
                </a>
              </article>
            }
          </div>
        </section>
      }

      <div class="section-head courses-head">
        <p class="rl-eyebrow">Cursos avulsos</p>
        <h2>Explore por assunto</h2>
      </div>

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
            Os cursos gratuitos ajudam a escolher uma jornada e já produzem sua primeira evidência.
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

      .journeys {
        margin-bottom: var(--rl-space-12);
      }

      .journeys__grid {
        display: grid;
        gap: var(--rl-space-5);
      }

      @media (min-width: 960px) {
        .journeys__grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      .journey {
        display: flex;
        flex-direction: column;
        gap: var(--rl-space-4);
      }

      .journey__steps {
        display: grid;
        gap: var(--rl-space-3);
        margin: 0;
        padding: 0;
        list-style: none;
      }

      .journey__steps li {
        display: grid;
        gap: var(--rl-space-1);
        border-left: 2px solid var(--rl-brand-300);
        padding-left: var(--rl-space-3);
      }

      .journey__stage {
        color: var(--rl-accent-text);
        font-size: var(--rl-text-xs);
        font-weight: var(--rl-weight-bold);
        letter-spacing: 0.04em;
        text-transform: uppercase;
      }

      .journey .rl-button {
        align-self: flex-start;
        margin-top: auto;
      }

      .courses-head {
        margin-bottom: var(--rl-space-4);
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
  readonly programs = signal<ProgramSummaryDto[]>([]);
  readonly filter = signal<Filter>('todos');

  readonly filters: { value: Filter; label: string }[] = [
    { value: 'todos', label: 'Todos' },
    { value: 'gratuitos', label: 'Gratuitos' },
    { value: 'pagos', label: 'Pagos' },
  ];

  readonly catalogJourneys = computed<CatalogJourney[]>(() =>
    this.programs().map((program) => {
      const stages = new Map<number, CatalogJourneyStage>();

      for (const course of program.courses) {
        const stageNumber = course.stage > 0 ? course.stage : course.order + 1;
        const current = stages.get(stageNumber) ?? {
          stage: stageNumber,
          title: course.stageTitle || `Etapa ${stageNumber}`,
          courseTitles: [],
          isChoice: false,
        };
        current.courseTitles.push(course.title);
        current.isChoice ||= Boolean(!course.isRequired && course.alternativeGroup);
        stages.set(stageNumber, current);
      }

      return {
        program,
        stages: [...stages.values()].sort((left, right) => left.stage - right.stage),
      };
    }),
  );

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
        'Catálogo de cursos profissionalizantes em português: competências digitais, produtividade ' +
        'administrativa e desenvolvimento de software com projetos práticos.',
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

    this.catalog.listPrograms().subscribe({
      next: (programs) => this.programs.set(programs),
      error: () => this.programs.set([]),
    });
  }
}
