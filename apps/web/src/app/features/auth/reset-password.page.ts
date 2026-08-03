import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { WEB_ROUTES } from '@romalearn/contracts';
import { AlertComponent } from '@romalearn/ui';
import { AuthService } from '../../core/auth.service';
import { SeoService } from '../../core/seo.service';
import { AuthShellComponent } from './auth-shell.component';

@Component({
  selector: 'rl-reset-password-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AuthShellComponent, AlertComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <rl-auth-shell heading="Criar nova senha" subheading="Escolha uma senha que você vá lembrar.">
      @if (!token()) {
        <rl-alert tone="error" title="Link inválido">
          Este link não contém as informações necessárias. Solicite um novo.
        </rl-alert>
        <a
          class="rl-button rl-button--secondary rl-button--block"
          [routerLink]="routes.forgotPassword"
        >
          Pedir novo link
        </a>
      } @else if (done()) {
        <rl-alert tone="success" title="Senha alterada">
          Pronto! Agora entre com a sua nova senha.
        </rl-alert>
        <a class="rl-button rl-button--primary rl-button--block" [routerLink]="routes.login">
          Ir para o login
        </a>
      } @else {
        @if (error(); as message) {
          <rl-alert tone="error">{{ message }}</rl-alert>
        }

        <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
          <div class="rl-field">
            <label class="rl-label" for="senha">Nova senha</label>
            <input
              id="senha"
              type="password"
              class="rl-input"
              formControlName="password"
              autocomplete="new-password"
              aria-describedby="dica-senha"
            />
            <span class="rl-hint" id="dica-senha">
              Pelo menos 10 caracteres, com letras e números.
            </span>
            @if (invalid('password')) {
              <span class="rl-error">
                A senha deve ter pelo menos 10 caracteres, incluindo letras e números.
              </span>
            }
          </div>

          <div class="rl-field">
            <label class="rl-label" for="confirmacao">Repita a nova senha</label>
            <input
              id="confirmacao"
              type="password"
              class="rl-input"
              formControlName="confirmation"
              autocomplete="new-password"
            />
            @if (mismatch()) {
              <span class="rl-error">As duas senhas precisam ser iguais.</span>
            }
          </div>

          <button
            type="submit"
            class="rl-button rl-button--primary rl-button--block"
            [disabled]="loading()"
          >
            {{ loading() ? 'Salvando…' : 'Salvar nova senha' }}
          </button>
        </form>
      }
    </rl-auth-shell>
  `,
})
export class ResetPasswordPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);

  readonly routes = WEB_ROUTES;
  readonly loading = signal(false);
  readonly done = signal(false);
  readonly error = signal<string | null>(null);
  readonly token = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    password: [
      '',
      [Validators.required, Validators.pattern(/^(?=.*[A-Za-zÀ-ÿ])(?=.*\d).{10,128}$/)],
    ],
    confirmation: ['', [Validators.required]],
  });

  ngOnInit(): void {
    this.seo.apply({
      title: 'Redefinir senha',
      description: 'Crie uma nova senha para a sua conta.',
      path: WEB_ROUTES.resetPassword,
      noIndex: true,
    });

    this.route.queryParamMap.subscribe((params) => this.token.set(params.get('token')));
  }

  invalid(control: 'password' | 'confirmation'): boolean {
    const field = this.form.controls[control];
    return field.invalid && (field.dirty || field.touched);
  }

  mismatch(): boolean {
    const { password, confirmation } = this.form.getRawValue();
    return confirmation.length > 0 && password !== confirmation;
  }

  submit(): void {
    const token = this.token();
    if (!token || this.form.invalid || this.mismatch()) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    this.auth.resetPassword(token, this.form.getRawValue().password).subscribe({
      next: () => {
        this.loading.set(false);
        this.done.set(true);
      },
      error: (err: { message: string }) => {
        this.loading.set(false);
        this.error.set(err.message);
      },
    });
  }
}
