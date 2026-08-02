import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderDto, WEB_ROUTES } from '@romalearn/contracts';
import { AlertComponent, EmptyStateComponent, LoadingStateComponent } from '@romalearn/ui';
import {
  ORDER_STATUS_LABEL,
  PAYMENT_METHOD_LABEL,
  formatCurrency,
  formatDateTime,
} from '../../core/format';
import { LearningService } from '../../core/learning.service';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'rl-purchases-page',
  standalone: true,
  imports: [RouterLink, LoadingStateComponent, EmptyStateComponent, AlertComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rl-container rl-section">
      <header class="head">
        <p class="rl-eyebrow">Minhas compras</p>
        <h1>Histórico de pedidos</h1>
      </header>

      @if (loading()) {
        <rl-loading label="Carregando suas compras…" />
      }
      @if (!loading() && error(); as message) {
        <rl-alert tone="error" title="Não foi possível carregar">{{ message }}</rl-alert>
      }
      @if (!loading() && !error() && orders().length === 0) {
        <rl-empty
          title="Você ainda não fez nenhuma compra"
          description="A matrícula no módulo gratuito não gera pedido."
          icon="🧾"
        >
          <a class="rl-button rl-button--primary" [routerLink]="routes.catalog">Ver os cursos</a>
        </rl-empty>
      }
      @if (!loading() && !error() && orders().length > 0) {
        <div class="rl-table-scroll">
          <table class="orders">
            <caption class="rl-visually-hidden">
              Lista de pedidos realizados
            </caption>
            <thead>
              <tr>
                <th scope="col">Pedido</th>
                <th scope="col">Produto</th>
                <th scope="col">Data</th>
                <th scope="col">Valor</th>
                <th scope="col">Pagamento</th>
                <th scope="col">Situação</th>
              </tr>
            </thead>
            <tbody>
              @for (order of orders(); track order.id) {
                <tr>
                  <td class="code">{{ order.reference }}</td>
                  <td>{{ order.productName }}</td>
                  <td>{{ formatDateTime(order.createdAt) }}</td>
                  <td>
                    {{ formatCurrency(order.totalCents, order.currency) }}
                    @if (order.discountCents > 0) {
                      <span class="rl-small rl-muted">
                        (desconto de {{ formatCurrency(order.discountCents, order.currency) }})
                      </span>
                    }
                  </td>
                  <td>{{ order.payment ? methodLabel[order.payment.method] : '—' }}</td>
                  <td>
                    <span class="rl-badge" [class]="badgeClass(order)">
                      {{ statusLabel[order.status] }}
                    </span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>

        <p class="rl-small rl-muted note">
          Precisa da nota fiscal ou quer pedir reembolso? Escreva para o suporte informando o código
          do pedido.
        </p>
      }
    </div>
  `,
  styles: [
    `
      .head {
        margin-bottom: var(--rl-space-8);
      }

      .orders {
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

      .code {
        font-family: var(--rl-font-mono);
      }

      .note {
        margin-top: var(--rl-space-6);
      }
    `,
  ],
})
export class PurchasesPage implements OnInit {
  private readonly learning = inject(LearningService);
  private readonly seo = inject(SeoService);

  readonly routes = WEB_ROUTES;
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly orders = signal<OrderDto[]>([]);

  readonly statusLabel = ORDER_STATUS_LABEL;
  readonly methodLabel = PAYMENT_METHOD_LABEL;
  readonly formatCurrency = formatCurrency;
  readonly formatDateTime = formatDateTime;

  ngOnInit(): void {
    this.seo.apply({
      title: 'Minhas compras',
      description: 'Histórico de pedidos e pagamentos.',
      path: WEB_ROUTES.purchases,
      noIndex: true,
    });

    this.learning.orders().subscribe({
      next: (orders) => {
        this.orders.set(orders);
        this.loading.set(false);
      },
      error: (err: { message: string }) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  badgeClass(order: OrderDto): string {
    switch (order.status) {
      case 'APPROVED':
        return 'rl-badge--free';
      case 'PENDING':
      case 'PROCESSING':
        return 'rl-badge--warn';
      case 'REJECTED':
      case 'CANCELLED':
      case 'EXPIRED':
      case 'REFUNDED':
        return 'rl-badge--danger';
      default:
        return '';
    }
  }
}
