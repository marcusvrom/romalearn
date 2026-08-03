import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemePreference, ThemeService } from '../core/theme.service';

interface ThemeOption {
  value: ThemePreference;
  label: string;
  icon: string;
}

/**
 * Seletor de tema claro / escuro / sistema.
 *
 * É um grupo de rádio, não um botão que alterna em ciclo: com três opções, o
 * ciclo obriga o aluno a adivinhar quantos toques faltam e não anuncia o
 * estado atual para o leitor de tela. Aqui as três ficam visíveis e a
 * escolhida é anunciada.
 */
@Component({
  selector: 'rl-theme-toggle',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="toggle" role="radiogroup" aria-label="Tema da página">
      @for (option of options; track option.value) {
        <button
          type="button"
          role="radio"
          class="option"
          [class.option--active]="theme.preference() === option.value"
          [attr.aria-checked]="theme.preference() === option.value"
          [attr.title]="option.label"
          (click)="theme.set(option.value)"
        >
          <span aria-hidden="true">{{ option.icon }}</span>
          <span class="rl-visually-hidden">{{ option.label }}</span>
        </button>
      }
    </div>
  `,
  styles: [
    `
      .toggle {
        display: inline-flex;
        gap: 2px;
        padding: 3px;
        border: 1px solid var(--rl-border);
        border-radius: var(--rl-radius-full);
        background: var(--rl-surface-muted);
      }

      .option {
        position: relative;
        display: inline-grid;
        place-items: center;
        width: 34px;
        height: 34px;
        border: 0;
        border-radius: var(--rl-radius-full);
        background: transparent;
        color: var(--rl-text-muted);
        font-size: var(--rl-text-sm);
        line-height: 1;
        cursor: pointer;
        transition:
          background-color var(--rl-transition-fast),
          color var(--rl-transition-fast);
      }

      .option:hover {
        color: var(--rl-text);
      }

      .option--active {
        background: var(--rl-surface-raised);
        color: var(--rl-brand-link);
        box-shadow: var(--rl-shadow-sm);
      }

      /*
       * Cada botão tem 34px, abaixo dos 44px de alvo de toque da WCAG 2.5.8.
       * Esta camada invisível estende a área clicável sem esticar o desenho.
       */
      .option::after {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 44px;
        height: 44px;
        transform: translate(-50%, -50%);
      }
    `,
  ],
})
export class ThemeToggleComponent {
  readonly theme = inject(ThemeService);

  readonly options: ThemeOption[] = [
    { value: 'claro', label: 'Tema claro', icon: '☀' },
    { value: 'escuro', label: 'Tema escuro', icon: '☾' },
    { value: 'sistema', label: 'Seguir o tema do sistema', icon: '🖥' },
  ];
}
