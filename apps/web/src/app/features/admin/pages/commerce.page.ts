import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CouponDto, DiscountType, OfferDto, ProductDto } from '@romalearn/contracts';
import { AlertComponent, LoadingStateComponent } from '@romalearn/ui';
import { formatCurrency } from '../../../core/format';
import { SeoService } from '../../../core/seo.service';
import { AdminService } from '../admin.service';

@Component({
  selector: 'rl-admin-commerce-page',
  standalone: true,
  imports: [FormsModule, LoadingStateComponent, AlertComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Produtos, ofertas e cupons</h1>

    @if (feedback(); as message) {
      <rl-alert [tone]="message.tone">{{ message.message }}</rl-alert>
    }

    @if (loading()) {
      <rl-loading label="Carregando…" />
    } @else {
      <!-- Produtos -->
      <section class="block">
        <h2>Produtos</h2>
        <p class="rl-small rl-muted">
          Produto é o que se vende; a oferta define preço e condições. Produtos em rascunho não
          aparecem no site.
        </p>

        <div class="rl-table-scroll">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Produto</th>
                <th scope="col">Tipo</th>
                <th scope="col">Situação</th>
                <th scope="col">Ofertas</th>
              </tr>
            </thead>
            <tbody>
              @for (product of products(); track product.id) {
                <tr>
                  <td>{{ product.name }}</td>
                  <td>{{ product.type === 'PROGRAM' ? 'Trilha' : 'Curso' }}</td>
                  <td>
                    <span
                      class="rl-badge"
                      [class.rl-badge--free]="product.status === 'PUBLISHED'"
                      [class.rl-badge--warn]="product.status === 'DRAFT'"
                    >
                      {{ product.status === 'PUBLISHED' ? 'Publicado' : 'Rascunho' }}
                    </span>
                  </td>
                  <td>{{ product.offers.length }}</td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>

      <!-- Ofertas -->
      <section class="block">
        <h2>Ofertas</h2>
        <div class="rl-table-scroll">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Oferta</th>
                <th scope="col">Preço</th>
                <th scope="col">Ambiente</th>
                <th scope="col">Situação</th>
              </tr>
            </thead>
            <tbody>
              @for (offer of offers(); track offer.id) {
                <tr>
                  <td>{{ offer.name }}</td>
                  <td>{{ formatCurrency(offer.priceCents, offer.currency) }}</td>
                  <td>
                    <span class="rl-badge" [class.rl-badge--warn]="offer.environment === 'SANDBOX'">
                      {{ offer.environment === 'SANDBOX' ? 'Teste (sandbox)' : 'Produção' }}
                    </span>
                  </td>
                  <td>
                    <span class="rl-badge" [class.rl-badge--free]="offer.status === 'ACTIVE'">
                      {{ offer.status === 'ACTIVE' ? 'Ativa' : 'Rascunho' }}
                    </span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <p class="rl-small rl-muted">
          Ofertas marcadas como <strong>teste (sandbox)</strong> são recusadas automaticamente em
          produção. Publique uma oferta de produção só quando houver preço comercial aprovado.
        </p>
      </section>

      <!-- Cupons -->
      <section class="block">
        <h2>Cupons</h2>

        <div class="rl-card form">
          <h3>Novo cupom</h3>
          <div class="grid">
            <div class="rl-field">
              <label class="rl-label" for="codigo">Código</label>
              <input id="codigo" class="rl-input" [(ngModel)]="draft.code" name="codigo" />
            </div>
            <div class="rl-field">
              <label class="rl-label" for="tipo">Tipo</label>
              <select id="tipo" class="rl-select" [(ngModel)]="draft.discountType" name="tipo">
                <option [value]="discountTypes.PERCENTAGE">Percentual (%)</option>
                <option [value]="discountTypes.FIXED_AMOUNT">Valor fixo (centavos)</option>
              </select>
            </div>
            <div class="rl-field">
              <label class="rl-label" for="valor">Valor</label>
              <input
                id="valor"
                type="number"
                min="1"
                class="rl-input"
                [(ngModel)]="draft.discountValue"
                name="valor"
              />
            </div>
          </div>
          <button type="button" class="rl-button rl-button--primary" (click)="createCoupon()">
            Criar cupom
          </button>
        </div>

        <div class="rl-table-scroll">
          <table class="table">
            <thead>
              <tr>
                <th scope="col">Código</th>
                <th scope="col">Desconto</th>
                <th scope="col">Usos</th>
                <th scope="col">Situação</th>
                <th scope="col">Ação</th>
              </tr>
            </thead>
            <tbody>
              @for (coupon of coupons(); track coupon.id) {
                <tr>
                  <td class="code">{{ coupon.code }}</td>
                  <td>
                    {{
                      coupon.discountType === 'PERCENTAGE'
                        ? coupon.discountValue + '%'
                        : formatCurrency(coupon.discountValue)
                    }}
                  </td>
                  <td>
                    {{ coupon.redemptions
                    }}{{ coupon.maxRedemptions ? ' / ' + coupon.maxRedemptions : '' }}
                  </td>
                  <td>
                    <span class="rl-badge" [class.rl-badge--free]="coupon.active">
                      {{ coupon.active ? 'Ativo' : 'Inativo' }}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      class="rl-button rl-button--secondary rl-button--small"
                      (click)="toggleCoupon(coupon)"
                    >
                      {{ coupon.active ? 'Desativar' : 'Ativar' }}
                    </button>
                  </td>
                </tr>
              } @empty {
                <tr>
                  <td colspan="5" class="rl-muted">Nenhum cupom cadastrado.</td>
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
      h1 {
        font-size: var(--rl-text-2xl);
        margin-bottom: var(--rl-space-6);
      }

      .block {
        margin-bottom: var(--rl-space-10);
      }

      .block h2 {
        font-size: var(--rl-text-lg);
        margin-bottom: var(--rl-space-3);
      }

      .form {
        margin-bottom: var(--rl-space-4);
      }

      .form h3 {
        font-size: var(--rl-text-base);
        margin-bottom: var(--rl-space-4);
      }

      .grid {
        display: grid;
        gap: var(--rl-space-4);
      }

      @media (min-width: 720px) {
        .grid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }
      }

      .table {
        width: 100%;
        min-width: 640px;
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
    `,
  ],
})
export class AdminCommercePage implements OnInit {
  private readonly admin = inject(AdminService);
  private readonly seo = inject(SeoService);

  readonly loading = signal(true);
  readonly products = signal<ProductDto[]>([]);
  readonly offers = signal<OfferDto[]>([]);
  readonly coupons = signal<CouponDto[]>([]);
  readonly feedback = signal<{ tone: 'success' | 'error'; message: string } | null>(null);

  readonly discountTypes = DiscountType;
  readonly formatCurrency = formatCurrency;

  draft = { code: '', discountType: DiscountType.PERCENTAGE as DiscountType, discountValue: 10 };

  ngOnInit(): void {
    this.seo.apply({
      title: 'Comércio (admin)',
      description: 'Produtos, ofertas e cupons.',
      path: '/admin/produtos',
      noIndex: true,
    });
    this.load();
  }

  private load(): void {
    this.loading.set(true);

    this.admin.listProducts().subscribe({
      next: (products) => {
        this.products.set(products);
        this.loading.set(false);
      },
      error: (err: { message: string }) => {
        this.feedback.set({ tone: 'error', message: err.message });
        this.loading.set(false);
      },
    });

    this.admin.listOffers().subscribe({
      next: (offers) => this.offers.set(offers),
      error: () => undefined,
    });

    this.admin.listCoupons().subscribe({
      next: (coupons) => this.coupons.set(coupons),
      error: () => undefined,
    });
  }

  createCoupon(): void {
    if (!this.draft.code.trim()) {
      this.feedback.set({ tone: 'error', message: 'Informe o código do cupom.' });
      return;
    }

    this.admin.createCoupon({ ...this.draft }).subscribe({
      next: () => {
        this.draft = { code: '', discountType: DiscountType.PERCENTAGE, discountValue: 10 };
        this.feedback.set({ tone: 'success', message: 'Cupom criado.' });
        this.load();
      },
      error: (err: { message: string }) =>
        this.feedback.set({ tone: 'error', message: err.message }),
    });
  }

  toggleCoupon(coupon: CouponDto): void {
    this.admin.setCouponActive(coupon.id, !coupon.active).subscribe({
      next: () => this.load(),
      error: (err: { message: string }) =>
        this.feedback.set({ tone: 'error', message: err.message }),
    });
  }
}
