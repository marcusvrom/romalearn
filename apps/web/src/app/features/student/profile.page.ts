import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { WEB_ROUTES } from '@romalearn/contracts';
import { AlertComponent } from '@romalearn/ui';
import { AuthService } from '../../core/auth.service';
import { formatDate } from '../../core/format';
import { PLATFORM_CONFIG } from '../../core/platform.config';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'rl-profile-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AlertComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rl-container rl-container--narrow rl-section">
      <header class="head">
        <p class="rl-eyebrow">Minha conta</p>
        <h1>Perfil e configurações</h1>
      </header>

      <!-- Dados pessoais -->
      <section class="rl-card block">
        <h2>Seus dados</h2>

        @if (profileFeedback(); as message) {
          <rl-alert [tone]="message.tone">{{ message.message }}</rl-alert>
        }

        <form [formGroup]="profileForm" (ngSubmit)="saveProfile()" novalidate>
          <div class="rl-field">
            <label class="rl-label" for="nome">Nome completo</label>
            <input id="nome" class="rl-input" formControlName="name" autocomplete="name" />
          </div>

          <div class="rl-field">
            <label class="rl-label" for="telefone">Telefone</label>
            <input id="telefone" class="rl-input" formControlName="phone" autocomplete="tel" />
            <span class="rl-hint">Opcional. Usamos apenas para contato de suporte.</span>
          </div>

          <div class="rl-field">
            <label class="rl-label" for="email">E-mail</label>
            <input id="email" class="rl-input" [value]="user()?.email ?? ''" disabled />
            <span class="rl-hint">
              Para trocar de e-mail, fale com o suporte:
              <a [href]="'mailto:' + config.supportEmail">{{ config.supportEmail }}</a>
            </span>
          </div>

          <button type="submit" class="rl-button rl-button--primary" [disabled]="savingProfile()">
            {{ savingProfile() ? 'Salvando…' : 'Salvar alterações' }}
          </button>
        </form>
      </section>

      <!-- Senha -->
      <section class="rl-card block">
        <h2>Alterar senha</h2>
        <p class="rl-small rl-muted">
          Ao alterar a senha, todas as sessões abertas são encerradas e você entra novamente.
        </p>

        @if (passwordFeedback(); as message) {
          <rl-alert [tone]="message.tone">{{ message.message }}</rl-alert>
        }

        <form [formGroup]="passwordForm" (ngSubmit)="changePassword()" novalidate>
          <div class="rl-field">
            <label class="rl-label" for="senha-atual">Senha atual</label>
            <input
              id="senha-atual"
              type="password"
              class="rl-input"
              formControlName="currentPassword"
              autocomplete="current-password"
            />
          </div>

          <div class="rl-field">
            <label class="rl-label" for="senha-nova">Nova senha</label>
            <input
              id="senha-nova"
              type="password"
              class="rl-input"
              formControlName="newPassword"
              autocomplete="new-password"
              aria-describedby="dica-senha"
            />
            <span class="rl-hint" id="dica-senha">
              Pelo menos 10 caracteres, com letras e números.
            </span>
          </div>

          <button
            type="submit"
            class="rl-button rl-button--secondary"
            [disabled]="savingPassword()"
          >
            {{ savingPassword() ? 'Alterando…' : 'Alterar senha' }}
          </button>
        </form>
      </section>

      <!-- Termos e privacidade -->
      <section class="rl-card block">
        <h2>Termos e privacidade</h2>
        <dl class="terms">
          <div>
            <dt>Termos aceitos</dt>
            <dd>
              @if (user()?.termsAcceptedAt) {
                Versão {{ user()?.termsAcceptedVersion }} em
                {{ formatDate(user()?.termsAcceptedAt) }}
              } @else {
                —
              }
            </dd>
          </div>
          <div>
            <dt>E-mail confirmado</dt>
            <dd>{{ user()?.emailVerifiedAt ? 'Sim' : 'Ainda não' }}</dd>
          </div>
          <div>
            <dt>Conta criada em</dt>
            <dd>{{ formatDate(user()?.createdAt) }}</dd>
          </div>
        </dl>

        <p class="rl-small rl-muted">
          Consulte os <a [routerLink]="routes.terms">Termos de Uso</a> e a
          <a [routerLink]="routes.privacy">Política de Privacidade</a>.
        </p>
      </section>

      <!-- Exclusão de conta -->
      <section class="rl-card block block--danger">
        <h2>Excluir minha conta</h2>
        <p class="rl-small rl-muted">
          Para excluir sua conta, escreva para
          <a [href]="'mailto:' + config.supportEmail">{{ config.supportEmail }}</a>
          a partir deste e-mail. Confirmada a identidade, a conta é anonimizada em até 30 dias:
          nome, e-mail e telefone são substituídos por dados neutros.
        </p>
        <p class="rl-small rl-muted">
          Registros de pedidos e certificados já emitidos são preservados de forma desvinculada da
          sua identidade, por exigência legal.
        </p>
      </section>
    </div>
  `,
  styles: [
    `
      .head {
        margin-bottom: var(--rl-space-8);
      }

      .block {
        margin-bottom: var(--rl-space-6);
      }

      .block h2 {
        font-size: var(--rl-text-lg);
        margin-bottom: var(--rl-space-4);
      }

      .block--danger {
        border-color: var(--rl-danger-500);
      }

      .terms {
        display: grid;
        gap: var(--rl-space-4);
        margin: 0 0 var(--rl-space-4);
      }

      @media (min-width: 560px) {
        .terms {
          grid-template-columns: repeat(3, minmax(0, 1fr));
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
        font-size: var(--rl-text-sm);
      }
    `,
  ],
})
export class ProfilePage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly seo = inject(SeoService);
  readonly config = inject(PLATFORM_CONFIG);

  readonly routes = WEB_ROUTES;
  readonly user = this.auth.user;
  readonly formatDate = formatDate;

  readonly savingProfile = signal(false);
  readonly savingPassword = signal(false);
  readonly profileFeedback = signal<{ tone: 'success' | 'error'; message: string } | null>(null);
  readonly passwordFeedback = signal<{ tone: 'success' | 'error'; message: string } | null>(null);

  readonly profileForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    phone: [''],
  });

  readonly passwordForm = this.fb.nonNullable.group({
    currentPassword: ['', [Validators.required]],
    newPassword: [
      '',
      [Validators.required, Validators.pattern(/^(?=.*[A-Za-zÀ-ÿ])(?=.*\d).{10,128}$/)],
    ],
  });

  ngOnInit(): void {
    this.seo.apply({
      title: 'Perfil',
      description: 'Seus dados, senha e preferências.',
      path: WEB_ROUTES.profile,
      noIndex: true,
    });

    const current = this.user();
    if (current) {
      this.profileForm.patchValue({ name: current.name, phone: current.phone ?? '' });
    }
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.savingProfile.set(true);
    this.profileFeedback.set(null);

    this.auth.updateProfile(this.profileForm.getRawValue()).subscribe({
      next: () => {
        this.savingProfile.set(false);
        this.profileFeedback.set({ tone: 'success', message: 'Dados atualizados.' });
      },
      error: (err: { message: string }) => {
        this.savingProfile.set(false);
        this.profileFeedback.set({ tone: 'error', message: err.message });
      },
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.savingPassword.set(true);
    this.passwordFeedback.set(null);

    const { currentPassword, newPassword } = this.passwordForm.getRawValue();

    // Em caso de sucesso, o serviço encerra a sessão e leva ao início.
    this.auth.changePassword(currentPassword, newPassword).subscribe({
      next: () => this.savingPassword.set(false),
      error: (err: { message: string }) => {
        this.savingPassword.set(false);
        this.passwordFeedback.set({ tone: 'error', message: err.message });
      },
    });
  }
}
