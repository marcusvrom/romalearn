import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { EnrolledCourseDto, EnrollmentStatus, WEB_ROUTES } from '@romalearn/contracts';
import {
  AlertComponent,
  EmptyStateComponent,
  LoadingStateComponent,
  ProgressBarComponent,
} from '@romalearn/ui';
import { AuthService } from '../../core/auth.service';
import { formatDateTime } from '../../core/format';
import { LEARNING_PATHS } from '../../core/learning-paths.config';
import { LearningService } from '../../core/learning.service';
import { ProductAnalyticsService } from '../../core/product-analytics.service';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'rl-dashboard-page',
  standalone: true,
  imports: [
    RouterLink,
    LoadingStateComponent,
    EmptyStateComponent,
    AlertComponent,
    ProgressBarComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rl-container rl-section">
      <header class="head">
        <div>
          <p class="rl-eyebrow">Minha jornada</p>
          <h1>Olá, {{ firstName() }}</h1>
          <p class="rl-lead">
            {{
              inProgress().length > 0
                ? 'Você não precisa decidir tudo de novo. Continue pela próxima melhor ação.'
                : 'Escolha um objetivo e comece por uma etapa pequena. Seu progresso fica salvo.'
            }}
          </p>
        </div>

        <nav class="quick" aria-label="Atalhos">
          <a class="rl-button rl-button--secondary rl-button--small" [routerLink]="routes.certificates">
            Certificados
          </a>
          <a class="rl-button rl-button--secondary rl-button--small" [routerLink]="routes.purchases">
            Compras
          </a>
          <a class="rl-button rl-button--secondary rl-button--small" [routerLink]="routes.profile">
            Perfil
          </a>
        </nav>
      </header>

      @if (auth.needsEmailVerification()) {
        <rl-alert tone="warn" title="Confirme seu e-mail">
          Enviamos um link para {{ auth.user()?.email }}. Confirmar o e-mail ajuda a recuperar sua conta.
        </rl-alert>
      }

      @if (loading()) {
        <rl-loading label="Carregando sua jornada…" />
      }

      @if (!loading() && error(); as message) {
        <rl-alert tone="error" title="Não foi possível carregar seus cursos">{{ message }}</rl-alert>
      }

      @if (!loading() && !error() && recommendedCourse(); as item) {
        <section class="next-action" aria-labelledby="next-action-title">
          <div class="next-action__content">
            <p class="rl-eyebrow">Próxima melhor ação</p>
            <h2 id="next-action-title">Continue {{ item.course.title }}</h2>
            <p class="rl-muted">
              @if (item.lastAccessedLesson; as last) {
                Próxima retomada: <strong>{{ last.title }}</strong>.
              } @else {
                Comece pela primeira aula e avance no seu ritmo.
              }
            </p>
            <rl-progress-bar [value]="item.progress.percentage" label="Progresso do curso" />
            <p class="rl-small rl-muted">
              {{ item.progress.completedLessons }} de {{ item.progress.totalLessons }} aulas concluídas ·
              {{ item.progress.percentage }}%
            </p>
          </div>

          <a
            class="rl-button rl-button--primary rl-button--lg"
            [routerLink]="routes.player(item.course.slug)"
            (click)="trackContinue(item)"
          >
            {{ item.progress.percentage > 0 ? 'Continuar de onde parei' : 'Começar agora' }}
          </a>
        </section>
      }

      @if (!loading() && !error() && courses().length === 0) {
        <rl-empty
          title="Sua jornada começa com uma pequena etapa"
          description="Comece pelo módulo gratuito para definir seus objetivos e conhecer a metodologia."
          icon="🎯"
        >
          <a class="rl-button rl-button--primary" [routerLink]="routes.catalog">Começar gratuitamente</a>
        </rl-empty>
      }

      @if (!loading() && !error() && courses().length > 0) {
        @if (inProgress().length > 0) {
          <section class="block">
            <div class="section-title">
              <div>
                <p class="rl-eyebrow">Seus estudos</p>
                <h2>Cursos em andamento</h2>
              </div>
              <p class="rl-small rl-muted">Escolha outro curso apenas quando fizer sentido para seu objetivo.</p>
            </div>

            <div class="rl-grid rl-grid--2">
              @for (item of inProgress(); track item.enrollmentId) {
                <article class="rl-card course">
                  <div class="course__head">
                    <h3>{{ item.course.title }}</h3>
                    @if (item.course.isFree) {
                      <span class="rl-badge rl-badge--free">Gratuito</span>
                    }
                  </div>

                  <rl-progress-bar [value]="item.progress.percentage" label="Progresso do curso" />

                  <p class="rl-small rl-muted">
                    {{ item.progress.completedLessons }} de {{ item.progress.totalLessons }} aulas concluídas
                  </p>

                  @if (item.lastAccessedLesson; as last) {
                    <p class="rl-small rl-muted">
                      Última aula: <strong>{{ last.title }}</strong>
                      @if (item.lastAccessedAt) {
                        · {{ formatDateTime(item.lastAccessedAt) }}
                      }
                    </p>
                  }

                  @if (item.progress.pendingRequirements.length > 0) {
                    <div class="pending-box">
                      <strong>Para concluir:</strong>
                      <ul class="pending">
                        @for (requirement of item.progress.pendingRequirements; track requirement) {
                          <li>{{ requirement }}</li>
                        }
                      </ul>
                    </div>
                  }

                  <a
                    class="rl-button rl-button--secondary rl-button--block"
                    [routerLink]="routes.player(item.course.slug)"
                    (click)="trackContinue(item)"
                  >
                    Ver detalhes do curso
                  </a>
                </article>
              }
            </div>
          </section>
        }

        @if (completed().length > 0) {
          <section class="block">
            <div class="section-title">
              <div>
                <p class="rl-eyebrow">Conquistas</p>
                <h2>Cursos concluídos</h2>
              </div>
              <p class="rl-small rl-muted">Revise o conteúdo e reúna certificados e projetos como evidências.</p>
            </div>

            <div class="rl-grid rl-grid--2">
              @for (item of completed(); track item.enrollmentId) {
                <article class="rl-card course course--done">
                  <div class="course__head">
                    <h3>{{ item.course.title }}</h3>
                    <span class="rl-badge rl-badge--free">Concluído</span>
                  </div>
                  <p class="rl-small rl-muted">Todas as {{ item.progress.totalLessons }} aulas concluídas.</p>
                  <div class="course__actions">
                    <a class="rl-button rl-button--secondary rl-button--small" [routerLink]="routes.player(item.course.slug)">
                      Revisar conteúdo
                    </a>
                    <a class="rl-button rl-button--primary rl-button--small" [routerLink]="routes.certificates">
                      Ver certificado
                    </a>
                  </div>
                </article>
              }
            </div>
          </section>
        }
      }

      <section class="block paths" aria-labelledby="paths-title">
        <div class="section-title">
          <div>
            <p class="rl-eyebrow">Cresça sem se perder</p>
            <h2 id="paths-title">Áreas de aprendizagem da RomaLearn</h2>
          </div>
          <p class="rl-small rl-muted">O catálogo crescerá por objetivos profissionais, não como uma lista solta de cursos.</p>
        </div>

        <div class="rl-grid rl-grid--3">
          @for (path of learningPaths; track path.id) {
            <article class="rl-card path">
              <div class="path__top">
                <span class="path__icon" aria-hidden="true">{{ path.icon }}</span>
                <span class="rl-badge" [class.rl-badge--free]="path.status === 'AVAILABLE'">
                  {{ path.status === 'AVAILABLE' ? 'Disponível' : 'Planejado' }}
                </span>
              </div>
              <h3>{{ path.title }}</h3>
              <p class="rl-small rl-muted">{{ path.shortDescription }}</p>
              <p class="rl-small"><strong>Resultado:</strong> {{ path.outcome }}</p>
              <ul class="topics">
                @for (topic of path.courseTopics.slice(0, 4); track topic) {
                  <li>{{ topic }}</li>
                }
              </ul>
              @if (path.status === 'AVAILABLE') {
                <a class="rl-button rl-button--secondary rl-button--block" [routerLink]="routes.catalog">
                  Explorar cursos
                </a>
              } @else {
                <p class="rl-small rl-muted path__note">Em breve: cursos serão liberados de forma progressiva.</p>
              }
            </article>
          }
        </div>
      </section>
    </div>
  `,
  styles: [
    `
      .head {
        display: flex;
        flex-direction: column;
        gap: var(--rl-space-5);
        margin-bottom: var(--rl-space-8);
      }

      @media (min-width: 860px) {
        .head {
          flex-direction: row;
          align-items: flex-start;
          justify-content: space-between;
        }
      }

      .quick,
      .course__actions {
        display: flex;
        flex-wrap: wrap;
        gap: var(--rl-space-2);
      }

      .next-action {
        display: grid;
        gap: var(--rl-space-6);
        align-items: center;
        padding: var(--rl-space-7);
        margin-bottom: var(--rl-space-12);
        border: 1px solid var(--rl-brand-border);
        border-radius: var(--rl-radius-xl);
        background: var(--rl-brand-soft);
      }

      @media (min-width: 860px) {
        .next-action {
          grid-template-columns: minmax(0, 1fr) auto;
        }
      }

      .next-action h2,
      .next-action p {
        margin-top: 0;
      }

      .next-action__content {
        display: grid;
        gap: var(--rl-space-3);
      }

      .block {
        margin-bottom: var(--rl-space-12);
      }

      .section-title {
        display: flex;
        flex-direction: column;
        gap: var(--rl-space-2);
        margin-bottom: var(--rl-space-5);
      }

      @media (min-width: 860px) {
        .section-title {
          flex-direction: row;
          align-items: end;
          justify-content: space-between;
        }
      }

      .section-title h2,
      .section-title p {
        margin: 0;
      }

      .course,
      .path {
        display: flex;
        flex-direction: column;
        gap: var(--rl-space-4);
      }

      .course__head,
      .path__top {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: var(--rl-space-3);
      }

      .course__head h3,
      .path h3,
      .course p,
      .path p {
        margin: 0;
      }

      .pending-box {
        padding: var(--rl-space-3);
        border-radius: var(--rl-radius-md);
        background: var(--rl-warn-soft);
        color: var(--rl-warn-text);
        font-size: var(--rl-text-sm);
      }

      .pending,
      .topics {
        margin: var(--rl-space-2) 0 0;
        padding-left: var(--rl-space-5);
      }

      .path__icon {
        font-size: 2rem;
      }

      .path__note {
        margin-top: auto !important;
      }

      .paths {
        padding-top: var(--rl-space-4);
        border-top: 1px solid var(--rl-border);
      }
    `,
  ],
})
export class DashboardPage implements OnInit {
  private readonly learning = inject(LearningService);
  private readonly seo = inject(SeoService);
  private readonly analytics = inject(ProductAnalyticsService);
  readonly auth = inject(AuthService);

  readonly routes = WEB_ROUTES;
  readonly learningPaths = LEARNING_PATHS;
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly courses = signal<EnrolledCourseDto[]>([]);
  readonly formatDateTime = formatDateTime;

  readonly inProgress = computed(() =>
    this.courses().filter((item) => item.progress.status !== EnrollmentStatus.COMPLETED),
  );

  readonly completed = computed(() =>
    this.courses().filter((item) => item.progress.status === EnrollmentStatus.COMPLETED),
  );

  readonly recommendedCourse = computed(() => {
    const courses = this.inProgress();
    if (courses.length === 0) return null;

    return [...courses].sort((a, b) => {
      const aTime = a.lastAccessedAt ? new Date(a.lastAccessedAt).getTime() : 0;
      const bTime = b.lastAccessedAt ? new Date(b.lastAccessedAt).getTime() : 0;
      return bTime - aTime;
    })[0];
  });

  firstName(): string {
    return this.auth.user()?.name.split(' ')[0] ?? 'estudante';
  }

  trackContinue(item: EnrolledCourseDto): void {
    this.analytics.track({
      name: 'continue_learning_clicked',
      properties: {
        courseId: item.course.id,
        courseSlug: item.course.slug,
        progressPercentage: item.progress.percentage,
      },
    });
  }

  ngOnInit(): void {
    this.seo.apply({
      title: 'Minha jornada',
      description: 'Sua próxima aula, progresso, conquistas e caminhos de aprendizagem.',
      path: WEB_ROUTES.dashboard,
      noIndex: true,
    });

    this.analytics.track({ name: 'dashboard_viewed' });

    this.learning.myCourses().subscribe({
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
