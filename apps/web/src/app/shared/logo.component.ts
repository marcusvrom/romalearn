import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * Marca da RomaLearn: arco romano com degraus subindo dentro dele.
 *
 * O arco é a porta de entrada (e o aceno ao nome). Os degraus são a trilha:
 * atravessar a porta e continuar subindo.
 *
 * Aqui o desenho é embutido, e não um `<img>` apontando para `logo.svg`,
 * porque assim ele herda a cor de quem o contém — branco sobre o ladrilho da
 * marca, cor do texto no rodapé — e não gera uma requisição a mais. O arquivo
 * em `public/logo.svg` continua existindo para uso fora do site (e-mails,
 * redes sociais, materiais impressos).
 */
@Component({
  selector: 'rl-logo',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      viewBox="0 0 32 32"
      [attr.width]="size()"
      [attr.height]="size()"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      <!-- Parede do arco: contorno externo menos o vão interno. -->
      <path fill-rule="evenodd" d="M4 27V17a12 12 0 0 1 24 0v10h-4V17a8 8 0 0 0-16 0v10z" />
      <!-- Degraus, apoiados na mesma linha de chão do arco. -->
      <rect x="9.5" y="22" width="3" height="5" rx="1.1" />
      <rect x="14.5" y="18.5" width="3" height="8.5" rx="1.1" />
      <rect x="19.5" y="15" width="3" height="12" rx="1.1" />
    </svg>
  `,
  styles: [
    `
      :host {
        display: inline-flex;
      }

      svg {
        display: block;
      }
    `,
  ],
})
export class LogoComponent {
  /** Lado do quadrado, em pixels. */
  readonly size = input(24);
}
