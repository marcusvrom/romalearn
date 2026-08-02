import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import type { CourseSummaryDto } from '@romalearn/contracts';

const LEVEL_LABEL: Record<string, string> = {
  BEGINNER: 'Iniciante',
  INTERMEDIATE: 'Intermediário',
  ADVANCED: 'Avançado',
  PROGRESSIVE: 'Do iniciante ao avançado',
};

/** Cartão de curso usado na landing page, no catálogo e na área do aluno. */
@Component({
  selector: 'rl-course-card',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <a class="rl-card rl-card--interactive card" [routerLink]="link">
      <div class="top">
        @if (course.isFree) {
          <span class="rl-badge rl-badge--free">Gratuito</span>
        } @else {
          <span class="rl-badge rl-badge--brand">Trilha paga</span>
        }
        <span class="rl-badge">{{ levelLabel }}</span>
      </div>

      <h3 class="title">{{ course.title }}</h3>
      @if (course.subtitle) {
        <p class="subtitle rl-small rl-muted">{{ course.subtitle }}</p>
      }
      <p class="description">{{ course.shortDescription }}</p>

      <dl class="meta">
        <div>
          <dt>Carga horária</dt>
          <dd>{{ course.workloadHours }}h</dd>
        </div>
        <div>
          <dt>Partes</dt>
          <dd>{{ course.sectionCount }}</dd>
        </div>
        <div>
          <dt>Aulas</dt>
          <dd>{{ course.lessonCount }}</dd>
        </div>
      </dl>

      <span class="cta" aria-hidden="true">Ver o conteúdo →</span>
    </a>
  `,
  styles: [
    `
      .card {
        display: flex;
        flex-direction: column;
        height: 100%;
      }

      .top {
        display: flex;
        flex-wrap: wrap;
        gap: var(--rl-space-2);
        margin-bottom: var(--rl-space-4);
      }

      .title {
        font-size: var(--rl-text-lg);
        margin-bottom: var(--rl-space-1);
      }

      .subtitle {
        margin-bottom: var(--rl-space-3);
      }

      .description {
        color: var(--rl-text-muted);
        font-size: var(--rl-text-sm);
        flex-grow: 1;
      }

      .meta {
        display: flex;
        gap: var(--rl-space-5);
        margin: var(--rl-space-4) 0;
        padding-top: var(--rl-space-4);
        border-top: 1px solid var(--rl-border);
      }

      .meta dt {
        font-size: var(--rl-text-xs);
        color: var(--rl-text-subtle);
        text-transform: uppercase;
        letter-spacing: 0.04em;
      }

      .meta dd {
        margin: 0;
        font-weight: var(--rl-weight-semibold);
      }

      .cta {
        font-weight: var(--rl-weight-semibold);
        color: var(--rl-brand-700);
        font-size: var(--rl-text-sm);
      }
    `,
  ],
})
export class CourseCardComponent {
  @Input({ required: true }) course!: CourseSummaryDto;
  /** Destino do cartão; por padrão, a página pública do curso. */
  @Input() link: string | unknown[] = '/';

  get levelLabel(): string {
    return LEVEL_LABEL[this.course.level] ?? 'Iniciante';
  }
}
