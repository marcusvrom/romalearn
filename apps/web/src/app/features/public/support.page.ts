import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WEB_ROUTES } from '@romalearn/contracts';
import { PLATFORM_CONFIG } from '../../core/platform.config';
import { SeoService } from '../../core/seo.service';

@Component({
  selector: 'rl-support-page',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="rl-container rl-container--narrow rl-section">
      <p class="rl-eyebrow">Suporte</p>
      <h1>Precisa de ajuda?</h1>
      <p class="rl-lead">
        Escreva para a nossa equipe. Respondemos em dias úteis, normalmente em até 2 dias.
      </p>

      <div class="rl-card contact">
        <p class="rl-small rl-muted">E-mail de suporte</p>
        <p class="contact__email">
          <a [href]="'mailto:' + config.supportEmail">{{ config.supportEmail }}</a>
        </p>
        <p class="rl-small rl-muted">
          Para agilizar, conte o que você tentou fazer, em qual curso e o que apareceu na tela.
        </p>
      </div>

      <section class="block">
        <h2>Antes de escrever, veja se ajuda</h2>
        <ul class="links">
          <li>
            <strong>Não consigo entrar.</strong>
            Use a página de
            <a [routerLink]="routes.forgotPassword">recuperação de senha</a> — o link chega no
            e-mail cadastrado e vale por 1 hora.
          </li>
          <li>
            <strong>Não recebi o e-mail de confirmação.</strong>
            Confira a caixa de spam. Você também pode pedir um novo link na tela de
            <a [routerLink]="routes.login">entrada</a>.
          </li>
          <li>
            <strong>Concluí a aula mas ela não marcou.</strong>
            Cada tipo de aula tem uma exigência: tempo de leitura, envio da atividade ou aprovação
            no questionário. O próprio player informa o que falta.
          </li>
          <li>
            <strong>Comprei e o acesso não liberou.</strong>
            O acesso é liberado quando o provedor confirma o pagamento — no Pix isso costuma levar
            alguns minutos. Se passar disso, escreva para o suporte com o código do pedido.
          </li>
          <li>
            <strong>Quero excluir minha conta.</strong>
            Escreva do e-mail cadastrado pedindo a exclusão. O procedimento está descrito na
            <a [routerLink]="routes.privacy">Política de Privacidade</a>.
          </li>
        </ul>
      </section>

      <p class="rl-small rl-muted">
        Consulte também os <a [routerLink]="routes.terms">Termos de Uso</a> e as
        <a [routerLink]="['/']" fragment="perguntas">perguntas frequentes</a>.
      </p>
    </div>
  `,
  styles: [
    `
      .contact {
        margin: var(--rl-space-8) 0;
        background: var(--rl-brand-50);
        border-color: var(--rl-brand-300);
      }

      .contact__email {
        font-size: var(--rl-text-xl);
        font-weight: var(--rl-weight-semibold);
        margin: var(--rl-space-2) 0;
      }

      .block {
        margin-bottom: var(--rl-space-10);
      }

      .links {
        list-style: none;
        padding: 0;
        margin: 0;
      }

      .links li {
        padding: var(--rl-space-4) 0;
        border-bottom: 1px solid var(--rl-border);
        color: var(--rl-text-muted);
      }

      .links strong {
        display: block;
        color: var(--rl-text);
        margin-bottom: var(--rl-space-1);
      }
    `,
  ],
})
export class SupportPage implements OnInit {
  private readonly seo = inject(SeoService);
  readonly config = inject(PLATFORM_CONFIG);
  readonly routes = WEB_ROUTES;

  ngOnInit(): void {
    this.seo.apply({
      title: 'Suporte',
      description: 'Canais de ajuda e respostas para as dúvidas mais comuns dos alunos.',
      path: WEB_ROUTES.support,
    });
  }
}
