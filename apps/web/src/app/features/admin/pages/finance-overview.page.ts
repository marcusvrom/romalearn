import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminDashboardDto } from '@romalearn/contracts';
import { AlertComponent, LoadingStateComponent } from '@romalearn/ui';
import { formatCurrency } from '../../../core/format';
import { SeoService } from '../../../core/seo.service';
import { AdminService } from '../admin.service';

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
        <p>Acompanhe o que já está consolidado e acesse pedidos para investigação detalhada.</p>
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
          <span>Pagamentos pendentes</span>
          <strong>{{ data.orders.pending }}</strong>
          <small>exigem acompanhamento até confirmação ou expiração</small>
        </article>
        <article class="rl-card metric" [class.metric--danger]="data.webhooks.failed > 0">
          <span>Falhas de webhook</span>
          <strong>{{ data.webhooks.failed }}</strong>
          <small>eventos que podem afetar liberação de acesso</small>
        </article>
      </section>

      <section class="grid">
        <article class="rl-card">
          <h2>Formas de pagamento</h2>
          <p class="rl-muted">A estrutura visual está pronta para Pix, cartão, boleto e outros meios.</p>
          <div class="empty-state">
            <strong>Próximo endpoint</strong>
            <code>GET /admin/finance/payment-methods</code>
            <p>Deverá retornar volume, receita, aprovação, recusa e ticket médio por método.</p>
          </div>
        </article>

        <article class="rl-card">
          <h2>À vista e parcelado</h2>
          <p class="rl-muted">A análise deverá separar compras à vista e parcelas de 2x a 12x.</p>
          <div class="empty-state">
            <strong>Próximo endpoint</strong>
            <code>GET /admin/finance/installments</code>
            <p>Deverá calcular participação, ticket, custo e aprovação por quantidade de parcelas.</p>
          </div>
        </article>

        <article class="rl-card action-card">
          <h2>Ações operacionais</h2>
          <a routerLink="/admin/pedidos">Consultar pedidos e reembolsos →</a>
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
    .page-head p:last-child { max-width: 68ch; color: var(--rl-text-muted); }
    .metrics, .grid { display: grid; gap: var(--rl-space-4); }
    .metrics { margin-bottom: var(--rl-space-6); }
    .metric { display: grid; gap: var(--rl-space-2); }
    .metric span { color: var(--rl-text-subtle); font-size: var(--rl-text-sm); }
    .metric strong { font-size: var(--rl-text-2xl); }
    .metric small { color: var(--rl-text-muted); }
    .metric--danger { border-color: var(--rl-danger-500); }
    h2 { margin-top: 0; font-size: var(--rl-text-lg); }
    .empty-state { display: grid; gap: var(--rl-space-2); padding: var(--rl-space-4); border-radius: var(--rl-radius-md); background: var(--rl-surface-muted); }
    .empty-state p { margin: 0; color: var(--rl-text-muted); }
    .action-card { display: grid; align-content: start; gap: var(--rl-space-3); }
    .action-card a { color: var(--rl-brand-link); font-weight: var(--rl-weight-semibold); text-decoration: none; }
    @media (min-width: 760px) { .metrics { grid-template-columns: repeat(3, minmax(0, 1fr)); } .grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } .action-card { grid-column: 1 / -1; } }
  `],
})
export class AdminFinanceOverviewPage implements OnInit {
  private readonly admin = inject(AdminService);
  private readonly seo = inject(SeoService);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly data = signal<AdminDashboardDto | null>(null);
  readonly formatCurrency = formatCurrency;

  ngOnInit(): void {
    this.seo.apply({ title: 'Financeiro', description: 'Visão financeira da RomaLearn.', path: '/admin/financeiro', noIndex: true });
    this.admin.dashboard().subscribe({
      next: (data) => { this.data.set(data); this.loading.set(false); },
      error: (err: { message: string }) => { this.error.set(err.message); this.loading.set(false); },
    });
  }
}
