import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { WEB_ROUTES } from '@romalearn/contracts';
import { AlertComponent } from '@romalearn/ui';
import { AuthService } from '../../core/auth.service';
import { SeoService } from '../../core/seo.service';
import { AuthShellComponent } from './auth-shell.component';

@Component({
  selector: 'rl-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AuthShellComponent, AlertComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <rl-auth-shell
      heading="Entrar na sua conta"
      subheading="Bem-vindo de volta. Continue de onde parou."
    >
      @if (error(); as message) {
        <rl-alert tone="error">{{ message }}</rl-alert>
      }

      <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <div class="rl-field">
          <label class="rl-label" for="email">E-mail</label>
          <input
            id="email"
            type="email"
            class="rl-input"
            formControlName="email"
            autocomplete="email"
            inputmode="email"
            [attr.aria-invalid]="invalid('email')"
            [attr.aria-describedby]="invalid('email') ? 'erro-email' : null"
          />
          @if (invalid('email')) {
            <span class="rl-error" id="erro-email">Informe um e-mail válido.</span>
          }
        </div>

        <div class="rl-field">
          <label class="rl-label" for="senha">Senha</label>
          <input
            id="senha"
            type="password"
            class="rl-input"
            formControlName="password"
            autocomplete="current-password"
            [attr.aria-invalid]="invalid('password')"
            [attr.aria-describedby]="invalid('password') ? 'erro-senha' : null"
          />
          @if (invalid('password')) {
            <span class="rl-error" id="erro-senha">Informe sua senha.</span>
          }
          <a class="forgot rl-small" [routerLink]="routes.forgotPassword">Esqueci minha senha</a>
        </div>

        <button
          type="submit"
          class="rl-button rl-button--primary rl-button--block"
          [disabled]="loading()"
        >
          {{ loading() ? 'Entrando…' : 'Entrar' }}
        </button>
      </form>

      <p class="switch rl-small">
        Ainda não tem conta?
        <a [routerLink]="routes.register">Criar conta gratuita</a>
      </p>
    </rl-auth-shell>
  `,
  styles: [
    `
      .forgot {
        display: inline-block;
        margin-top: var(--rl-space-2);
      }

      .switch {
        margin-top: var(--rl-space-6);
        text-align: center;
      }
    `,
  ],
})
export class LoginPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);

  readonly routes = WEB_ROUTES;
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.seo.apply({
      title: 'Entrar',
      description: 'Acesse sua conta para continuar estudando.',
      path: WEB_ROUTES.login,
      noIndex: true,
    });
  }

  invalid(control: 'email' | 'password'): boolean {
    const field = this.form.controls[control];
    return field.invalid && (field.dirty || field.touched);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    const { email, password } = this.form.getRawValue();

    this.auth.login(email, password).subscribe({
      next: () => {
        this.loading.set(false);
        // Volta ao destino pretendido antes do login, se houver.
        const redirect = this.route.snapshot.queryParamMap.get('redirecionar');
        void this.router.navigateByUrl(redirect ?? WEB_ROUTES.dashboard);
      },
      error: (err: { message: string }) => {
        this.loading.set(false);
        this.error.set(err.message);
      },
    });
  }
}
