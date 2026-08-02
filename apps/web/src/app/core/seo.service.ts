import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { PLATFORM_CONFIG } from './platform.config';

export interface SeoData {
  title: string;
  description: string;
  /** Caminho canônico relativo, ex.: `/cursos/word`. */
  path: string;
  image?: string;
  type?: 'website' | 'article';
  /** Área do aluno e painel administrativo nunca são indexados. */
  noIndex?: boolean;
  /** Dados estruturados schema.org (ex.: Course). */
  structuredData?: Record<string, unknown>;
}

/** Centraliza title, description, Open Graph, canonical e dados estruturados. */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly config = inject(PLATFORM_CONFIG);

  apply(data: SeoData): void {
    const fullTitle = `${data.title} | ${this.config.name}`;
    const url = `${this.config.siteUrl.replace(/\/$/, '')}${data.path}`;

    this.title.setTitle(fullTitle);
    this.meta.updateTag({ name: 'description', content: data.description });
    this.meta.updateTag({
      name: 'robots',
      content: data.noIndex ? 'noindex, nofollow' : 'index, follow',
    });

    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: data.description });
    this.meta.updateTag({ property: 'og:type', content: data.type ?? 'website' });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:site_name', content: this.config.name });
    this.meta.updateTag({ property: 'og:locale', content: 'pt_BR' });
    if (data.image) this.meta.updateTag({ property: 'og:image', content: data.image });

    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: data.description });

    this.setCanonical(url);
    this.setStructuredData(data.structuredData);
  }

  private setCanonical(url: string): void {
    let link = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }

  private setStructuredData(data?: Record<string, unknown>): void {
    const existing = this.document.getElementById('rl-structured-data');
    if (existing) existing.remove();
    if (!data) return;

    const script = this.document.createElement('script');
    script.id = 'rl-structured-data';
    script.type = 'application/ld+json';
    // Conteúdo gerado pela própria aplicação, sem entrada do usuário.
    script.textContent = JSON.stringify(data);
    this.document.head.appendChild(script);
  }
}
