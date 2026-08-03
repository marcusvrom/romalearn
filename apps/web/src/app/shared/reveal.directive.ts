import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  Directive,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  afterNextRender,
  inject,
  input,
} from '@angular/core';

/** Fração do elemento que precisa aparecer para a revelação disparar. */
const FRACAO_VISIVEL = 0.15;

/**
 * Revela o elemento quando ele entra na tela.
 *
 * O conteúdo é sempre renderizado — a revelação é só a classe `rl-revelado`,
 * que o CSS usa para tirar o deslocamento inicial. Quem chega sem JavaScript,
 * por um leitor de tela ou pelo HTML do servidor recebe a página inteira e
 * legível; a animação é um acréscimo, nunca uma condição para ler.
 *
 * A revelação acontece uma vez só: reanimar a cada rolagem cansa quem
 * percorre a página de cima a baixo procurando alguma coisa.
 */
@Directive({
  selector: '[rlReveal]',
  standalone: true,
})
export class RevealDirective implements OnDestroy {
  private readonly elemento = inject<ElementRef<HTMLElement>>(ElementRef);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  /** Atraso em milissegundos, para escalonar itens de uma mesma lista. */
  readonly rlReveal = input<number | ''>('');

  private observador?: IntersectionObserver;

  constructor() {
    afterNextRender(() => this.observar());
  }

  ngOnDestroy(): void {
    this.observador?.disconnect();
  }

  /**
   * A classe que esconde o elemento só entra aqui, quando já existe um
   * observador para revelá-lo. Marcá-la no HTML do servidor deixaria a página
   * invisível caso o JavaScript não chegasse.
   */
  private observar(): void {
    if (!this.isBrowser || typeof IntersectionObserver === 'undefined') return;

    const view = this.document.defaultView;
    if (view?.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const alvo = this.elemento.nativeElement as HTMLElement;
    const atraso = this.rlReveal();
    if (typeof atraso === 'number' && atraso > 0) {
      alvo.style.setProperty('--rl-reveal-delay', `${atraso}ms`);
    }

    alvo.classList.add('rl-revelavel');

    this.observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (!entrada.isIntersecting) continue;
          entrada.target.classList.add('rl-revelado');
          this.observador?.unobserve(entrada.target);
        }
      },
      { threshold: FRACAO_VISIVEL },
    );

    this.observador.observe(alvo);
  }
}
