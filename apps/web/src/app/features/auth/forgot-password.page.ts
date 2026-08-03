import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { WEB_ROUTES } from '@romalearn/contracts';
import { AlertComponent } from '@romalearn/ui';
import { AuthService } from '../../core/auth.service';
import { SeoService } from '../../core/seo.service';
import { AuthShellComponent } from './auth-shell.component';

@Component({
  selector: 'rl-forgot-password-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AuthShellComponent, AlertComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <rl-auth-shell
      heading="Recuperar senha"
      subheading="Informe seu e-mail e enviaremos um link para criar uma nova senha."
    >
      @if (sent()) {
        <rl-alert tone="success" title="Confira sua caixa de entrada">
          {{ message() }}
        </rl-alert>
        <p class="rl-small rl-muted">
          O link vale por 1 hora. Se não aparecer, verifique também a pasta de spam.
        </p>
      } @else {
        @if (error(); as errorMessage) {
          <rl-alert tone="error">{{ errorMessage }}</rl-alert>
        }

        <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <div class="rl-field">
            <label class="rl-label" for="email">E-mail cadastrado</label>
            <input
              id="email"
              type="email"
              class="rl-input"
              formControlName="email"
              autocomplete="email"
              inputmode="email"
              [attr.aria-invalid]="invalid()"
            />
            @if (invalid()) {
              <span class="rl-error">Informe um e-mail válido.</span>
            }
          </div>

          <button
            type="submit"
            class="rl-button rl-button--primary rl-button--block"
            [disabled]="loading()"
          >
            {{ loading() ? 'Enviando…' : 'Enviar link de recuperação' }}
          </button>
        </form>
      }

      <p class="switch rl-small">
        <a [routerLink]="routes.login">Voltar para o login</a>
      </p>
    </rl-auth-shell>
  `,
  styles: [
    `
      .switch {
        margin-top: var(--rl-space-6);
        text-align: center;
      }
    `,
  ],
})
export class ForgotPasswordPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly seo = inject(SeoService);

  readonly routes = WEB_ROUTES;
  readonly loading = signal(false);
  readonly sent = signal(false);
  readonly message = signal('');
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
  });

  ngOnInit(): void {
    this.seo.apply({
      title: 'Recuperar senha',
      description: 'Receba um link para criar uma nova senha.',
      path: WEB_ROUTES.forgotPassword,
      noIndex: true,
    });
  }

  invalid(): boolean {
    const field = this.form.controls.email;
    return field.invalid && (field.dirty || field.touched);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.auth.forgotPassword(this.form.getRawValue().email).subscribe({
      next: (response) => {
        this.loading.set(false);
        // A resposta é a mesma exista ou não a conta — sem vazar cadastros.
        this.message.set(response.message);
        this.sent.set(true);
      },
      error: (err: { message: string }) => {
        this.loading.set(false);
        this.error.set(err.message);
      },
    });
  }
}
