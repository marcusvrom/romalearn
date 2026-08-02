import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CourseLevel, PublicationStatus } from '@romalearn/contracts';
import { AlertComponent, EmptyStateComponent, LoadingStateComponent } from '@romalearn/ui';
import { SeoService } from '../../../core/seo.service';
import { AdminCourse, AdminService } from '../admin.service';

const STATUS_LABEL: Record<string, string> = {
  DRAFT: 'Rascunho',
  PUBLISHED: 'Publicado',
  ARCHIVED: 'Arquivado',
};

@Component({
  selector: 'rl-admin-courses-page',
  standalone: true,
  imports: [FormsModule, RouterLink, LoadingStateComponent, EmptyStateComponent, AlertComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="head">
      <h1>Cursos</h1>
      <button
        type="button"
        class="rl-button rl-button--primary"
        (click)="showForm.set(!showForm())"
      >
        {{ showForm() ? 'Cancelar' : 'Novo curso' }}
      </button>
    </header>

    @if (feedback(); as message) {
      <rl-alert [tone]="message.tone">{{ message.message }}</rl-alert>
    }

    @if (showForm()) {
      <section class="rl-card form">
        <h2>Criar curso</h2>
        <p class="rl-small rl-muted">
          O curso nasce como rascunho. Depois de adicionar partes e aulas, use “Publicar”.
        </p>

        <div class="rl-field">
          <label class="rl-label" for="titulo">Título</label>
          <input id="titulo" class="rl-input" [(ngModel)]="draft.title" name="titulo" />
        </div>

        <div class="rl-field">
          <label class="rl-label" for="resumo">Descrição curta</label>
          <input id="resumo" class="rl-input" [(ngModel)]="draft.shortDescription" name="resumo" />
        </div>

        <div class="grid-2">
          <div class="rl-field">
            <label class="rl-label" for="carga">Carga horária (horas)</label>
            <input
              id="carga"
              type="number"
              min="0"
              class="rl-input"
              [(ngModel)]="draft.workloadHours"
              name="carga"
            />
          </div>

          <div class="rl-field">
            <label class="rl-label" for="nivel">Nível</label>
            <select id="nivel" class="rl-select" [(ngModel)]="draft.level" name="nivel">
              <option [value]="levels.BEGINNER">Iniciante</option>
              <option [value]="levels.INTERMEDIATE">Intermediário</option>
              <option [value]="levels.ADVANCED">Avançado</option>
              <option [value]="levels.PROGRESSIVE">Do iniciante ao avançado</option>
            </select>
          </div>
        </div>

        <label class="rl-checkbox">
          <input type="checkbox" [(ngModel)]="draft.isFree" name="gratuito" />
          <span>Curso gratuito (permite matrícula sem pagamento)</span>
        </label>

        <button
          type="button"
          class="rl-button rl-button--primary"
          [disabled]="saving()"
          (click)="create()"
        >
          {{ saving() ? 'Criando…' : 'Criar curso' }}
        </button>
      </section>
    }

    @if (loading()) {
      <rl-loading label="Carregando cursos…" />
    } @else if (courses().length === 0) {
      <rl-empty
        title="Nenhum curso cadastrado"
        description="Crie o primeiro curso da plataforma."
      />
    } @else {
      <div class="rl-table-scroll">
        <table class="table">
          <caption class="rl-visually-hidden">
            Cursos cadastrados
          </caption>
          <thead>
            <tr>
              <th scope="col">Curso</th>
              <th scope="col">Carga</th>
              <th scope="col">Tipo</th>
              <th scope="col">Situação</th>
              <th scope="col">Ações</th>
            </tr>
          </thead>
          <tbody>
            @for (course of courses(); track course.id) {
              <tr>
                <td>
                  <a [routerLink]="['/admin/cursos', course.id]">{{ course.title }}</a>
                  <span class="rl-small rl-muted block">{{ course.slug }}</span>
                </td>
                <td>{{ course.workloadHours }}h</td>
                <td>{{ course.isFree ? 'Gratuito' : 'Pago' }}</td>
                <td>
                  <span
                    class="rl-badge"
                    [class.rl-badge--free]="course.status === status.PUBLISHED"
                    [class.rl-badge--warn]="course.status === status.DRAFT"
                  >
                    {{ statusLabel[course.status] }}
                  </span>
                </td>
                <td class="actions">
                  <a
                    class="rl-button rl-button--secondary rl-button--small"
                    [routerLink]="['/admin/cursos', course.id]"
                  >
                    Editar
                  </a>
                  @if (course.status === status.PUBLISHED) {
                    <button
                      type="button"
                      class="rl-button rl-button--secondary rl-button--small"
                      (click)="unpublish(course)"
                    >
                      Despublicar
                    </button>
                  } @else {
                    <button
                      type="button"
                      class="rl-button rl-button--primary rl-button--small"
                      (click)="publish(course)"
                    >
                      Publicar
                    </button>
                  }
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
  styles: [
    `
      .head {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: space-between;
        gap: var(--rl-space-4);
        margin-bottom: var(--rl-space-6);
      }

      h1 {
        font-size: var(--rl-text-2xl);
        margin: 0;
      }

      .form {
        margin-bottom: var(--rl-space-6);
      }

      .form h2 {
        font-size: var(--rl-text-lg);
      }

      .grid-2 {
        display: grid;
        gap: var(--rl-space-4);
      }

      @media (min-width: 560px) {
        .grid-2 {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      .table {
        width: 100%;
        min-width: 720px;
        border-collapse: collapse;
        background: var(--rl-surface-raised);
        border-radius: var(--rl-radius-lg);
        overflow: hidden;
      }

      th,
      td {
        padding: var(--rl-space-4);
        text-align: left;
        border-bottom: 1px solid var(--rl-border);
        font-size: var(--rl-text-sm);
      }

      thead th {
        background: var(--rl-neutral-100);
        font-size: var(--rl-text-xs);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .block {
        display: block;
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: var(--rl-space-2);
      }
    `,
  ],
})
export class AdminCoursesPage implements OnInit {
  private readonly admin = inject(AdminService);
  private readonly seo = inject(SeoService);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly showForm = signal(false);
  readonly courses = signal<AdminCourse[]>([]);
  readonly feedback = signal<{ tone: 'success' | 'error'; message: string } | null>(null);

  readonly status = PublicationStatus;
  readonly levels = CourseLevel;
  readonly statusLabel = STATUS_LABEL;

  draft = {
    title: '',
    shortDescription: '',
    workloadHours: 0,
    level: CourseLevel.BEGINNER as CourseLevel,
    isFree: false,
  };

  ngOnInit(): void {
    this.seo.apply({
      title: 'Cursos (admin)',
      description: 'Gestão de cursos.',
      path: '/admin/cursos',
      noIndex: true,
    });
    this.load();
  }

  private load(): void {
    this.loading.set(true);
    this.admin.listCourses().subscribe({
      next: (courses) => {
        this.courses.set(courses);
        this.loading.set(false);
      },
      error: (err: { message: string }) => {
        this.feedback.set({ tone: 'error', message: err.message });
        this.loading.set(false);
      },
    });
  }

  create(): void {
    if (!this.draft.title.trim() || !this.draft.shortDescription.trim()) {
      this.feedback.set({ tone: 'error', message: 'Informe o título e a descrição curta.' });
      return;
    }

    this.saving.set(true);
    this.admin.createCourse({ ...this.draft }).subscribe({
      next: () => {
        this.saving.set(false);
        this.showForm.set(false);
        this.draft = {
          title: '',
          shortDescription: '',
          workloadHours: 0,
          level: CourseLevel.BEGINNER,
          isFree: false,
        };
        this.feedback.set({ tone: 'success', message: 'Curso criado como rascunho.' });
        this.load();
      },
      error: (err: { message: string }) => {
        this.saving.set(false);
        this.feedback.set({ tone: 'error', message: err.message });
      },
    });
  }

  publish(course: AdminCourse): void {
    this.admin.publishCourse(course.id).subscribe({
      next: () => {
        this.feedback.set({ tone: 'success', message: `"${course.title}" publicado.` });
        this.load();
      },
      // A API recusa publicar curso sem aulas e explica o motivo.
      error: (err: { message: string }) =>
        this.feedback.set({ tone: 'error', message: err.message }),
    });
  }

  unpublish(course: AdminCourse): void {
    this.admin.unpublishCourse(course.id).subscribe({
      next: () => {
        this.feedback.set({ tone: 'success', message: `"${course.title}" voltou a rascunho.` });
        this.load();
      },
      error: (err: { message: string }) =>
        this.feedback.set({ tone: 'error', message: err.message }),
    });
  }
}
