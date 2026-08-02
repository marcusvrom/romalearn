import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CheckoutResultDto, PaymentMethod, ProductDto, WEB_ROUTES } from '@romalearn/contracts';
import { AlertComponent, LoadingStateComponent } from '@romalearn/ui';
import { AuthService } from '../../core/auth.service';
import { CatalogService } from '../../core/catalog.service';
import { formatCurrency } from '../../core/format';
import { LearningService } from '../../core/learning.service';
import { PLATFORM_CONFIG } from '../../core/platform.config';
import { SeoService } from '../../core/seo.service';

/**
 * Checkout.
 *
 * O preço mostrado aqui é sempre o que a API devolveu — a tela não calcula
 * nada por conta própria e não envia valores para o backend.
 */
@Component({
  selector: 'rl-checkout-page',
  standalone: true,
  imports: [FormsModule, RouterLink, LoadingStateComponent, AlertComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rl-container rl-container--narrow rl-section">
      @if (loading()) {
        <rl-loading label="Preparando seu pedido…" />
      }
      @if (!loading() && result(); as checkout) {
        <!-- Depois de criar o pedido -->
        @if (checkout.accessGranted) {
          <section class="done">
            <p class="done__icon" aria-hidden="true">✓</p>
            <h1>Acesso liberado</h1>
            <p class="rl-lead">Tudo certo! Você já pode começar a estudar.</p>
            <a class="rl-button rl-button--primary" [routerLink]="routes.dashboard">
              Ir para os meus cursos
            </a>
          </section>
        }
        @if (!checkout.accessGranted && checkout.payment; as payment) {
          <section class="payment">
            <p class="rl-eyebrow">Pedido {{ checkout.order.reference }}</p>
            <h1>Falta pouco: conclua o pagamento</h1>

            @if (payment.pixQrCode) {
              <div class="rl-card pix">
                <h2>Pague com Pix</h2>
                <p class="rl-small rl-muted">
                  Copie o código abaixo e cole no aplicativo do seu banco.
                </p>
                <code class="pix__code">{{ payment.pixQrCode }}</code>
                <button
                  type="button"
                  class="rl-button rl-button--secondary"
                  (click)="copyPix(payment.pixQrCode!)"
                >
                  {{ copied() ? 'Código copiado ✓' : 'Copiar código Pix' }}
                </button>
              </div>
            }

            @if (payment.checkoutUrl) {
              <a
                class="rl-button rl-button--primary rl-button--block"
                [href]="payment.checkoutUrl"
                target="_blank"
                rel="noopener"
              >
                Abrir a página de pagamento
              </a>
            }

            <rl-alert tone="info" title="O acesso é liberado após a confirmação">
              Assim que o provedor confirmar o pagamento, liberamos o acesso automaticamente e
              enviamos um e-mail. Isso costuma levar alguns minutos no Pix.
            </rl-alert>

            @if (isSandbox()) {
              <rl-alert tone="warn" title="Ambiente de demonstração">
                Este pedido usa o provedor de pagamento simulado. Nenhuma cobrança real é feita e o
                código Pix acima não é válido em bancos.
              </rl-alert>
            }

            <a
              class="rl-button rl-button--secondary rl-button--block"
              [routerLink]="routes.purchases"
            >
              Acompanhar meus pedidos
            </a>
          </section>
        }
      }
      @if (!loading() && !result()) {
        <!-- Antes de criar o pedido -->
        <header class="head">
          <p class="rl-eyebrow">Finalizar compra</p>
          <h1>Confira seu pedido</h1>
        </header>

        @if (error(); as message) {
          <rl-alert tone="error">{{ message }}</rl-alert>
        }

        @if (offer(); as offer) {
          <section class="rl-card summary">
            <div class="summary__row">
              <div>
                <p class="summary__product">{{ productName() }}</p>
                <p class="rl-small rl-muted">{{ offer.name }}</p>
              </div>
              <p class="summary__price">{{ formatCurrency(offer.priceCents, offer.currency) }}</p>
            </div>

            @if (discountCents() > 0) {
              <div class="summary__row summary__row--discount">
                <span>Desconto ({{ appliedCoupon() }})</span>
                <span>− {{ formatCurrency(discountCents(), offer.currency) }}</span>
              </div>
            }

            <div class="summary__row summary__row--total">
              <span>Total</span>
              <strong>{{ formatCurrency(totalCents(), offer.currency) }}</strong>
            </div>

            @if (offer.environment === 'SANDBOX') {
              <p class="rl-small sandbox">
                Oferta de demonstração (ambiente de testes). Nenhuma cobrança real é feita.
              </p>
            }
          </section>

          <!-- Cupom -->
          <section class="rl-card block">
            <h2>Tem um cupom?</h2>
            <div class="coupon">
              <input
                class="rl-input"
                [(ngModel)]="couponCode"
                name="cupom"
                placeholder="Digite o código"
                aria-label="Código do cupom"
              />
              <button
                type="button"
                class="rl-button rl-button--secondary"
                [disabled]="validatingCoupon()"
                (click)="applyCoupon()"
              >
                Aplicar
              </button>
            </div>
            @if (couponFeedback(); as message) {
              <p class="rl-small" [class.rl-error]="!appliedCoupon()">{{ message }}</p>
            }
          </section>

          <!-- Forma de pagamento -->
          <section class="rl-card block">
            <h2>Como você quer pagar?</h2>
            <div class="methods" role="radiogroup" aria-label="Forma de pagamento">
              @for (option of methods; track option.value) {
                <label class="method" [class.method--checked]="method === option.value">
                  <input type="radio" name="metodo" [value]="option.value" [(ngModel)]="method" />
                  <span>
                    <strong>{{ option.label }}</strong>
                    <span class="rl-small rl-muted">{{ option.hint }}</span>
                  </span>
                </label>
              }
            </div>
          </section>

          <button
            type="button"
            class="rl-button rl-button--primary rl-button--block"
            [disabled]="submitting()"
            (click)="submit()"
          >
            {{ submitting() ? 'Criando pedido…' : 'Continuar para o pagamento' }}
          </button>

          <p class="rl-small rl-muted terms">
            Ao continuar, você concorda com os
            <a [routerLink]="routes.terms">Termos de Uso</a>. Você pode pedir reembolso em até 7
            dias corridos, conforme o Código de Defesa do Consumidor.
          </p>
        }
      }
    </div>
  `,
  styles: [
    `
      .head {
        margin-bottom: var(--rl-space-6);
      }

      .summary,
      .block {
        margin-bottom: var(--rl-space-5);
      }

      .block h2 {
        font-size: var(--rl-text-base);
        margin-bottom: var(--rl-space-3);
      }

      .summary__row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: var(--rl-space-4);
        padding-block: var(--rl-space-3);
      }

      .summary__row--discount {
        color: var(--rl-success-700);
        border-top: 1px solid var(--rl-border);
        font-size: var(--rl-text-sm);
      }

      .summary__row--total {
        border-top: 1px solid var(--rl-border);
        font-size: var(--rl-text-lg);
      }

      .summary__product {
        margin: 0;
        font-weight: var(--rl-weight-semibold);
      }

      .summary__price {
        margin: 0;
        font-weight: var(--rl-weight-semibold);
      }

      .sandbox {
        margin: var(--rl-space-3) 0 0;
        padding: var(--rl-space-2) var(--rl-space-3);
        background: var(--rl-warn-100);
        color: var(--rl-warn-700);
        border-radius: var(--rl-radius-sm);
      }

      .coupon {
        display: flex;
        flex-direction: column;
        gap: var(--rl-space-2);
      }

      @media (min-width: 480px) {
        .coupon {
          flex-direction: row;
        }
        .coupon input {
          flex: 1;
        }
      }

      .methods {
        display: grid;
        gap: var(--rl-space-2);
      }

      .method {
        display: flex;
        align-items: flex-start;
        gap: var(--rl-space-3);
        padding: var(--rl-space-4);
        border: 1px solid var(--rl-border);
        border-radius: var(--rl-radius-md);
        cursor: pointer;
        min-height: 44px;
      }

      .method--checked {
        border-color: var(--rl-brand-600);
        background: var(--rl-brand-50);
      }

      .method span span {
        display: block;
      }

      .method input {
        width: 20px;
        height: 20px;
        margin-top: 2px;
      }

      .terms {
        margin-top: var(--rl-space-4);
        text-align: center;
      }

      .done {
        text-align: center;
        padding: var(--rl-space-12) 0;
      }

      .done__icon {
        display: grid;
        place-items: center;
        width: 64px;
        height: 64px;
        margin: 0 auto var(--rl-space-5);
        border-radius: var(--rl-radius-full);
        background: var(--rl-success-100);
        color: var(--rl-success-700);
        font-size: 1.8rem;
        font-weight: var(--rl-weight-bold);
      }

      .pix {
        margin-bottom: var(--rl-space-5);
      }

      .pix h2 {
        font-size: var(--rl-text-base);
      }

      .pix__code {
        display: block;
        padding: var(--rl-space-3);
        margin-bottom: var(--rl-space-4);
        background: var(--rl-surface-muted);
        border-radius: var(--rl-radius-sm);
        font-size: var(--rl-text-xs);
        word-break: break-all;
      }
    `,
  ],
})
export class CheckoutPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly catalog = inject(CatalogService);
  private readonly learning = inject(LearningService);
  private readonly seo = inject(SeoService);
  private readonly auth = inject(AuthService);
  readonly config = inject(PLATFORM_CONFIG);

  readonly routes = WEB_ROUTES;
  readonly formatCurrency = formatCurrency;

  readonly loading = signal(true);
  readonly submitting = signal(false);
  readonly validatingCoupon = signal(false);
  readonly error = signal<string | null>(null);
  readonly offer = signal<ProductDto['offers'][number] | null>(null);
  readonly productName = signal('');
  readonly result = signal<CheckoutResultDto | null>(null);
  readonly copied = signal(false);

  readonly discountCents = signal(0);
  readonly totalCents = signal(0);
  readonly appliedCoupon = signal<string | null>(null);
  readonly couponFeedback = signal<string | null>(null);

  couponCode = '';
  method: PaymentMethod = PaymentMethod.PIX;

  readonly methods = [
    { value: PaymentMethod.PIX, label: 'Pix', hint: 'Aprovação em poucos minutos' },
    {
      value: PaymentMethod.CREDIT_CARD,
      label: 'Cartão de crédito',
      hint: 'Parcelamento disponível',
    },
  ];

  ngOnInit(): void {
    this.seo.apply({
      title: 'Finalizar compra',
      description: 'Confirme seu pedido e escolha a forma de pagamento.',
      path: '/checkout',
      noIndex: true,
    });

    const offerId = this.route.snapshot.paramMap.get('offerId');
    if (!offerId) {
      this.error.set('Oferta não informada.');
      this.loading.set(false);
      return;
    }

    this.catalog.listProducts().subscribe({
      next: (products) => {
        for (const product of products) {
          const found = product.offers.find((item) => item.id === offerId);
          if (found) {
            this.offer.set(found);
            this.productName.set(product.name);
            this.totalCents.set(found.priceCents);
            break;
          }
        }

        if (!this.offer()) {
          this.error.set('Esta oferta não está disponível no momento.');
        }
        this.loading.set(false);
      },
      error: (err: { message: string }) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  isSandbox(): boolean {
    return this.offer()?.environment === 'SANDBOX';
  }

  applyCoupon(): void {
    const offer = this.offer();
    const code = this.couponCode.trim().toUpperCase();
    if (!offer || !code) return;

    this.validatingCoupon.set(true);
    this.couponFeedback.set(null);

    // Quem calcula o desconto é a API; a tela só exibe o que voltou.
    this.learning.validateCoupon(code, offer.id).subscribe({
      next: (price) => {
        this.validatingCoupon.set(false);
        this.discountCents.set(price.discountCents);
        this.totalCents.set(price.totalCents);
        this.appliedCoupon.set(code);
        this.couponFeedback.set('Cupom aplicado.');
      },
      error: (err: { message: string }) => {
        this.validatingCoupon.set(false);
        this.appliedCoupon.set(null);
        this.discountCents.set(0);
        this.totalCents.set(offer.priceCents);
        this.couponFeedback.set(err.message);
      },
    });
  }

  submit(): void {
    const offer = this.offer();
    if (!offer) return;

    if (!this.auth.isAuthenticated()) {
      void this.router.navigate([WEB_ROUTES.login], {
        queryParams: { redirecionar: WEB_ROUTES.checkout(offer.id) },
      });
      return;
    }

    this.submitting.set(true);
    this.error.set(null);

    this.learning.checkout(offer.id, this.method, this.appliedCoupon() ?? undefined).subscribe({
      next: (result) => {
        this.submitting.set(false);
        this.result.set(result);
      },
      error: (err: { message: string }) => {
        this.submitting.set(false);
        this.error.set(err.message);
      },
    });
  }

  copyPix(code: string): void {
    void navigator.clipboard?.writeText(code).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 3000);
    });
  }
}
