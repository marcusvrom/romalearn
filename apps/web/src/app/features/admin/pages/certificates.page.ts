import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { CertificateDto, CertificateStatus } from '@romalearn/contracts';
import { AlertComponent, LoadingStateComponent } from '@romalearn/ui';
import { formatDate } from '../../../core/format';
import { SeoService } from '../../../core/seo.service';
import { AdminService } from '../admin.service';

@Component({
  selector: 'rl-admin-certificates-page',
  standalone: true,
  imports: [LoadingStateComponent, AlertComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Certificados</h1>
    <p class="rl-muted">
      Certificados emitidos automaticamente quando o aluno cumpre os critérios do curso.
    </p>

    @if (feedback(); as message) {
      <rl-alert [tone]="message.tone">{{ message.message }}</rl-alert>
    }

    @if (loading()) {
      <rl-loading label="Carregando certificados…" />
    } @else {
      <div class="rl-table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Código</th>
              <th scope="col">Aluno</th>
              <th scope="col">Curso</th>
              <th scope="col">Emissão</th>
              <th scope="col">Situação</th>
              <th scope="col">Ações</th>
            </tr>
          </thead>
          <tbody>
            @for (certificate of certificates(); track certificate.id) {
              <tr>
                <td class="code">{{ certificate.verificationCode }}</td>
                <td>{{ certificate.studentName }}</td>
                <td>{{ certificate.subjectTitle }}</td>
                <td>{{ formatDate(certificate.issuedAt) }}</td>
                <td>
                  <span
                    class="rl-badge"
                    [class.rl-badge--free]="certificate.status === active"
                    [class.rl-badge--danger]="certificate.status !== active"
                  >
                    {{ certificate.status === active ? 'Ativo' : 'Revogado' }}
                  </span>
                </td>
                <td class="actions">
                  <a
                    class="rl-button rl-button--secondary rl-button--small"
                    [href]="certificate.verificationUrl"
                    target="_blank"
                    rel="noopener"
                  >
                    Validação
                  </a>
                  @if (certificate.status === active) {
                    <button
                      type="button"
                      class="rl-button rl-button--secondary rl-button--small"
                      (click)="reissue(certificate)"
                    >
                      Reemitir
                    </button>
                    <button
                      type="button"
                      class="rl-button rl-button--danger rl-button--small"
                      (click)="revoke(certificate)"
                    >
                      Revogar
                    </button>
                  }
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="6" class="rl-muted">Nenhum certificado emitido ainda.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }
  `,
  styles: [
    `
      h1 {
        font-size: var(--rl-text-2xl);
        margin-bottom: var(--rl-space-2);
      }

      .table {
        width: 100%;
        min-width: 860px;
        border-collapse: collapse;
        background: var(--rl-surface-raised);
        border-radius: var(--rl-radius-lg);
        overflow: hidden;
        margin-top: var(--rl-space-6);
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
        font-size: var(--rl-text-xs);
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: var(--rl-space-2);
      }
    `,
  ],
})
export class AdminCertificatesPage implements OnInit {
  private readonly admin = inject(AdminService);
  private readonly seo = inject(SeoService);

  readonly loading = signal(true);
  readonly certificates = signal<CertificateDto[]>([]);
  readonly feedback = signal<{ tone: 'success' | 'error'; message: string } | null>(null);
  readonly active = CertificateStatus.ACTIVE;
  readonly formatDate = formatDate;

  ngOnInit(): void {
    this.seo.apply({
      title: 'Certificados (admin)',
      description: 'Consulta, reemissão e revogação de certificados.',
      path: '/admin/certificados',
      noIndex: true,
    });
    this.load();
  }

  private load(): void {
    this.loading.set(true);

    this.admin.listCertificates().subscribe({
      next: (certificates) => {
        this.certificates.set(certificates);
        this.loading.set(false);
      },
      error: (err: { message: string }) => {
        this.feedback.set({ tone: 'error', message: err.message });
        this.loading.set(false);
      },
    });
  }

  revoke(certificate: CertificateDto): void {
    // Revogar é irreversível pela interface: exige justificativa explícita.
    const reason = globalThis.prompt(
      `Informe o motivo da revogação do certificado ${certificate.verificationCode}:`,
    );
    if (!reason?.trim()) return;

    this.admin.revokeCertificate(certificate.id, reason.trim()).subscribe({
      next: () => {
        this.feedback.set({ tone: 'success', message: 'Certificado revogado.' });
        this.load();
      },
      error: (err: { message: string }) =>
        this.feedback.set({ tone: 'error', message: err.message }),
    });
  }

  reissue(certificate: CertificateDto): void {
    const reason = globalThis.prompt('Informe o motivo da reemissão:');
    if (!reason?.trim()) return;

    this.admin.reissueCertificate(certificate.id, reason.trim()).subscribe({
      next: () => {
        this.feedback.set({
          tone: 'success',
          message: 'Certificado reemitido com o mesmo código de validação.',
        });
        this.load();
      },
      error: (err: { message: string }) =>
        this.feedback.set({ tone: 'error', message: err.message }),
    });
  }
}
