import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { API_ROUTES, CertificateVerificationDto, WEB_ROUTES } from '@romalearn/contracts';
import { LoadingStateComponent } from '@romalearn/ui';
import { ApiService } from '../../core/api.service';
import { formatDate } from '../../core/format';
import { PLATFORM_CONFIG } from '../../core/platform.config';
import { SeoService } from '../../core/seo.service';

/**
 * Validação pública de certificado — destino do QR Code.
 *
 * Mostra só o necessário para conferir a autenticidade. Nenhum dado pessoal
 * além do nome do aluno é exibido (a API também não os envia).
 */
@Component({
  selector: 'rl-certificate-verification-page',
  standalone: true,
  imports: [FormsModule, RouterLink, LoadingStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rl-container rl-container--narrow rl-section">
      <header class="head">
        <p class="rl-eyebrow">Validação de certificado</p>
        <h1>Confira a autenticidade de um certificado</h1>
        <p class="rl-lead">
          Digite o código impresso no certificado ou use o QR Code. A consulta é pública e não exige
          cadastro.
        </p>
      </header>

      <form class="search" (ngSubmit)="search()">
        <label class="rl-label" for="codigo">Código de validação</label>
        <div class="search__row">
          <input
            id="codigo"
            name="codigo"
            class="rl-input"
            [(ngModel)]="code"
            placeholder="ABCD-EFGH-JKLM"
            autocomplete="off"
            spellcheck="false"
          />
          <button type="submit" class="rl-button rl-button--primary" [disabled]="loading()">
            Verificar
          </button>
        </div>
      </form>

      @if (loading()) {
        <rl-loading label="Consultando…" />
      }
      @if (!loading() && result(); as certificate) {
        @if (certificate.valid) {
          <section class="result result--valid" aria-live="polite">
            <p class="result__icon" aria-hidden="true">✓</p>
            <h2>Certificado válido</h2>
            <dl class="details">
              <div>
                <dt>Aluno</dt>
                <dd>{{ certificate.studentName }}</dd>
              </div>
              <div>
                <dt>Curso</dt>
                <dd>{{ certificate.subjectTitle }}</dd>
              </div>
              <div>
                <dt>Carga horária</dt>
                <dd>{{ certificate.workloadHours }} horas</dd>
              </div>
              <div>
                <dt>Conclusão</dt>
                <dd>{{ formatDate(certificate.completedAt) }}</dd>
              </div>
              <div>
                <dt>Emissão</dt>
                <dd>{{ formatDate(certificate.issuedAt) }}</dd>
              </div>
              <div>
                <dt>Instituição emissora</dt>
                <dd>{{ certificate.issuerName }}</dd>
              </div>
              <div>
                <dt>Situação</dt>
                <dd><span class="rl-badge rl-badge--free">Ativo</span></dd>
              </div>
            </dl>
            <p class="rl-small rl-muted">
              Código consultado: <strong>{{ certificate.verificationCode }}</strong>
            </p>
          </section>
        } @else if (certificate.status === 'REVOKED') {
          <section class="result result--revoked" role="alert">
            <p class="result__icon" aria-hidden="true">⚠</p>
            <h2>Certificado revogado</h2>
            <p>
              Este certificado existiu, mas foi revogado pela instituição emissora e não deve ser
              considerado válido.
            </p>
            <dl class="details">
              <div>
                <dt>Curso</dt>
                <dd>{{ certificate.subjectTitle }}</dd>
              </div>
              <div>
                <dt>Revogado em</dt>
                <dd>{{ formatDate(certificate.revokedAt) }}</dd>
              </div>
              @if (certificate.revocationReason) {
                <div>
                  <dt>Motivo</dt>
                  <dd>{{ certificate.revocationReason }}</dd>
                </div>
              }
            </dl>
          </section>
        } @else {
          <section class="result result--invalid" role="alert">
            <p class="result__icon" aria-hidden="true">✕</p>
            <h2>Certificado não encontrado</h2>
            <p>
              Não localizamos nenhum certificado com o código
              <strong>{{ certificate.verificationCode }}</strong
              >. Confira se o código foi digitado corretamente.
            </p>
            <p class="rl-small rl-muted">
              Em caso de dúvida, escreva para
              <a [href]="'mailto:' + config.supportEmail">{{ config.supportEmail }}</a
              >.
            </p>
          </section>
        }
      }

      <p class="back">
        <a [routerLink]="routes.home">Voltar ao início</a>
      </p>
    </div>
  `,
  styles: [
    `
      .head {
        margin-bottom: var(--rl-space-8);
      }

      .search {
        margin-bottom: var(--rl-space-8);
      }

      .search__row {
        display: flex;
        flex-direction: column;
        gap: var(--rl-space-3);
      }

      @media (min-width: 560px) {
        .search__row {
          flex-direction: row;
        }

        .search__row input {
          flex: 1;
        }
      }

      .result {
        padding: var(--rl-space-8);
        border-radius: var(--rl-radius-lg);
        border: 1px solid var(--rl-border);
        background: var(--rl-surface-raised);
        text-align: center;
      }

      .result h2 {
        font-size: var(--rl-text-xl);
      }

      .result__icon {
        display: grid;
        place-items: center;
        width: 56px;
        height: 56px;
        margin: 0 auto var(--rl-space-4);
        border-radius: var(--rl-radius-full);
        font-size: 1.6rem;
        font-weight: var(--rl-weight-bold);
      }

      .result--valid {
        border-color: var(--rl-success-500);
      }
      .result--valid .result__icon {
        background: var(--rl-success-100);
        color: var(--rl-success-700);
      }

      .result--revoked {
        border-color: var(--rl-warn-500);
      }
      .result--revoked .result__icon {
        background: var(--rl-warn-100);
        color: var(--rl-warn-700);
      }

      .result--invalid {
        border-color: var(--rl-danger-500);
      }
      .result--invalid .result__icon {
        background: var(--rl-danger-100);
        color: var(--rl-danger-700);
      }

      .details {
        display: grid;
        gap: var(--rl-space-4);
        text-align: left;
        margin: var(--rl-space-6) 0;
        padding-top: var(--rl-space-6);
        border-top: 1px solid var(--rl-border);
      }

      @media (min-width: 560px) {
        .details {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }

      dt {
        font-size: var(--rl-text-xs);
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--rl-text-subtle);
      }

      dd {
        margin: var(--rl-space-1) 0 0;
        font-weight: var(--rl-weight-medium);
      }

      .back {
        margin-top: var(--rl-space-8);
        text-align: center;
      }
    `,
  ],
})
export class CertificateVerificationPage implements OnInit {
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);
  readonly config = inject(PLATFORM_CONFIG);

  readonly routes = WEB_ROUTES;
  readonly loading = signal(false);
  readonly result = signal<CertificateVerificationDto | null>(null);
  readonly formatDate = formatDate;

  code = '';

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const codigo = params.get('codigo');
      if (codigo) {
        this.code = codigo;
        this.verify(codigo);
      }
    });
  }

  search(): void {
    const code = this.code.trim().toUpperCase();
    if (!code) return;

    // Mantém a URL compartilhável e coerente com o código consultado.
    void this.router.navigateByUrl(WEB_ROUTES.certificateVerification(code));
  }

  private verify(code: string): void {
    this.loading.set(true);

    this.api.get<CertificateVerificationDto>(API_ROUTES.certificates.verify(code)).subscribe({
      next: (result) => {
        this.result.set(result);
        this.loading.set(false);
        this.applySeo(result);
      },
      error: () => {
        this.result.set({
          valid: false,
          verificationCode: code,
          status: null,
          studentName: null,
          subjectTitle: null,
          workloadHours: null,
          completedAt: null,
          issuedAt: null,
          issuerName: null,
          revokedAt: null,
          revocationReason: null,
        });
        this.loading.set(false);
      },
    });
  }

  private applySeo(result: CertificateVerificationDto): void {
    this.seo.apply({
      title: 'Validação de certificado',
      description: result.valid
        ? `Certificado válido de ${result.subjectTitle}, com ${result.workloadHours} horas.`
        : 'Confira a autenticidade de um certificado emitido pela plataforma.',
      path: WEB_ROUTES.certificateVerification(result.verificationCode),
    });
  }
}
