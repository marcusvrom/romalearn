import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { WEB_ROUTES } from '@romalearn/contracts';
import { AlertComponent, LoadingStateComponent } from '@romalearn/ui';
import { AuthService } from '../../core/auth.service';
import { SeoService } from '../../core/seo.service';
import { AuthShellComponent } from './auth-shell.component';

@Component({
  selector: 'rl-verify-email-page',
  standalone: true,
  imports: [RouterLink, AuthShellComponent, AlertComponent, LoadingStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <rl-auth-shell heading="Confirmação de e-mail">
      @switch (state()) {
        @case ('loading') {
          <rl-loading label="Confirmando seu e-mail…" />
        }
        @case ('success') {
          <rl-alert tone="success" title="E-mail confirmado">
            Tudo certo! Sua conta está ativa e você já pode estudar.
          </rl-alert>
          <a class="rl-button rl-button--primary rl-button--block" [routerLink]="routes.dashboard">
            Ir para a minha área
          </a>
        }
        @case ('error') {
          <rl-alert tone="error" title="Não foi possível confirmar">
            {{ error() }}
          </rl-alert>
          <p class="rl-small rl-muted">
            Links de confirmação valem por 1 hora e só podem ser usados uma vez. Entre na sua conta
            para pedir um novo link.
          </p>
          <a class="rl-button rl-button--secondary rl-button--block" [routerLink]="routes.login">
            Ir para o login
          </a>
        }
      }
    </rl-auth-shell>
  `,
})
export class VerifyEmailPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly auth = inject(AuthService);
  private readonly seo = inject(SeoService);

  readonly routes = WEB_ROUTES;
  readonly state = signal<'loading' | 'success' | 'error'>('loading');
  readonly error = signal('');

  ngOnInit(): void {
    this.seo.apply({
      title: 'Confirmar e-mail',
      description: 'Confirmação do endereço de e-mail da sua conta.',
      path: WEB_ROUTES.verifyEmail,
      noIndex: true,
    });

    this.route.queryParamMap.subscribe((params) => {
      const token = params.get('token');

      if (!token) {
        this.error.set('Este link não contém o código de confirmação.');
        this.state.set('error');
        return;
      }

      this.auth.verifyEmail(token).subscribe({
        next: () => this.state.set('success'),
        error: (err: { message: string }) => {
          this.error.set(err.message);
          this.state.set('error');
        },
      });
    });
  }
}
