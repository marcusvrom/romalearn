import { ChangeDetectionStrategy, Component, OnChanges, OnDestroy, SimpleChanges, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LessonNarrationService } from '../../../core/lesson-narration.service';
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
            A narração usa uma voz disponível no seu aparelho. Exemplos de código são ignorados para tornar a escuta mais natural.
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
          <button type="button" class="audio__button" (click)="narration.previous()" [disabled]="narration.currentBlockIndex() === 0">
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

        <details class="audio__settings">
          <summary>Preferências de áudio</summary>
          <div class="audio__settings-grid">
            <label>
              Velocidade
              <select [ngModel]="narration.rate()" (ngModelChange)="changeRate($event)">
                <option [ngValue]="0.75">0,75x</option>
                <option [ngValue]="1">1x</option>
                <option [ngValue]="1.25">1,25x</option>
                <option [ngValue]="1.5">1,5x</option>
                <option [ngValue]="1.75">1,75x</option>
                <option [ngValue]="2">2x</option>
              </select>
            </label>

            <label>
              Voz
              <select [ngModel]="narration.voiceUri()" (ngModelChange)="changeVoice($event)">
                @if (narration.voices().length === 0) {
                  <option [ngValue]="null">Voz padrão do aparelho</option>
                }
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

      .audio__button {
        min-height: 44px;
        padding: var(--rl-space-3) var(--rl-space-4);
        border: 1px solid var(--rl-border);
        border-radius: var(--rl-radius-md);
        background: var(--rl-surface-raised);
        color: var(--rl-text);
        font: inherit;
        font-weight: var(--rl-weight-semibold);
        cursor: pointer;
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

      @media (min-width: 640px) {
        .audio__head {
          flex-direction: row;
          align-items: flex-start;
          justify-content: space-between;
        }

        .audio__controls {
          grid-template-columns: 1fr 1.5fr 1fr;
        }

        .audio__settings-grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
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
  private readonly analytics = inject(ProductAnalyticsService);
  private started = false;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lessonId'] || changes['html'] || changes['title']) {
      this.narration.loadHtml(this.lessonId(), this.title(), this.html());
      this.started = false;
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
      });
      this.started = true;
    }
  }

  seek(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.narration.seek(Number(input.value));
  }

  changeRate(rate: number): void {
    this.narration.setRate(Number(rate));
    this.analytics.track('lesson_audio_rate_changed', {
      lessonId: this.lessonId(),
      courseSlug: this.courseSlug(),
      rate: Number(rate),
    });
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
        return 'Reproduzindo';
      case 'paused':
        return 'Pausado';
      case 'finished':
        return 'Aula ouvida';
      case 'unsupported':
        return 'Não disponível';
      default:
        return 'Pronto para ouvir';
    }
  }
}
