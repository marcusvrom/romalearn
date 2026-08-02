import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';

export type NarrationStatus = 'idle' | 'playing' | 'paused' | 'finished' | 'unsupported';

export interface NarrationBlock {
  id: string;
  text: string;
}

interface NarrationPreferences {
  rate: number;
  voiceUri: string | null;
  autoAdvance: boolean;
}

interface NarrationPosition {
  blockIndex: number;
}

const PREFERENCES_KEY = 'romalearn:narration:preferences';
const POSITION_PREFIX = 'romalearn:narration:position:';
const DEFAULT_PREFERENCES: NarrationPreferences = {
  rate: 1,
  voiceUri: null,
  autoAdvance: false,
};

@Injectable({ providedIn: 'root' })
export class LessonNarrationService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly browser = isPlatformBrowser(this.platformId);

  readonly supported = signal(this.browser && 'speechSynthesis' in globalThis);
  readonly status = signal<NarrationStatus>(this.supported() ? 'idle' : 'unsupported');
  readonly blocks = signal<NarrationBlock[]>([]);
  readonly currentBlockIndex = signal(0);
  readonly voices = signal<SpeechSynthesisVoice[]>([]);
  readonly rate = signal(DEFAULT_PREFERENCES.rate);
  readonly voiceUri = signal<string | null>(DEFAULT_PREFERENCES.voiceUri);
  readonly autoAdvance = signal(DEFAULT_PREFERENCES.autoAdvance);
  readonly lessonKey = signal<string | null>(null);

  readonly currentBlock = computed(() => this.blocks()[this.currentBlockIndex()] ?? null);
  readonly progressPercentage = computed(() => {
    const total = this.blocks().length;
    if (total === 0) return 0;
    return Math.round(((this.currentBlockIndex() + 1) / total) * 100);
  });

  private utterance: SpeechSynthesisUtterance | null = null;

  constructor() {
    if (!this.supported()) return;

    this.restorePreferences();
    this.loadVoices();
    globalThis.speechSynthesis.addEventListener('voiceschanged', () => this.loadVoices());
  }

  loadHtml(lessonKey: string, title: string, html: string): void {
    this.stop(false);
    this.lessonKey.set(lessonKey);
    this.blocks.set(this.extractNarrationBlocks(title, html));
    this.currentBlockIndex.set(this.restorePosition(lessonKey));
  }

  toggle(): void {
    if (!this.supported() || this.blocks().length === 0) return;

    if (this.status() === 'playing') {
      this.pause();
      return;
    }

    if (this.status() === 'paused') {
      globalThis.speechSynthesis.resume();
      this.status.set('playing');
      return;
    }

    this.speakCurrentBlock();
  }

  pause(): void {
    if (!this.supported()) return;
    globalThis.speechSynthesis.pause();
    this.status.set('paused');
    this.persistPosition();
  }

  stop(resetPosition = true): void {
    if (this.supported()) globalThis.speechSynthesis.cancel();
    if (this.utterance) {
      this.utterance.onend = null;
      this.utterance.onerror = null;
    }
    this.utterance = null;
    this.status.set(this.supported() ? 'idle' : 'unsupported');

    if (resetPosition) {
      this.currentBlockIndex.set(0);
      this.persistPosition();
    }
  }

  previous(): void {
    this.moveTo(Math.max(0, this.currentBlockIndex() - 1));
  }

  next(): void {
    this.moveTo(Math.min(this.blocks().length - 1, this.currentBlockIndex() + 1));
  }

  seek(blockIndex: number): void {
    if (!Number.isInteger(blockIndex)) return;
    const target = Math.max(0, Math.min(this.blocks().length - 1, blockIndex));
    this.moveTo(target);
  }

  setRate(rate: number): void {
    const normalized = Math.max(0.75, Math.min(2, rate));
    this.rate.set(normalized);
    this.persistPreferences();
    if (this.status() === 'playing') this.restartCurrentBlock();
  }

  setVoice(voiceUri: string | null): void {
    this.voiceUri.set(voiceUri || null);
    this.persistPreferences();
    if (this.status() === 'playing') this.restartCurrentBlock();
  }

  setAutoAdvance(enabled: boolean): void {
    this.autoAdvance.set(enabled);
    this.persistPreferences();
  }

  private moveTo(index: number): void {
    const wasActive = this.status() === 'playing' || this.status() === 'paused';
    if (this.supported()) globalThis.speechSynthesis.cancel();
    this.currentBlockIndex.set(index);
    this.persistPosition();
    if (wasActive) this.speakCurrentBlock();
  }

  private restartCurrentBlock(): void {
    if (!this.supported()) return;
    globalThis.speechSynthesis.cancel();
    this.speakCurrentBlock();
  }

  private speakCurrentBlock(): void {
    if (!this.supported()) return;

    const block = this.currentBlock();
    if (!block) {
      this.status.set('finished');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(block.text);
    utterance.lang = 'pt-BR';
    utterance.rate = this.rate();
    utterance.voice = this.selectedVoice();

    utterance.onend = () => {
      const nextIndex = this.currentBlockIndex() + 1;

      if (nextIndex < this.blocks().length) {
        this.currentBlockIndex.set(nextIndex);
        this.persistPosition();
        this.speakCurrentBlock();
        return;
      }

      this.persistPosition();
      this.status.set('finished');
    };

    utterance.onerror = (event) => {
      if (event.error === 'canceled' || event.error === 'interrupted') return;
      this.status.set('idle');
    };

    this.utterance = utterance;
    this.status.set('playing');
    globalThis.speechSynthesis.speak(utterance);
  }

  private extractNarrationBlocks(title: string, html: string): NarrationBlock[] {
    if (!this.browser) return [];

    const parser = new DOMParser();
    const parsed = parser.parseFromString(html, 'text/html');

    parsed
      .querySelectorAll('script, style, iframe, svg, noscript, [aria-hidden="true"], pre, code')
      .forEach((element) => element.remove());

    const candidates = Array.from(
      parsed.body.querySelectorAll('h1, h2, h3, h4, p, li, blockquote, figcaption'),
    );

    const texts = candidates
      .map((element) => this.normalizeText(element.textContent ?? ''))
      .filter((text) => text.length >= 2);

    const uniqueTexts = texts.filter((text, index) => text !== texts[index - 1]);
    const blocks = [this.normalizeText(title), ...uniqueTexts];

    return blocks.map((text, index) => ({ id: `narration-${index}`, text }));
  }

  private normalizeText(text: string): string {
    return text.replace(/\s+/g, ' ').trim();
  }

  private loadVoices(): void {
    if (!this.supported()) return;

    const available = globalThis.speechSynthesis
      .getVoices()
      .filter((voice) => voice.lang.toLowerCase().startsWith('pt'))
      .sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));

    this.voices.set(available);

    if (this.voiceUri() && !available.some((voice) => voice.voiceURI === this.voiceUri())) {
      this.voiceUri.set(null);
      this.persistPreferences();
    }
  }

  private selectedVoice(): SpeechSynthesisVoice | null {
    const preferred = this.voiceUri();
    return this.voices().find((voice) => voice.voiceURI === preferred) ?? this.voices()[0] ?? null;
  }

  private restorePreferences(): void {
    const raw = this.safeStorageGet(PREFERENCES_KEY);
    if (!raw) return;

    try {
      const saved = JSON.parse(raw) as Partial<NarrationPreferences>;
      this.rate.set(typeof saved.rate === 'number' ? saved.rate : DEFAULT_PREFERENCES.rate);
      this.voiceUri.set(typeof saved.voiceUri === 'string' ? saved.voiceUri : null);
      this.autoAdvance.set(Boolean(saved.autoAdvance));
    } catch {
      this.safeStorageRemove(PREFERENCES_KEY);
    }
  }

  private persistPreferences(): void {
    const preferences: NarrationPreferences = {
      rate: this.rate(),
      voiceUri: this.voiceUri(),
      autoAdvance: this.autoAdvance(),
    };

    this.safeStorageSet(PREFERENCES_KEY, JSON.stringify(preferences));
  }

  private restorePosition(lessonKey: string): number {
    const raw = this.safeStorageGet(`${POSITION_PREFIX}${lessonKey}`);
    if (!raw) return 0;

    try {
      const position = JSON.parse(raw) as NarrationPosition;
      const max = Math.max(0, this.blocks().length - 1);
      return Math.max(0, Math.min(max, position.blockIndex ?? 0));
    } catch {
      return 0;
    }
  }

  private persistPosition(): void {
    const key = this.lessonKey();
    if (!key) return;

    const position: NarrationPosition = { blockIndex: this.currentBlockIndex() };
    this.safeStorageSet(`${POSITION_PREFIX}${key}`, JSON.stringify(position));
  }

  private safeStorageGet(key: string): string | null {
    try {
      return this.document.defaultView?.localStorage.getItem(key) ?? null;
    } catch {
      return null;
    }
  }

  private safeStorageSet(key: string, value: string): void {
    try {
      this.document.defaultView?.localStorage.setItem(key, value);
    } catch {
      // A narração continua funcionando mesmo com armazenamento bloqueado.
    }
  }

  private safeStorageRemove(key: string): void {
    try {
      this.document.defaultView?.localStorage.removeItem(key);
    } catch {
      // Sem ação necessária.
    }
  }
}
