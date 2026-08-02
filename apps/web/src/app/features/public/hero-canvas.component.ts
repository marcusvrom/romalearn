import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  afterNextRender,
  inject,
  viewChild,
} from '@angular/core';

/** Um ponto da malha, em coordenadas de 0 a 1 (independentes do tamanho). */
interface Ponto {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

/** Distância máxima (fração da largura) para dois pontos se ligarem. */
const DISTANCIA_LIGACAO = 0.16;

/** Densidade da malha: pontos por megapixel de área visível. */
const PONTOS_POR_MEGAPIXEL = 55;
const MAXIMO_DE_PONTOS = 90;

/**
 * Fundo animado do topo da landing.
 *
 * É uma malha de pontos que se ligam quando ficam perto — a mesma ideia de
 * "uma coisa puxa a outra" que a trilha de cursos propõe. Feito em canvas 2D
 * de propósito: uma biblioteca 3D custaria centenas de kilobytes na primeira
 * página que o aluno abre, e boa parte do nosso público chega por celulares
 * modestos e internet limitada. O desenho é decorativo, então fica fora da
 * árvore de acessibilidade.
 *
 * Nada disso roda no servidor nem para quem pede menos movimento: nesses
 * casos sobra o degradê estático do CSS, que já sustenta o visual sozinho.
 */
@Component({
  selector: 'rl-hero-canvas',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<canvas #tela aria-hidden="true"></canvas>`,
  styles: [
    `
      :host {
        position: absolute;
        inset: 0;
        overflow: hidden;
        pointer-events: none;
      }

      canvas {
        display: block;
        width: 100%;
        height: 100%;
        /* O desenho acompanha o fundo em vez de competir com o texto. */
        opacity: 0.55;
      }
    `,
  ],
})
export class HeroCanvasComponent implements OnDestroy {
  private readonly tela = viewChild.required<ElementRef<HTMLCanvasElement>>('tela');
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private pontos: Ponto[] = [];
  private quadro = 0;
  private observador?: ResizeObserver;
  private largura = 0;
  private altura = 0;
  private corDaLinha = 'rgba(59, 96, 246, 0.5)';

  constructor() {
    afterNextRender(() => this.iniciar());
  }

  ngOnDestroy(): void {
    this.parar();
  }

  private iniciar(): void {
    if (!this.isBrowser) return;

    const view = this.document.defaultView;
    if (!view) return;

    // Quem pediu menos movimento no sistema fica só com o degradê.
    if (view.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = this.tela().nativeElement;
    const contexto = canvas.getContext('2d');
    if (!contexto) return;

    this.lerCorDaMarca(view, canvas);
    this.redimensionar(view, canvas);

    if (typeof ResizeObserver !== 'undefined') {
      this.observador = new ResizeObserver(() => this.redimensionar(view, canvas));
      this.observador.observe(canvas);
    }

    const desenhar = (): void => {
      this.passo(contexto);
      this.quadro = view.requestAnimationFrame(desenhar);
    };
    this.quadro = view.requestAnimationFrame(desenhar);
  }

  private parar(): void {
    this.observador?.disconnect();
    if (this.quadro) this.document.defaultView?.cancelAnimationFrame(this.quadro);
    this.quadro = 0;
  }

  /**
   * A cor vem do token da marca, e não de um valor fixo aqui: assim a malha
   * troca junto com o tema e com uma eventual mudança de identidade visual.
   */
  private lerCorDaMarca(view: Window, canvas: HTMLCanvasElement): void {
    const cor = view.getComputedStyle(canvas).getPropertyValue('--rl-brand-400').trim();
    if (cor) this.corDaLinha = cor;
  }

  private redimensionar(view: Window, canvas: HTMLCanvasElement): void {
    const { clientWidth, clientHeight } = canvas;
    if (clientWidth === 0 || clientHeight === 0) return;

    // Acima de 2 a densidade de pixels custa muito e quase não aparece.
    const densidade = Math.min(view.devicePixelRatio || 1, 2);
    canvas.width = Math.round(clientWidth * densidade);
    canvas.height = Math.round(clientHeight * densidade);

    this.largura = canvas.width;
    this.altura = canvas.height;

    const megapixels = (clientWidth * clientHeight) / 1_000_000;
    const total = Math.min(Math.round(megapixels * PONTOS_POR_MEGAPIXEL) + 12, MAXIMO_DE_PONTOS);
    this.ajustarQuantidade(total);
  }

  /** Cresce ou encolhe a malha sem recriar os pontos que já existem. */
  private ajustarQuantidade(total: number): void {
    while (this.pontos.length > total) this.pontos.pop();
    while (this.pontos.length < total) {
      this.pontos.push({
        x: Math.random(),
        y: Math.random(),
        // Velocidades pequenas: o movimento deve ser percebido de canto de
        // olho, não disputar a atenção com o título.
        vx: (Math.random() - 0.5) * 0.0006,
        vy: (Math.random() - 0.5) * 0.0006,
      });
    }
  }

  private passo(contexto: CanvasRenderingContext2D): void {
    const { largura, altura } = this;
    contexto.clearRect(0, 0, largura, altura);

    for (const ponto of this.pontos) {
      ponto.x += ponto.vx;
      ponto.y += ponto.vy;

      // Nas bordas o ponto volta para dentro em vez de sumir.
      if (ponto.x < 0 || ponto.x > 1) ponto.vx *= -1;
      if (ponto.y < 0 || ponto.y > 1) ponto.vy *= -1;
    }

    contexto.lineWidth = Math.max(1, largura / 1400);

    for (let i = 0; i < this.pontos.length; i++) {
      const a = this.pontos[i];

      for (let j = i + 1; j < this.pontos.length; j++) {
        const b = this.pontos[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const distancia = Math.hypot(dx, dy);
        if (distancia > DISTANCIA_LIGACAO) continue;

        // Quanto mais perto, mais forte a linha.
        contexto.globalAlpha = (1 - distancia / DISTANCIA_LIGACAO) * 0.5;
        contexto.strokeStyle = this.corDaLinha;
        contexto.beginPath();
        contexto.moveTo(a.x * largura, a.y * altura);
        contexto.lineTo(b.x * largura, b.y * altura);
        contexto.stroke();
      }

      contexto.globalAlpha = 0.7;
      contexto.fillStyle = this.corDaLinha;
      contexto.beginPath();
      contexto.arc(a.x * largura, a.y * altura, Math.max(1.5, largura / 900), 0, Math.PI * 2);
      contexto.fill();
    }

    contexto.globalAlpha = 1;
  }
}
