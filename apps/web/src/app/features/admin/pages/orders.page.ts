import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { OrderDto, WebhookEventDto } from '@romalearn/contracts';
import { AlertComponent, LoadingStateComponent } from '@romalearn/ui';
import {
  ORDER_STATUS_LABEL,
  PAYMENT_METHOD_LABEL,
  formatCurrency,
  formatDateTime,
} from '../../../core/format';
import { SeoService } from '../../../core/seo.service';
import { AdminService } from '../admin.service';

@Component({
  selector: 'rl-admin-orders-page',
  standalone: true,
  imports: [LoadingStateComponent, AlertComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Pedidos e pagamentos</h1>

    @if (feedback(); as message) {
      <rl-alert [tone]="message.tone">{{ message.message }}</rl-alert>
    }

    @if (loading()) {
      <rl-loading label="Carregando pedidos…" />
    } @else {
      <section class="block">
        <h2>Pedidos</h2>
        <div class="rl-table-scroll">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Pedido</th>
                <th scope="col">Produto</th>
                <th scope="col">Data</th>
                <th scope="col">Valor</th>
                <th scope="col">Pagamento</th>
                <th scope="col">Situação</th>
                <th scope="col">Ação</th>
              </tr>
            </thead>
            <tbody>
              @for (order of orders(); track order.id) {
                <tr>
                  <td class="code">{{ order.reference }}</td>
                  <td>{{ order.productName }}</td>
                  <td>{{ formatDateTime(order.createdAt) }}</td>
                  <td>{{ formatCurrency(order.totalCents, order.currency) }}</td>
                  <td>
                    @if (order.payment; as payment) {
                      <strong>{{ paymentMethodLabel[payment.method] ?? payment.method }}</strong>
                      <span class="rl-small rl-muted block">{{ payment.gateway }}</span>
                    } @else {
                      <span class="rl-small rl-muted">Sem cobrança</span>
                    }
                  </td>
                  <td>
                    <span class="rl-badge" [class.rl-badge--free]="order.status === 'APPROVED'">
                      {{ statusLabel[order.status] }}
                    </span>
                  </td>
                  <td>
                    @if (order.status === 'APPROVED') {
                      <button
                        type="button"
                        class="rl-button rl-button--secondary rl-button--small"
                        (click)="refund(order)"
                      >
                        Reembolsar
                      </button>
                    } @else {
                      <span class="rl-small rl-muted">—</span>
                    }
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="7" class="rl-muted">Nenhum pedido registrado.</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>

      <section class="block">
        <h2>Eventos de pagamento (webhooks)</h2>
        <p class="rl-small rl-muted">
          Eventos com falha podem ser reprocessados com segurança: a idempotência impede efeitos
          duplicados.
        </p>

        <div class="rl-table-scroll">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Evento</th>
                <th scope="col">Tipo</th>
                <th scope="col">Recebido</th>
                <th scope="col">Situação</th>
                <th scope="col">Ação</th>
              </tr>
            </thead>
            <tbody>
              @for (event of webhooks(); track event.id) {
                <tr>
                  <td class="code">{{ event.externalId }}</td>
                  <td>{{ event.eventType }}</td>
                  <td>{{ formatDateTime(event.receivedAt) }}</td>
                  <td>
                    <span
                      class="rl-badge"
                      [class.rl-badge--free]="event.status === 'PROCESSED'"
                      [class.rl-badge--danger]="event.status === 'FAILED'"
                    >
                      {{ event.status }}
                    </span>
                    @if (event.lastError) {
                      <span class="rl-small rl-muted block">{{ event.lastError }}</span>
                    }
                  </td>
                  <td>
                    @if (event.status === 'FAILED') {
                      <button
                        type="button"
                        class="rl-button rl-button--secondary rl-button--small"
                        (click)="replay(event)"
                      >
                        Reprocessar
                      </button>
                    } @else {
                      <span class="rl-small rl-muted">—</span>
                    }
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="rl-muted">Nenhum webhook recebido.</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>
    }
  `,
  styles: [
    `
      h1 { font-size: var(--rl-text-2xl); margin-bottom: var(--rl-space-6); }
      .block { margin-bottom: var(--rl-space-10); overflow-wrap: anywhere; }
      .block h2 { font-size: var(--rl-text-lg); margin-bottom: var(--rl-space-3); }
      .table { width: 100%; min-width: 880px; border-collapse: collapse; background: var(--rl-surface-raised); border-radius: var(--rl-radius-lg); overflow: hidden; }
      th, td { padding: var(--rl-space-4); text-align: left; border-bottom: 1px solid var(--rl-border); font-size: var(--rl-text-sm); vertical-align: top; }
      thead th { background: var(--rl-surface-sunken); font-size: var(--rl-text-xs); text-transform: uppercase; letter-spacing: 0.05em; }
      .code { font-family: var(--rl-font-mono); font-size: var(--rl-text-xs); }
      .block { display: block; }
    `,
  ],
})
export class AdminOrdersPage implements OnInit {
  private readonly admin = inject(AdminService);
  private readonly seo = inject(SeoService);

  readonly loading = signal(true);
  readonly orders = signal<OrderDto[]>([]);
  readonly webhooks = signal<WebhookEventDto[]>([]);
  readonly feedback = signal<{ tone: 'success' | 'error'; message: string } | null>(null);

  readonly statusLabel = ORDER_STATUS_LABEL;
  readonly paymentMethodLabel = PAYMENT_METHOD_LABEL;
  readonly formatCurrency = formatCurrency;
  readonly formatDateTime = formatDateTime;

  ngOnInit(): void {
    this.seo.apply({
      title: 'Pedidos (admin)',
      description: 'Pedidos, pagamentos e webhooks.',
      path: '/admin/pedidos',
      noIndex: true,
    });
    this.load();
  }

  private load(): void {
    this.loading.set(true);

    this.admin.listOrders().subscribe({
      next: (result) => {
        this.orders.set(result.items);
        this.loading.set(false);
      },
      error: (err: { message: string }) => {
        this.feedback.set({ tone: 'error', message: err.message });
        this.loading.set(false);
      },
    });

    this.admin.listWebhooks().subscribe({
      next: (events) => this.webhooks.set(events),
      error: () => undefined,
    });
  }

  refund(order: OrderDto): void {
    const reason = globalThis.prompt(`Informe o motivo do reembolso do pedido ${order.reference}:`);
    if (!reason?.trim()) return;

    this.admin.refundOrder(order.id, reason.trim()).subscribe({
      next: () => {
        this.feedback.set({
          tone: 'success',
          message: `Pedido ${order.reference} reembolsado e acesso revogado.`,
        });
        this.load();
      },
      error: (err: { message: string }) =>
        this.feedback.set({ tone: 'error', message: err.message }),
    });
  }

  replay(event: WebhookEventDto): void {
    this.admin.replayWebhook(event.id).subscribe({
      next: (result) => {
        this.feedback.set({ tone: 'success', message: `Evento reprocessado: ${result.status}.` });
        this.load();
      },
      error: (err: { message: string }) =>
        this.feedback.set({ tone: 'error', message: err.message }),
    });
  }
}
