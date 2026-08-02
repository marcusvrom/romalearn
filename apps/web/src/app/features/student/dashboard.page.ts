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
import { LearningService } from '../../core/learning.service';
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
          <p class="rl-eyebrow">Minha área</p>
          <h1>Olá, {{ firstName() }}</h1>
          <p class="rl-lead">
            {{
              inProgress().length > 0
                ? 'Continue de onde você parou. Seu progresso fica salvo automaticamente.'
                : 'Escolha um curso para começar. Você pode estudar no seu ritmo.'
            }}
          </p>
        </div>

        <nav class="quick" aria-label="Atalhos">
          <a
            class="rl-button rl-button--secondary rl-button--small"
            [routerLink]="routes.certificates"
          >
            Certificados
          </a>
          <a
            class="rl-button rl-button--secondary rl-button--small"
            [routerLink]="routes.purchases"
          >
            Compras
          </a>
          <a class="rl-button rl-button--secondary rl-button--small" [routerLink]="routes.profile">
            Perfil
          </a>
        </nav>
      </header>

      @if (auth.needsEmailVerification()) {
        <rl-alert tone="warn" title="Confirme seu e-mail">
          Enviamos um link para {{ auth.user()?.email }}. Confirmar o e-mail ajuda a recuperar sua
          conta caso você esqueça a senha.
        </rl-alert>
      }

      @if (loading()) {
        <rl-loading label="Carregando seus cursos…" />
      }
      @if (!loading() && error(); as message) {
        <rl-alert tone="error" title="Não foi possível carregar seus cursos">{{
          message
        }}</rl-alert>
      }
      @if (!loading() && !error() && courses().length === 0) {
        <rl-empty
          title="Você ainda não tem cursos"
          description="Comece pelo módulo gratuito e conheça a trilha completa."
          icon="🎯"
        >
          <a class="rl-button rl-button--primary" [routerLink]="routes.catalog">Ver os cursos</a>
        </rl-empty>
      }
      @if (!loading() && !error() && courses().length > 0) {
        @if (inProgress().length > 0) {
          <section class="block">
            <h2>Em andamento</h2>
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
                    {{ item.progress.completedLessons }} de {{ item.progress.totalLessons }} aulas
                    concluídas
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
                    <ul class="pending">
                      @for (requirement of item.progress.pendingRequirements; track requirement) {
                        <li>{{ requirement }}</li>
                      }
                    </ul>
                  }

                  <a
                    class="rl-button rl-button--primary rl-button--block"
                    [routerLink]="routes.player(item.course.slug)"
                  >
                    {{ item.progress.percentage > 0 ? 'Continuar estudando' : 'Começar agora' }}
                  </a>
                </article>
              }
            </div>
          </section>
        }

        @if (completed().length > 0) {
          <section class="block">
            <h2>Cursos concluídos</h2>
            <div class="rl-grid rl-grid--2">
              @for (item of completed(); track item.enrollmentId) {
                <article class="rl-card course course--done">
                  <div class="course__head">
                    <h3>{{ item.course.title }}</h3>
                    <span class="rl-badge rl-badge--free">Concluído</span>
                  </div>
                  <p class="rl-small rl-muted">
                    Todas as {{ item.progress.totalLessons }} aulas concluídas.
                  </p>
                  <div class="course__actions">
                    <a
                      class="rl-button rl-button--secondary rl-button--small"
                      [routerLink]="routes.player(item.course.slug)"
                    >
                      Revisar conteúdo
                    </a>
                    <a
                      class="rl-button rl-button--primary rl-button--small"
                      [routerLink]="routes.certificates"
                    >
                      Ver certificado
                    </a>
                  </div>
                </article>
              }
            </div>
          </section>
        }
      }
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

      .quick {
        display: flex;
        flex-wrap: wrap;
        gap: var(--rl-space-2);
      }

      .block {
        margin-bottom: var(--rl-space-12);
      }

      .block h2 {
        font-size: var(--rl-text-xl);
        margin-bottom: var(--rl-space-5);
      }

      .course {
        display: flex;
        flex-direction: column;
        gap: var(--rl-space-4);
      }

      .course__head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: var(--rl-space-3);
      }

      .course__head h3 {
        font-size: var(--rl-text-lg);
        margin: 0;
      }

      .course__actions {
        display: flex;
        flex-wrap: wrap;
        gap: var(--rl-space-2);
      }

      .course p {
        margin: 0;
      }

      .pending {
        margin: 0;
        padding-left: var(--rl-space-5);
        font-size: var(--rl-text-sm);
        color: var(--rl-warn-text);
      }
    `,
  ],
})
export class DashboardPage implements OnInit {
  private readonly learning = inject(LearningService);
  private readonly seo = inject(SeoService);
  readonly auth = inject(AuthService);

  readonly routes = WEB_ROUTES;
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

  firstName(): string {
    return this.auth.user()?.name.split(' ')[0] ?? 'estudante';
  }

  ngOnInit(): void {
    this.seo.apply({
      title: 'Minha área',
      description: 'Seus cursos, progresso e certificados.',
      path: WEB_ROUTES.dashboard,
      noIndex: true,
    });

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
