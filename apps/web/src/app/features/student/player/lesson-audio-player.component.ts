import {
  ChangeDetectionStrategy,
  Component,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  effect,
  inject,
  input,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  LessonNarrationService,
  NARRATION_PROFILES,
  NarrationProfile,
} from '../../../core/lesson-narration.service';
import { ProductAnalyticsService } from '../../../core/product-analytics.service';

@Component({
  selector: 'rl-lesson-audio-player',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="audio" aria-labelledby="lesson-audio-title">
      <div class="audio__head">
        <div>
          <p class="audio__eyebrow">Modo áudio</p>
          <h2 id="lesson-audio-title">Ouça esta aula</h2>
          <p class="audio__description">
            A narração escolhe automaticamente uma voz em português e começa no ritmo focado de
            1,75x, que deixa muitas vozes do aparelho mais fluidas. Sua escolha fica salva.
          </p>
        </div>
        <span class="audio__status" aria-live="polite">{{ statusLabel() }}</span>
      </div>

      @if (!narration.supported()) {
        <p class="audio__unsupported" role="status">
          Este navegador não oferece narração automática. Você ainda pode usar o leitor de tela do seu aparelho.
        </p>
      } @else if (narration.blocks().length === 0) {
        <p class="audio__unsupported">Esta aula não possui conteúdo textual disponível para narração.</p>
      } @else {
        <div class="audio__progress">
          <div class="audio__progress-labels">
            <span>Trecho {{ narration.currentBlockIndex() + 1 }} de {{ narration.blocks().length }}</span>
            <span>{{ narration.progressPercentage() }}%</span>
          </div>
          <input
            type="range"
            min="0"
            [max]="narration.blocks().length - 1"
            [value]="narration.currentBlockIndex()"
            (input)="seek($event)"
            aria-label="Posição da narração"
          />
        </div>

        <p class="audio__current" aria-live="polite">
          {{ narration.currentBlock()?.text }}
        </p>

        <div class="audio__controls" role="group" aria-label="Controles da narração">
          <button
            type="button"
            class="audio__button"
            (click)="narration.previous()"
            [disabled]="narration.currentBlockIndex() === 0"
          >
            <span aria-hidden="true">↶</span>
            Anterior
          </button>

          <button type="button" class="audio__button audio__button--primary" (click)="toggle()">
            <span aria-hidden="true">{{ narration.status() === 'playing' ? '❚❚' : '▶' }}</span>
            {{ narration.status() === 'playing' ? 'Pausar' : narration.status() === 'paused' ? 'Continuar' : 'Ouvir aula' }}
          </button>

          <button
            type="button"
            class="audio__button"
            (click)="narration.next()"
            [disabled]="narration.currentBlockIndex() >= narration.blocks().length - 1"
          >
            Próximo
            <span aria-hidden="true">↷</span>
          </button>
        </div>

        <div class="audio__profiles" role="group" aria-label="Estilo da narração">
          <p class="audio__profiles-title">Escolha o ritmo</p>
          <div class="audio__profile-grid">
            @for (profile of profiles; track profile.id) {
              <button
                type="button"
                class="audio__profile"
                [class.audio__profile--active]="narration.profile() === profile.id"
                [attr.aria-pressed]="narration.profile() === profile.id"
                (click)="changeProfile(profile.id)"
              >
                <span class="audio__profile-name">
                  {{ profile.label }} · {{ profile.rate }}x
                  @if (profile.id === 'FOCUSED') {
                    <span class="audio__recommended">Recomendado</span>
                  }
                </span>
                <span class="audio__profile-description">{{ profile.description }}</span>
              </button>
            }
          </div>
        </div>

        <details class="audio__settings">
          <summary>Preferências avançadas</summary>
          <div class="audio__settings-grid">
            <label>
              Velocidade personalizada
              <select [ngModel]="narration.rate()" (ngModelChange)="changeRate($event)">
                <option [ngValue]="0.75">0,75x</option>
                <option [ngValue]="1">1x</option>
                <option [ngValue]="1.25">1,25x</option>
                <option [ngValue]="1.5">1,5x</option>
                <option [ngValue]="1.75">1,75x — recomendado</option>
                <option [ngValue]="2">2x</option>
              </select>
            </label>

            <label>
              Voz
              <select [ngModel]="narration.voiceUri()" (ngModelChange)="changeVoice($event)">
                <option [ngValue]="null">Melhor voz disponível automaticamente</option>
                @for (voice of narration.voices(); track voice.voiceURI) {
                  <option [ngValue]="voice.voiceURI">{{ voice.name }} · {{ voice.lang }}</option>
                }
              </select>
            </label>

            <label class="audio__check">
              <input
                type="checkbox"
                [checked]="narration.autoAdvance()"
                (change)="changeAutoAdvance($event)"
              />
              Continuar automaticamente para a próxima aula quando esse recurso estiver disponível
            </label>
          </div>
        </details>
      }
    </section>
  `,
  styles: [
    `
      .audio {
        display: grid;
        gap: var(--rl-space-5);
        margin: 0 0 var(--rl-space-8);
        padding: var(--rl-space-5);
        border: 1px solid var(--rl-border);
        border-radius: var(--rl-radius-lg);
        background: var(--rl-surface-raised);
      }

      .audio__head {
        display: flex;
        flex-direction: column;
        gap: var(--rl-space-3);
      }

      .audio__eyebrow {
        margin: 0 0 var(--rl-space-1);
        color: var(--rl-brand-link);
        font-size: var(--rl-text-sm);
        font-weight: var(--rl-weight-semibold);
      }

      h2 {
        margin: 0;
        font-size: var(--rl-text-lg);
      }

      .audio__description,
      .audio__unsupported {
        margin: var(--rl-space-2) 0 0;
        color: var(--rl-text-muted);
        font-size: var(--rl-text-sm);
      }

      .audio__status {
        align-self: flex-start;
        padding: var(--rl-space-1) var(--rl-space-3);
        border-radius: 999px;
        background: var(--rl-surface-muted);
        color: var(--rl-text-muted);
        font-size: var(--rl-text-sm);
      }

      .audio__progress {
        display: grid;
        gap: var(--rl-space-2);
      }

      .audio__progress-labels {
        display: flex;
        justify-content: space-between;
        gap: var(--rl-space-3);
        color: var(--rl-text-muted);
        font-size: var(--rl-text-sm);
        font-variant-numeric: tabular-nums;
      }

      .audio__progress input {
        width: 100%;
        min-height: 32px;
      }

      .audio__current {
        min-height: 3.5rem;
        margin: 0;
        padding: var(--rl-space-4);
        border-left: 4px solid var(--rl-brand-500);
        border-radius: 0 var(--rl-radius-md) var(--rl-radius-md) 0;
        background: var(--rl-surface-muted);
        line-height: 1.65;
      }

      .audio__controls {
        display: grid;
        grid-template-columns: 1fr;
        gap: var(--rl-space-2);
      }

      .audio__button,
      .audio__profile {
        min-height: 44px;
        padding: var(--rl-space-3) var(--rl-space-4);
        border: 1px solid var(--rl-border);
        border-radius: var(--rl-radius-md);
        background: var(--rl-surface-raised);
        color: var(--rl-text);
        font: inherit;
        cursor: pointer;
      }

      .audio__button {
        font-weight: var(--rl-weight-semibold);
      }

      .audio__button:disabled {
        cursor: not-allowed;
        opacity: 0.5;
      }

      .audio__button--primary {
        border-color: var(--rl-brand-600);
        background: var(--rl-brand-600);
        color: white;
      }

      .audio__profiles-title {
        margin: 0 0 var(--rl-space-3);
        font-weight: var(--rl-weight-semibold);
      }

      .audio__profile-grid {
        display: grid;
        gap: var(--rl-space-2);
      }

      .audio__profile {
        display: grid;
        gap: var(--rl-space-1);
        text-align: left;
      }

      .audio__profile--active {
        border-color: var(--rl-brand-600);
        background: var(--rl-brand-50);
        box-shadow: 0 0 0 1px var(--rl-brand-600);
      }

      .audio__profile-name {
        font-weight: var(--rl-weight-semibold);
      }

      .audio__profile-description {
        color: var(--rl-text-muted);
        font-size: var(--rl-text-sm);
      }

      .audio__recommended {
        display: inline-flex;
        margin-left: var(--rl-space-2);
        padding: 2px var(--rl-space-2);
        border-radius: 999px;
        background: var(--rl-brand-600);
        color: white;
        font-size: 0.72rem;
      }

      .audio__settings summary {
        cursor: pointer;
        font-weight: var(--rl-weight-semibold);
      }

      .audio__settings-grid {
        display: grid;
        gap: var(--rl-space-4);
        margin-top: var(--rl-space-4);
      }

      .audio__settings label {
        display: grid;
        gap: var(--rl-space-2);
        font-size: var(--rl-text-sm);
        font-weight: var(--rl-weight-medium);
      }

      .audio__settings select {
        min-height: 44px;
        padding: 0 var(--rl-space-3);
        border: 1px solid var(--rl-border);
        border-radius: var(--rl-radius-md);
        background: var(--rl-surface-raised);
        color: var(--rl-text);
        font: inherit;
      }

      .audio__settings .audio__check {
        display: flex;
        grid-column: 1 / -1;
        flex-direction: row;
        align-items: flex-start;
        gap: var(--rl-space-3);
        font-weight: var(--rl-weight-regular);
      }

      .audio__check input {
        width: 20px;
        height: 20px;
        flex: 0 0 auto;
      }

      button:focus-visible,
      summary:focus-visible,
      select:focus-visible,
      input:focus-visible {
        outline: 3px solid var(--rl-brand-400);
        outline-offset: 3px;
      }

      @media (min-width: 640px) {
        .audio__head {
          flex-direction: row;
          align-items: flex-start;
          justify-content: space-between;
        }

        .audio__controls {
          grid-template-columns: 1fr 1.5fr 1fr;
        }

        .audio__profile-grid,
        .audio__settings-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          scroll-behavior: auto !important;
          transition: none !important;
        }
      }
    `,
  ],
})
export class LessonAudioPlayerComponent implements OnChanges, OnDestroy {
  readonly lessonId = input.required<string>();
  readonly courseSlug = input.required<string>();
  readonly title = input.required<string>();
  readonly html = input.required<string>();

  readonly narration = inject(LessonNarrationService);
  readonly profiles = NARRATION_PROFILES;
  private readonly analytics = inject(ProductAnalyticsService);
  private started = false;
  private completedTracked = false;

  constructor() {
    effect(() => {
      const lessonId = this.lessonId();
      const courseSlug = this.courseSlug();
      if (this.narration.status() !== 'finished' || this.completedTracked) return;

      this.analytics.track('lesson_audio_completed', {
        lessonId,
        courseSlug,
        rate: this.narration.rate(),
        profile: this.narration.profile(),
      });
      this.completedTracked = true;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lessonId'] || changes['html'] || changes['title']) {
      this.narration.loadHtml(this.lessonId(), this.title(), this.html());
      this.started = false;
      this.completedTracked = false;
    }
  }

  ngOnDestroy(): void {
    this.narration.pause();
  }

  toggle(): void {
    const action = this.narration.status() === 'playing' ? 'pause' : 'play';
    this.narration.toggle();

    if (!this.started && action === 'play') {
      this.analytics.track('lesson_audio_started', {
        lessonId: this.lessonId(),
        courseSlug: this.courseSlug(),
        rate: this.narration.rate(),
        profile: this.narration.profile(),
      });
      this.started = true;
    }
  }

  seek(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.narration.seek(Number(input.value));
  }

  changeProfile(profile: Exclude<NarrationProfile, 'CUSTOM'>): void {
    this.narration.setProfile(profile);
    this.trackRateChange();
  }

  changeRate(rate: number): void {
    this.narration.setRate(Number(rate));
    this.trackRateChange();
  }

  changeVoice(voiceUri: string | null): void {
    this.narration.setVoice(voiceUri);
  }

  changeAutoAdvance(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.narration.setAutoAdvance(input.checked);
  }

  statusLabel(): string {
    switch (this.narration.status()) {
      case 'playing':
        return `Reproduzindo em ${this.narration.rate()}x`;
      case 'paused':
        return 'Pausado';
      case 'finished':
        return 'Aula ouvida';
      case 'unsupported':
        return 'Não disponível';
      default:
        return `Pronto para ouvir em ${this.narration.rate()}x`;
    }
  }

  private trackRateChange(): void {
    this.analytics.track('lesson_audio_rate_changed', {
      lessonId: this.lessonId(),
      courseSlug: this.courseSlug(),
      rate: this.narration.rate(),
      profile: this.narration.profile(),
    });
  }
}
