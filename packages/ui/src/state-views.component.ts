import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

/**
 * Estados de interface reutilizáveis: carregando, vazio, erro, sucesso e
 * bloqueado. Manter os cinco em um só lugar garante que todas as telas
 * conversem com o aluno da mesma forma.
 */

@Component({
  selector: 'rl-loading',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="loading" role="status" aria-live="polite">
      <span class="spinner" aria-hidden="true"></span>
      <span>{{ label }}</span>
    </div>
  `,
  styles: [
    `
      .loading {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--rl-space-3);
        padding: var(--rl-space-10);
        color: var(--rl-text-muted);
      }

      .spinner {
        width: 22px;
        height: 22px;
        border: 3px solid var(--rl-border);
        border-top-color: var(--rl-brand-600);
        border-radius: 50%;
        animation: spin 800ms linear infinite;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }

      /* Sem animação para quem pediu movimento reduzido. */
      @media (prefers-reduced-motion: reduce) {
        .spinner {
          animation: none;
          border-top-color: var(--rl-border);
        }
      }
    `,
  ],
})
export class LoadingStateComponent {
  @Input() label = 'Carregando…';
}

@Component({
  selector: 'rl-empty',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="empty">
      <p class="icon" aria-hidden="true">{{ icon }}</p>
      <h3>{{ title }}</h3>
      <p class="rl-muted">{{ description }}</p>
      <ng-content />
    </div>
  `,
  styles: [
    `
      .empty {
        text-align: center;
        padding: var(--rl-space-12) var(--rl-space-5);
        border: 1px dashed var(--rl-border-strong);
        border-radius: var(--rl-radius-lg);
        background: var(--rl-surface-muted);
      }

      .icon {
        font-size: 2.5rem;
        margin-bottom: var(--rl-space-3);
      }

      h3 {
        margin-bottom: var(--rl-space-2);
      }
    `,
  ],
})
export class EmptyStateComponent {
  @Input() title = 'Nada por aqui ainda';
  @Input() description = '';
  @Input() icon = '📚';
}

@Component({
  selector: 'rl-alert',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="alert"
      [class.alert--error]="tone === 'error'"
      [class.alert--success]="tone === 'success'"
      [class.alert--warn]="tone === 'warn'"
      [class.alert--info]="tone === 'info'"
      [attr.role]="tone === 'error' ? 'alert' : 'status'"
      aria-live="polite"
    >
      @if (title) {
        <strong>{{ title }}</strong>
      }
      <span><ng-content /></span>
    </div>
  `,
  styles: [
    `
      .alert {
        display: flex;
        flex-direction: column;
        gap: var(--rl-space-1);
        padding: var(--rl-space-4);
        border-radius: var(--rl-radius-md);
        border-left: 4px solid var(--rl-neutral-400);
        background: var(--rl-surface-muted);
        margin-bottom: var(--rl-space-5);
        font-size: var(--rl-text-sm);
      }

      .alert--error {
        border-left-color: var(--rl-danger-500);
        background: var(--rl-danger-100);
        color: var(--rl-danger-text);
      }

      .alert--success {
        border-left-color: var(--rl-success-500);
        background: var(--rl-success-100);
        color: var(--rl-success-text);
      }

      .alert--warn {
        border-left-color: var(--rl-warn-500);
        background: var(--rl-warn-100);
        color: var(--rl-warn-text);
      }

      .alert--info {
        border-left-color: var(--rl-brand-500);
        background: var(--rl-brand-50);
        color: var(--rl-brand-on-surface);
      }
    `,
  ],
})
export class AlertComponent {
  @Input() tone: 'info' | 'success' | 'warn' | 'error' = 'info';
  @Input() title = '';
}

@Component({
  selector: 'rl-locked',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="locked">
      <p class="icon" aria-hidden="true">🔒</p>
      <h3>{{ title }}</h3>
      <p class="rl-muted">{{ description }}</p>
      <ng-content />
    </div>
  `,
  styles: [
    `
      .locked {
        text-align: center;
        padding: var(--rl-space-12) var(--rl-space-5);
        border: 1px solid var(--rl-border);
        border-radius: var(--rl-radius-lg);
        background: var(--rl-surface-raised);
      }

      .icon {
        font-size: 2.5rem;
        margin-bottom: var(--rl-space-3);
      }
    `,
  ],
})
export class LockedStateComponent {
  @Input() title = 'Conteúdo bloqueado';
  @Input() description = 'Você ainda não tem acesso a este conteúdo.';
}
