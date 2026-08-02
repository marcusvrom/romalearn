import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { WEB_ROUTES } from '@romalearn/contracts';
import { AlertComponent } from '@romalearn/ui';
import { AuthService } from '../../core/auth.service';
import { SeoService } from '../../core/seo.service';
import { AuthShellComponent } from './auth-shell.component';

/**
 * Cadastro.
 *
 * A validação aqui é só para dar retorno rápido; a regra de senha e o aceite
 * dos termos são reavaliados no backend.
 */
@Component({
  selector: 'rl-register-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, AuthShellComponent, AlertComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <rl-auth-shell
      heading="Criar sua conta gratuita"
      subheading="Leva menos de um minuto. Você já entra com acesso ao módulo gratuito."
    >
      @if (error(); as message) {
        <rl-alert tone="error">{{ message }}</rl-alert>
      }

      <form [formGroup]="form" (ngSubmit)="submit()" novalidate>
        <div class="rl-field">
          <label class="rl-label" for="nome">Nome completo</label>
          <input
            id="nome"
            class="rl-input"
            formControlName="name"
            autocomplete="name"
            [attr.aria-invalid]="invalid('name')"
            [attr.aria-describedby]="invalid('name') ? 'erro-nome' : null"
          />
          @if (invalid('name')) {
            <span class="rl-error" id="erro-nome">Informe seu nome completo.</span>
          }
        </div>

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
          <span class="rl-hint">Enviaremos um link de confirmação para este endereço.</span>
        </div>

        <div class="rl-field">
          <label class="rl-label" for="telefone">Telefone (opcional)</label>
          <input
            id="telefone"
            class="rl-input"
            formControlName="phone"
            autocomplete="tel"
            inputmode="tel"
            placeholder="(11) 90000-0000"
          />
        </div>

        <div class="rl-field">
          <label class="rl-label" for="senha">Senha</label>
          <input
            id="senha"
            type="password"
            class="rl-input"
            formControlName="password"
            autocomplete="new-password"
            [attr.aria-invalid]="invalid('password')"
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
          <label class="rl-checkbox">
            <input type="checkbox" formControlName="acceptedTerms" />
            <span>
              Li e aceito os
              <a [routerLink]="routes.terms" target="_blank" rel="noopener">Termos de Uso</a>
              e a
              <a [routerLink]="routes.privacy" target="_blank" rel="noopener">
                Política de Privacidade </a
              >.
            </span>
          </label>
          @if (invalid('acceptedTerms')) {
            <span class="rl-error"> É necessário aceitar os termos para criar a conta. </span>
          }
        </div>

        <button
          type="submit"
          class="rl-button rl-button--primary rl-button--block"
          [disabled]="loading()"
        >
          {{ loading() ? 'Criando conta…' : 'Criar minha conta' }}
        </button>
      </form>

      <p class="switch rl-small">
        Já tem conta?
        <a [routerLink]="routes.login">Entrar</a>
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
export class RegisterPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly seo = inject(SeoService);

  readonly routes = WEB_ROUTES;
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    // Mesma regra do backend: 10+ caracteres, com letra e número.
    password: [
      '',
      [Validators.required, Validators.pattern(/^(?=.*[A-Za-zÀ-ÿ])(?=.*\d).{10,128}$/)],
    ],
    acceptedTerms: [false, [Validators.requiredTrue]],
  });

  ngOnInit(): void {
    this.seo.apply({
      title: 'Criar conta',
      description: 'Crie sua conta gratuita e comece pelo módulo de carreira digital.',
      path: WEB_ROUTES.register,
      noIndex: true,
    });
  }

  invalid(control: 'name' | 'email' | 'password' | 'acceptedTerms'): boolean {
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

    const value = this.form.getRawValue();

    this.auth
      .register({
        name: value.name,
        email: value.email,
        password: value.password,
        phone: value.phone || undefined,
        acceptedTerms: value.acceptedTerms,
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
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
