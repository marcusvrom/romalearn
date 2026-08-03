import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CertificateDto, CertificateStatus, WEB_ROUTES } from '@romalearn/contracts';
import { AlertComponent, EmptyStateComponent, LoadingStateComponent } from '@romalearn/ui';
import { formatDate } from '../../core/format';
import { LearningService } from '../../core/learning.service';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'rl-certificates-page',
  standalone: true,
  imports: [RouterLink, LoadingStateComponent, EmptyStateComponent, AlertComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rl-container rl-section">
      <header class="head">
        <p class="rl-eyebrow">Meus certificados</p>
        <h1>Certificados emitidos</h1>
        <p class="rl-lead">
          Cada certificado tem um código público de validação. Você pode compartilhar o link com
          quem precisar conferir a autenticidade.
        </p>
      </header>

      @if (loading()) {
        <rl-loading label="Carregando seus certificados…" />
      }
      @if (!loading() && error(); as message) {
        <rl-alert tone="error" title="Não foi possível carregar">{{ message }}</rl-alert>
      }
      @if (!loading() && !error() && certificates().length === 0) {
        <rl-empty
          title="Nenhum certificado ainda"
          description="Conclua um curso para receber o certificado automaticamente."
          icon="🎓"
        >
          <a class="rl-button rl-button--primary" [routerLink]="routes.dashboard">
            Ver meus cursos
          </a>
        </rl-empty>
      }
      @if (!loading() && !error() && certificates().length > 0) {
        <div class="rl-grid rl-grid--2">
          @for (certificate of certificates(); track certificate.id) {
            <article
              class="rl-card certificate"
              [class.certificate--revoked]="isRevoked(certificate)"
            >
              <div class="certificate__head">
                <h2>{{ certificate.subjectTitle }}</h2>
                @if (isRevoked(certificate)) {
                  <span class="rl-badge rl-badge--danger">Revogado</span>
                } @else {
                  <span class="rl-badge rl-badge--free">Ativo</span>
                }
              </div>

              <dl class="details">
                <div>
                  <dt>Aluno</dt>
                  <dd>{{ certificate.studentName }}</dd>
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
                  <dt>Código</dt>
                  <dd class="code">{{ certificate.verificationCode }}</dd>
                </div>
              </dl>

              @if (isRevoked(certificate)) {
                <rl-alert tone="warn">
                  Este certificado foi revogado e não pode ser baixado. Fale com o suporte se tiver
                  dúvidas.
                </rl-alert>
              } @else {
                <div class="certificate__actions">
                  <a
                    class="rl-button rl-button--primary rl-button--small"
                    [href]="pdfUrl(certificate.id)"
                    target="_blank"
                    rel="noopener"
                  >
                    Baixar PDF
                  </a>
                  <a
                    class="rl-button rl-button--secondary rl-button--small"
                    [routerLink]="routes.certificateVerification(certificate.verificationCode)"
                  >
                    Ver validação pública
                  </a>
                </div>
              }
            </article>
          }
        </div>
      }
    </div>
  `,
  styles: [
    `
      .head {
        max-width: 62ch;
        margin-bottom: var(--rl-space-8);
      }

      .certificate {
        display: flex;
        flex-direction: column;
        gap: var(--rl-space-4);
      }

      .certificate--revoked {
        border-color: var(--rl-danger-500);
      }

      .certificate__head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: var(--rl-space-3);
      }

      .certificate__head h2 {
        font-size: var(--rl-text-lg);
        margin: 0;
      }

      .details {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--rl-space-4);
        margin: 0;
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

      .code {
        font-family: var(--rl-font-mono);
        font-size: var(--rl-text-sm);
      }

      .certificate__actions {
        display: flex;
        flex-wrap: wrap;
        gap: var(--rl-space-2);
      }
    `,
  ],
})
export class CertificatesPage implements OnInit {
  private readonly learning = inject(LearningService);
  private readonly seo = inject(SeoService);

  readonly routes = WEB_ROUTES;
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly certificates = signal<CertificateDto[]>([]);
  readonly formatDate = formatDate;

  ngOnInit(): void {
    this.seo.apply({
      title: 'Meus certificados',
      description: 'Certificados emitidos para os cursos concluídos.',
      path: WEB_ROUTES.certificates,
      noIndex: true,
    });

    this.learning.certificates().subscribe({
      next: (certificates) => {
        this.certificates.set(certificates);
        this.loading.set(false);
      },
      error: (err: { message: string }) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  isRevoked(certificate: CertificateDto): boolean {
    return certificate.status === CertificateStatus.REVOKED;
  }

  pdfUrl(id: string): string {
    return this.learning.certificatePdfUrl(id);
  }
}
