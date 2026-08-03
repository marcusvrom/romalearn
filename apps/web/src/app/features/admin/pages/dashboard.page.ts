import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminDashboardDto } from '@romalearn/contracts';
import { AlertComponent, LoadingStateComponent } from '@romalearn/ui';
import { formatCurrency } from '../../../core/format';
import { SeoService } from '../../../core/seo.service';
import { AdminService } from '../admin.service';

@Component({
  selector: 'rl-admin-dashboard-page',
  standalone: true,
  imports: [RouterLink, LoadingStateComponent, AlertComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Visão geral</h1>

    @if (loading()) {
      <rl-loading label="Carregando indicadores…" />
    }
    @if (!loading() && error(); as message) {
      <rl-alert tone="error" title="Não foi possível carregar">{{ message }}</rl-alert>
    }
    @if (!loading() && !error() && data(); as data) {
      <div class="cards">
        <article class="rl-card metric">
          <p class="metric__label">Alunos</p>
          <p class="metric__value">{{ data.users.total }}</p>
          <p class="rl-small rl-muted">{{ data.users.last30Days }} nos últimos 30 dias</p>
        </article>

        <article class="rl-card metric">
          <p class="metric__label">Matrículas</p>
          <p class="metric__value">{{ data.enrollments.total }}</p>
          <p class="rl-small rl-muted">
            {{ data.enrollments.active }} ativas · {{ data.enrollments.completed }} concluídas
          </p>
        </article>

        <article class="rl-card metric">
          <p class="metric__label">Cursos</p>
          <p class="metric__value">{{ data.courses.published }}</p>
          <p class="rl-small rl-muted">publicados · {{ data.courses.draft }} em rascunho</p>
        </article>

        <article class="rl-card metric">
          <p class="metric__label">Receita aprovada</p>
          <p class="metric__value">{{ formatCurrency(data.orders.revenueCents) }}</p>
          <p class="rl-small rl-muted">
            {{ data.orders.approved }} pedidos aprovados · {{ data.orders.pending }} pendentes
          </p>
        </article>

        <article class="rl-card metric">
          <p class="metric__label">Certificados</p>
          <p class="metric__value">{{ data.certificates.issued }}</p>
          <p class="rl-small rl-muted">{{ data.certificates.revoked }} revogados</p>
        </article>

        <article class="rl-card metric" [class.metric--alert]="data.webhooks.failed > 0">
          <p class="metric__label">Webhooks com falha</p>
          <p class="metric__value">{{ data.webhooks.failed }}</p>
          @if (data.webhooks.failed > 0) {
            <a class="rl-small" routerLink="/admin/pedidos">Reprocessar eventos →</a>
          } @else {
            <p class="rl-small rl-muted">Nenhuma pendência</p>
          }
        </article>
      </div>

      <section class="rl-card shortcuts">
        <h2>Atalhos</h2>
        <div class="shortcuts__list">
          <a class="rl-button rl-button--secondary rl-button--small" routerLink="/admin/cursos">
            Gerenciar cursos
          </a>
          <a class="rl-button rl-button--secondary rl-button--small" routerLink="/admin/produtos">
            Produtos e ofertas
          </a>
          <a class="rl-button rl-button--secondary rl-button--small" routerLink="/admin/usuarios">
            Liberar acesso manual
          </a>
          <a class="rl-button rl-button--secondary rl-button--small" routerLink="/admin/auditoria">
            Ver auditoria
          </a>
        </div>
      </section>
    }
  `,
  styles: [
    `
      h1 {
        font-size: var(--rl-text-2xl);
        margin-bottom: var(--rl-space-6);
      }

      .cards {
        display: grid;
        gap: var(--rl-space-4);
        margin-bottom: var(--rl-space-8);
      }

      @media (min-width: 560px) {
        .cards {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      @media (min-width: 1100px) {
        .cards {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }

      .metric__label {
        margin: 0;
        font-size: var(--rl-text-xs);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--rl-text-subtle);
      }

      .metric__value {
        margin: var(--rl-space-2) 0;
        font-size: var(--rl-text-2xl);
        font-weight: var(--rl-weight-bold);
      }

      .metric p:last-child {
        margin: 0;
      }

      .metric--alert {
        border-color: var(--rl-danger-500);
      }

      .shortcuts h2 {
        font-size: var(--rl-text-base);
        margin-bottom: var(--rl-space-4);
      }

      .shortcuts__list {
        display: flex;
        flex-wrap: wrap;
        gap: var(--rl-space-2);
      }
    `,
  ],
})
export class AdminDashboardPage implements OnInit {
  private readonly admin = inject(AdminService);
  private readonly seo = inject(SeoService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly data = signal<AdminDashboardDto | null>(null);
  readonly formatCurrency = formatCurrency;

  ngOnInit(): void {
    this.seo.apply({
      title: 'Painel administrativo',
      description: 'Indicadores gerais da plataforma.',
      path: '/admin',
      noIndex: true,
    });

    this.admin.dashboard().subscribe({
      next: (data) => {
        this.data.set(data);
        this.loading.set(false);
      },
      error: (err: { message: string }) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }
}
