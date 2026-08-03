import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminDashboardDto, OrderDto, PaymentMethod } from '@romalearn/contracts';
import { AlertComponent, LoadingStateComponent } from '@romalearn/ui';
import { forkJoin } from 'rxjs';
import { PAYMENT_METHOD_LABEL, formatCurrency } from '../../../core/format';
import { SeoService } from '../../../core/seo.service';
import { AdminService } from '../admin.service';

interface PaymentMethodSummary {
  method: PaymentMethod;
  orders: number;
  approved: number;
  revenueCents: number;
  ticketAverageCents: number;
}

@Component({
  selector: 'rl-admin-finance-overview-page',
  standalone: true,
  imports: [RouterLink, LoadingStateComponent, AlertComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <div>
        <p class="eyebrow">Financeiro</p>
        <h1>Receita, pagamentos e risco operacional</h1>
        <p>Acompanhe receita consolidada, métodos usados e pendências que podem afetar o acesso dos alunos.</p>
      </div>
      <a class="rl-button rl-button--primary" routerLink="/admin/pedidos">Ver todos os pedidos</a>
    </header>

    @if (loading()) { <rl-loading label="Carregando visão financeira…" /> }
    @if (!loading() && error(); as message) {
      <rl-alert tone="error" title="Não foi possível carregar">{{ message }}</rl-alert>
    }
    @if (!loading() && !error() && data(); as data) {
      <section class="metrics" aria-label="Indicadores financeiros">
        <article class="rl-card metric">
          <span>Receita aprovada</span>
          <strong>{{ formatCurrency(data.orders.revenueCents) }}</strong>
          <small>{{ data.orders.approved }} pedidos aprovados</small>
        </article>
        <article class="rl-card metric">
          <span>Ticket médio aprovado</span>
          <strong>{{ formatCurrency(approvedTicketAverage()) }}</strong>
          <small>receita dividida pelos pedidos aprovados</small>
        </article>
        <article class="rl-card metric">
          <span>Pagamentos pendentes</span>
          <strong>{{ data.orders.pending }}</strong>
          <small>aguardando confirmação ou expiração</small>
        </article>
        <article class="rl-card metric" [class.metric--danger]="data.webhooks.failed > 0">
          <span>Falhas de webhook</span>
          <strong>{{ data.webhooks.failed }}</strong>
          <small>podem impedir a liberação automática do acesso</small>
        </article>
      </section>

      <section class="grid">
        <article class="rl-card payment-card">
          <div class="section-head">
            <div>
              <h2>Formas de pagamento</h2>
              <p>Distribuição calculada com os pedidos carregados nesta visão.</p>
            </div>
            <span class="scope">{{ orders().length }} pedidos analisados</span>
          </div>

          @if (paymentMethods().length === 0) {
            <p class="empty">Ainda não existem pagamentos registrados.</p>
          } @else {
            <div class="payment-list">
              @for (item of paymentMethods(); track item.method) {
                <article>
                  <div class="payment-list__title">
                    <strong>{{ paymentMethodLabel[item.method] ?? item.method }}</strong>
                    <span>{{ share(item.orders) }}%</span>
                  </div>
                  <div class="bar" aria-hidden="true">
                    <span [style.width.%]="share(item.orders)"></span>
                  </div>
                  <dl>
                    <div><dt>Pedidos</dt><dd>{{ item.orders }}</dd></div>
                    <div><dt>Aprovados</dt><dd>{{ item.approved }}</dd></div>
                    <div><dt>Receita</dt><dd>{{ formatCurrency(item.revenueCents) }}</dd></div>
                    <div><dt>Ticket médio</dt><dd>{{ formatCurrency(item.ticketAverageCents) }}</dd></div>
                  </dl>
                </article>
              }
            </div>
          }
        </article>

        <article class="rl-card">
          <h2>À vista e parcelado</h2>
          <p class="rl-muted">
            O modelo atual registra o método de pagamento, mas ainda não persiste a quantidade de parcelas.
          </p>
          <div class="empty-state">
            <strong>Próxima evolução de contrato</strong>
            <code>PaymentDto.installments</code>
            <p>Ao persistir esse campo, o painel poderá separar à vista, 2x, 3x e demais opções sem consultar diretamente o gateway.</p>
          </div>
        </article>

        <article class="rl-card action-card">
          <h2>Ações operacionais</h2>
          <a routerLink="/admin/pedidos">Consultar pedidos, métodos e reembolsos →</a>
          <a routerLink="/admin/produtos">Gerenciar preços, ofertas e cupons →</a>
          <a routerLink="/admin/auditoria">Auditar alterações financeiras →</a>
        </article>
      </section>
    }
  `,
  styles: [`
    .page-head { display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: space-between; gap: var(--rl-space-5); margin-bottom: var(--rl-space-7); }
    .eyebrow { margin: 0 0 var(--rl-space-1); color: var(--rl-brand-link); font-weight: var(--rl-weight-semibold); }
    h1 { margin: 0; font-size: var(--rl-text-2xl); }
    .page-head p:last-child { max-width: 72ch; color: var(--rl-text-muted); }
    .metrics, .grid { display: grid; gap: var(--rl-space-4); }
    .metrics { margin-bottom: var(--rl-space-6); }
    .metric { display: grid; gap: var(--rl-space-2); }
    .metric span { color: var(--rl-text-subtle); font-size: var(--rl-text-sm); }
    .metric strong { font-size: var(--rl-text-2xl); }
    .metric small { color: var(--rl-text-muted); }
    .metric--danger { border-color: var(--rl-danger-500); }
    h2 { margin-top: 0; font-size: var(--rl-text-lg); }
    .section-head { display: flex; flex-wrap: wrap; align-items: flex-start; justify-content: space-between; gap: var(--rl-space-3); margin-bottom: var(--rl-space-4); }
    .section-head h2, .section-head p { margin: 0; }
    .section-head p { margin-top: var(--rl-space-1); color: var(--rl-text-muted); }
    .scope { padding: .25rem .6rem; border-radius: 999px; background: var(--rl-surface-muted); color: var(--rl-text-subtle); font-size: var(--rl-text-xs); }
    .payment-list { display: grid; gap: var(--rl-space-4); }
    .payment-list > article { padding: var(--rl-space-4); border: 1px solid var(--rl-border); border-radius: var(--rl-radius-md); }
    .payment-list__title { display: flex; justify-content: space-between; gap: var(--rl-space-3); }
    .bar { height: .5rem; margin: var(--rl-space-3) 0; overflow: hidden; border-radius: 999px; background: var(--rl-surface-muted); }
    .bar span { display: block; height: 100%; border-radius: inherit; background: var(--rl-brand-500); }
    dl { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: var(--rl-space-3); margin: 0; }
    dl div { display: grid; gap: .15rem; }
    dt { color: var(--rl-text-subtle); font-size: var(--rl-text-xs); }
    dd { margin: 0; font-weight: var(--rl-weight-semibold); }
    .empty, .empty-state { color: var(--rl-text-muted); }
    .empty-state { display: grid; gap: var(--rl-space-2); padding: var(--rl-space-4); border-radius: var(--rl-radius-md); background: var(--rl-surface-muted); }
    .empty-state p { margin: 0; }
    .action-card { display: grid; align-content: start; gap: var(--rl-space-3); }
    .action-card a { color: var(--rl-brand-link); font-weight: var(--rl-weight-semibold); text-decoration: none; }
    @media (min-width: 760px) { .metrics { grid-template-columns: repeat(2, minmax(0, 1fr)); } .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .action-card { grid-column: 1 / -1; } }
    @media (min-width: 1180px) { .metrics { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
  `],
})
export class AdminFinanceOverviewPage implements OnInit {
  private readonly admin = inject(AdminService);
  private readonly seo = inject(SeoService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly data = signal<AdminDashboardDto | null>(null);
  readonly orders = signal<OrderDto[]>([]);
  readonly formatCurrency = formatCurrency;
  readonly paymentMethodLabel = PAYMENT_METHOD_LABEL;

  readonly approvedTicketAverage = computed(() => {
    const dashboard = this.data();
    if (!dashboard || dashboard.orders.approved === 0) return 0;
    return Math.round(dashboard.orders.revenueCents / dashboard.orders.approved);
  });

  readonly paymentMethods = computed<PaymentMethodSummary[]>(() => {
    const summaries = new Map<PaymentMethod, PaymentMethodSummary>();

    for (const order of this.orders()) {
      const method = order.payment?.method ?? PaymentMethod.NONE;
      const current = summaries.get(method) ?? {
        method,
        orders: 0,
        approved: 0,
        revenueCents: 0,
        ticketAverageCents: 0,
      };

      current.orders += 1;
      if (order.status === 'APPROVED') {
        current.approved += 1;
        current.revenueCents += order.totalCents;
      }
      summaries.set(method, current);
    }

    return Array.from(summaries.values())
      .map((summary) => ({
        ...summary,
        ticketAverageCents:
          summary.approved > 0 ? Math.round(summary.revenueCents / summary.approved) : 0,
      }))
      .sort((a, b) => b.orders - a.orders);
  });

  ngOnInit(): void {
    this.seo.apply({
      title: 'Financeiro',
      description: 'Visão financeira da RomaLearn.',
      path: '/admin/financeiro',
      noIndex: true,
    });

    forkJoin({ dashboard: this.admin.dashboard(), orders: this.admin.listOrders(1) }).subscribe({
      next: ({ dashboard, orders }) => {
        this.data.set(dashboard);
        this.orders.set(orders.items);
        this.loading.set(false);
      },
      error: (err: { message: string }) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  share(orders: number): number {
    const total = this.orders().length;
    return total === 0 ? 0 : Math.round((orders / total) * 100);
  }
}
