import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/** Barra de progresso acessível: o valor também é anunciado por leitores de tela. */
@Component({
  selector: 'rl-progress-bar',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="wrapper">
      @if (showLabel) {
        <div class="head">
          <span>{{ label }}</span>
          <strong>{{ value }}%</strong>
        </div>
      }
      <div
        class="track"
        role="progressbar"
        [attr.aria-valuenow]="value"
        aria-valuemin="0"
        aria-valuemax="100"
        [attr.aria-label]="label"
      >
        <div class="fill" [style.width.%]="value"></div>
      </div>
    </div>
  `,
  styles: [
    `
      .head {
        display: flex;
        justify-content: space-between;
        font-size: var(--rl-text-sm);
        color: var(--rl-text-muted);
        margin-bottom: var(--rl-space-2);
      }

      .track {
        height: 10px;
        background: var(--rl-surface-sunken);
        border-radius: var(--rl-radius-full);
        overflow: hidden;
      }

      .fill {
        height: 100%;
        background: linear-gradient(90deg, var(--rl-brand-500), var(--rl-accent-500));
        border-radius: inherit;
        transition: width var(--rl-transition-base);
      }
    `,
  ],
})
export class ProgressBarComponent {
  @Input() value = 0;
  @Input() label = 'Progresso do curso';
  @Input() showLabel = true;
}
