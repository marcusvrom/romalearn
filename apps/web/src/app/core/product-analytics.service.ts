import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';

export type ProductEventName =
  | 'primary_cta_clicked'
  | 'course_viewed'
  | 'free_enrollment_started'
  | 'checkout_started'
  | 'dashboard_viewed'
  | 'continue_learning_clicked'
  | 'lesson_started'
  | 'lesson_completed'
  | 'lesson_audio_started'
  | 'lesson_audio_rate_changed'
  | 'lesson_audio_completed'
  | 'activity_submitted'
  | 'quiz_submitted'
  | 'course_completed'
  | 'ebook_opened'
  | 'ebook_downloaded';

export interface ProductEvent {
  name: ProductEventName;
  properties?: Record<string, string | number | boolean | null>;
}

/**
 * Camada única para eventos de produto.
 *
 * Não envia dados pessoais e funciona com SSR. Um provedor real pode escutar o
 * evento `romalearn:product-event` sem acoplar páginas e componentes a uma
 * ferramenta específica de analytics.
 */
@Injectable({ providedIn: 'root' })
export class ProductAnalyticsService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  track(event: ProductEvent): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.document.defaultView?.dispatchEvent(
      new CustomEvent<ProductEvent>('romalearn:product-event', {
        detail: {
          name: event.name,
          properties: this.clean(event.properties),
        },
      }),
    );
  }

  private clean(properties: ProductEvent['properties']): ProductEvent['properties'] {
    if (!properties) return undefined;

    return Object.fromEntries(
      Object.entries(properties).filter(([, value]) => value !== undefined),
    ) as ProductEvent['properties'];
  }
}
