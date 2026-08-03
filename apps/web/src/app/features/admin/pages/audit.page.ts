import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { AuditLogDto } from '@romalearn/contracts';
import { AlertComponent, LoadingStateComponent } from '@romalearn/ui';
import { formatDateTime } from '../../../core/format';
import { SeoService } from '../../../core/seo.service';
import { AdminService } from '../admin.service';

@Component({
  selector: 'rl-admin-audit-page',
  standalone: true,
  imports: [JsonPipe, LoadingStateComponent, AlertComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Registro de auditoria</h1>
    <p class="rl-muted">
      Todas as ações sensíveis ficam registradas com autor, data e informações essenciais da
      alteração. Este registro não pode ser editado.
    </p>

    @if (error(); as message) {
      <rl-alert tone="error">{{ message }}</rl-alert>
    }

    @if (loading()) {
      <rl-loading label="Carregando registros…" />
    } @else {
      <ul class="logs">
        @for (log of logs(); track log.id) {
          <li class="rl-card log">
            <div class="log__head">
              <span class="rl-badge">{{ log.action }}</span>
              <span class="rl-small rl-muted">{{ formatDateTime(log.createdAt) }}</span>
            </div>

            <p class="log__summary">{{ log.summary }}</p>

            <p class="rl-small rl-muted">
              {{ log.actorEmail ?? 'Sistema' }} · {{ log.entityType
              }}{{ log.entityId ? ' #' + log.entityId.slice(0, 8) : '' }}
            </p>

            @if (log.metadata) {
              <details class="log__details">
                <summary class="rl-small">Ver detalhes</summary>
                <pre>{{ log.metadata | json }}</pre>
              </details>
            }
          </li>
        } @empty {
          <li class="rl-muted">Nenhum registro de auditoria ainda.</li>
        }
      </ul>

      @if (totalPages() > 1) {
        <nav class="pagination" aria-label="Paginação">
          <button
            type="button"
            class="rl-button rl-button--secondary rl-button--small"
            [disabled]="page() === 1"
            (click)="goTo(page() - 1)"
          >
            Anterior
          </button>
          <span class="rl-small rl-muted">Página {{ page() }} de {{ totalPages() }}</span>
          <button
            type="button"
            class="rl-button rl-button--secondary rl-button--small"
            [disabled]="page() === totalPages()"
            (click)="goTo(page() + 1)"
          >
            Próxima
          </button>
        </nav>
      }
    }
  `,
  styles: [
    `
      h1 {
        font-size: var(--rl-text-2xl);
        margin-bottom: var(--rl-space-2);
      }

      .logs {
        list-style: none;
        margin: var(--rl-space-6) 0 0;
        padding: 0;
      }

      .log {
        margin-bottom: var(--rl-space-3);
        padding: var(--rl-space-4);
      }

      .log__head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--rl-space-3);
        margin-bottom: var(--rl-space-2);
      }

      .log__summary {
        margin: 0 0 var(--rl-space-1);
        font-weight: var(--rl-weight-medium);
      }

      .log__details {
        margin-top: var(--rl-space-3);
      }

      .log__details summary {
        cursor: pointer;
        color: var(--rl-brand-link);
      }

      pre {
        margin: var(--rl-space-2) 0 0;
        padding: var(--rl-space-3);
        background: var(--rl-surface-muted);
        border-radius: var(--rl-radius-sm);
        font-size: var(--rl-text-xs);
        overflow-x: auto;
      }

      .pagination {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--rl-space-4);
        margin-top: var(--rl-space-6);
      }
    `,
  ],
})
export class AdminAuditPage implements OnInit {
  private readonly admin = inject(AdminService);
  private readonly seo = inject(SeoService);

  readonly loading = signal(true);
  readonly logs = signal<AuditLogDto[]>([]);
  readonly error = signal<string | null>(null);
  readonly page = signal(1);
  readonly totalPages = signal(1);
  readonly formatDateTime = formatDateTime;

  ngOnInit(): void {
    this.seo.apply({
      title: 'Auditoria (admin)',
      description: 'Registro de ações sensíveis.',
      path: '/admin/auditoria',
      noIndex: true,
    });
    this.load();
  }

  private load(): void {
    this.loading.set(true);

    this.admin.auditLogs(this.page()).subscribe({
      next: (result) => {
        this.logs.set(result.items);
        this.totalPages.set(result.totalPages);
        this.loading.set(false);
      },
      error: (err: { message: string }) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  goTo(page: number): void {
    this.page.set(page);
    this.load();
  }
}
