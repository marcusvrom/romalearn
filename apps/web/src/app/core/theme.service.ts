import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';

/**
 * Preferência de tema do aluno.
 *
 * `sistema` não é "claro por omissão": é seguir o que o aparelho já decidiu,
 * inclusive quando o aluno troca no meio da sessão.
 */
export type ThemePreference = 'claro' | 'escuro' | 'sistema';

/** Tema efetivamente pintado na tela. */
export type ResolvedTheme = 'claro' | 'escuro';

/** Chave no `localStorage`. Repetida no script do `index.html`. */
export const THEME_STORAGE_KEY = 'romalearn:tema';

const PREFERENCES: readonly ThemePreference[] = ['claro', 'escuro', 'sistema'];

/** Cor da barra do navegador em cada tema (`meta[name=theme-color]`). */
const BROWSER_BAR_COLOR: Record<ResolvedTheme, string> = {
  claro: '#2543ea',
  escuro: '#141a23',
};

export function isThemePreference(value: unknown): value is ThemePreference {
  return typeof value === 'string' && (PREFERENCES as readonly string[]).includes(value);
}

/**
 * Guarda e aplica a preferência de tema.
 *
 * O atributo `data-theme` no `<html>` é o único ponto de contato com o CSS —
 * os tokens fazem o resto. No servidor não há tema a aplicar: o HTML sai
 * neutro e o script do `index.html` pinta antes da primeira renderização, o
 * que evita o clarão branco em quem escolheu o escuro.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  private readonly systemPrefersDark = signal(false);

  readonly preference = signal<ThemePreference>('sistema');

  /** O que está pintado agora, já resolvendo `sistema`. */
  readonly resolved = computed<ResolvedTheme>(() => {
    const preference = this.preference();
    if (preference !== 'sistema') return preference;
    return this.systemPrefersDark() ? 'escuro' : 'claro';
  });

  constructor() {
    if (!this.isBrowser) return;

    this.preference.set(this.readStoredPreference());

    const query = this.document.defaultView?.matchMedia?.('(prefers-color-scheme: dark)');
    if (query) {
      this.systemPrefersDark.set(query.matches);
      // Em `sistema`, trocar o tema do aparelho precisa refletir na hora —
      // inclusive na cor da barra do navegador.
      query.addEventListener('change', (event) => {
        this.systemPrefersDark.set(event.matches);
        this.apply();
      });
    }

    this.apply();
  }

  set(preference: ThemePreference): void {
    this.preference.set(preference);
    if (!this.isBrowser) return;

    try {
      this.document.defaultView?.localStorage?.setItem(THEME_STORAGE_KEY, preference);
    } catch {
      // Navegação privativa ou armazenamento bloqueado: o tema vale para
      // esta sessão e volta ao padrão na próxima. Não é motivo de erro.
    }

    this.apply();
  }

  private readStoredPreference(): ThemePreference {
    try {
      const stored = this.document.defaultView?.localStorage?.getItem(THEME_STORAGE_KEY);
      return isThemePreference(stored) ? stored : 'sistema';
    } catch {
      return 'sistema';
    }
  }

  private apply(): void {
    const root = this.document.documentElement;
    const preference = this.preference();

    // Em `sistema` o atributo sai de cena e a media query dos tokens assume.
    if (preference === 'sistema') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', preference === 'escuro' ? 'dark' : 'light');

    const meta = this.document.querySelector('meta[name="theme-color"]');
    meta?.setAttribute('content', BROWSER_BAR_COLOR[this.resolved()]);
  }
}
