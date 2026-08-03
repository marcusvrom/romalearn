import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PlatformSettingsDto } from '@romalearn/contracts';
import { AlertComponent, LoadingStateComponent } from '@romalearn/ui';
import { SeoService } from '../../../core/seo.service';
import { AdminService } from '../admin.service';

@Component({
  selector: 'rl-admin-settings-page',
  standalone: true,
  imports: [FormsModule, LoadingStateComponent, AlertComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Configurações institucionais</h1>
    <p class="rl-muted">
      Estes valores aparecem nos e-mails, nos certificados e no site. O padrão vem das variáveis de
      ambiente; o que for salvo aqui prevalece.
    </p>

    @if (feedback(); as message) {
      <rl-alert [tone]="message.tone">{{ message.message }}</rl-alert>
    }

    @if (loading()) {
      <rl-loading label="Carregando configurações…" />
    }
    @if (!loading() && form(); as settings) {
      <section class="rl-card block">
        <h2>Identidade</h2>

        <div class="rl-field">
          <label class="rl-label" for="nome">Nome da plataforma</label>
          <input id="nome" class="rl-input" [(ngModel)]="settings.platformName" name="nome" />
        </div>

        <div class="rl-field">
          <label class="rl-label" for="razao">Razão social</label>
          <input id="razao" class="rl-input" [(ngModel)]="settings.legalName" name="razao" />
        </div>

        <div class="rl-field">
          <label class="rl-label" for="suporte">E-mail de suporte</label>
          <input
            id="suporte"
            type="email"
            class="rl-input"
            [(ngModel)]="settings.supportEmail"
            name="suporte"
          />
        </div>

        <div class="rl-field">
          <label class="rl-label" for="emissor">Nome da instituição emissora</label>
          <input
            id="emissor"
            class="rl-input"
            [(ngModel)]="settings.certificateIssuer"
            name="emissor"
          />
          <span class="rl-hint">
            Aparece nos certificados. Alterar aqui não muda certificados já emitidos: eles guardam
            uma cópia imutável dos dados.
          </span>
        </div>
      </section>

      <section class="rl-card block">
        <h2>Documentos legais</h2>

        <div class="grid">
          <div class="rl-field">
            <label class="rl-label" for="termos">Versão dos Termos de Uso</label>
            <input id="termos" class="rl-input" [(ngModel)]="settings.termsVersion" name="termos" />
          </div>

          <div class="rl-field">
            <label class="rl-label" for="privacidade">Versão da Política de Privacidade</label>
            <input
              id="privacidade"
              class="rl-input"
              [(ngModel)]="settings.privacyVersion"
              name="privacidade"
            />
          </div>
        </div>

        <p class="rl-small rl-muted">
          Ao mudar a versão, novos cadastros registram o aceite da nova versão.
        </p>
      </section>

      <section class="rl-card block">
        <h2>Landing page</h2>

        <label class="rl-checkbox">
          <input type="checkbox" [(ngModel)]="settings.testimonialsEnabled" name="depoimentos" />
          <span> Exibir a seção de depoimentos na página inicial </span>
        </label>
        <p class="rl-small rl-muted">
          Mantenha desligado enquanto não houver depoimentos reais e autorizados por quem os
          escreveu. A plataforma não usa depoimentos fictícios.
        </p>
      </section>

      <button
        type="button"
        class="rl-button rl-button--primary"
        [disabled]="saving()"
        (click)="save()"
      >
        {{ saving() ? 'Salvando…' : 'Salvar configurações' }}
      </button>
    }
  `,
  styles: [
    `
      h1 {
        font-size: var(--rl-text-2xl);
        margin-bottom: var(--rl-space-2);
      }

      .block {
        margin: var(--rl-space-6) 0;
      }

      .block h2 {
        font-size: var(--rl-text-lg);
        margin-bottom: var(--rl-space-4);
      }

      .grid {
        display: grid;
        gap: var(--rl-space-4);
      }

      @media (min-width: 560px) {
        .grid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }
      }
    `,
  ],
})
export class AdminSettingsPage implements OnInit {
  private readonly admin = inject(AdminService);
  private readonly seo = inject(SeoService);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly form = signal<PlatformSettingsDto | null>(null);
  readonly feedback = signal<{ tone: 'success' | 'error'; message: string } | null>(null);

  ngOnInit(): void {
    this.seo.apply({
      title: 'Configurações (admin)',
      description: 'Configurações institucionais da plataforma.',
      path: '/admin/configuracoes',
      noIndex: true,
    });

    this.admin.settings().subscribe({
      next: (settings) => {
        this.form.set({ ...settings });
        this.loading.set(false);
      },
      error: (err: { message: string }) => {
        this.feedback.set({ tone: 'error', message: err.message });
        this.loading.set(false);
      },
    });
  }

  save(): void {
    const settings = this.form();
    if (!settings) return;

    this.saving.set(true);
    this.feedback.set(null);

    this.admin.updateSettings(settings).subscribe({
      next: (updated) => {
        this.saving.set(false);
        this.form.set({ ...updated });
        this.feedback.set({ tone: 'success', message: 'Configurações salvas.' });
      },
      error: (err: { message: string }) => {
        this.saving.set(false);
        this.feedback.set({ tone: 'error', message: err.message });
      },
    });
  }
}
