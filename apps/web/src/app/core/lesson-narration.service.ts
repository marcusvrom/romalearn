import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';

export type NarrationStatus = 'idle' | 'playing' | 'paused' | 'finished' | 'unsupported';
export type NarrationProfile = 'CALM' | 'NATURAL' | 'FOCUSED' | 'REVIEW' | 'CUSTOM';

export interface NarrationBlock {
  id: string;
  text: string;
  pauseAfterMs: number;
}

interface NarrationPreferences {
  rate: number;
  voiceUri: string | null;
  autoAdvance: boolean;
}

interface NarrationPosition {
  blockIndex: number;
}

export const NARRATION_PROFILES: ReadonlyArray<{
  id: Exclude<NarrationProfile, 'CUSTOM'>;
  label: string;
  description: string;
  rate: number;
}> = [
  {
    id: 'CALM',
    label: 'Calmo',
    description: 'Mais pausado para acompanhar conceitos novos',
    rate: 1,
  },
  { id: 'NATURAL', label: 'Natural', description: 'Ritmo intermediário', rate: 1.5 },
  {
    id: 'FOCUSED',
    label: 'Focado',
    description: 'Ritmo recomendado para uma fala mais fluida',
    rate: 1.75,
  },
  {
    id: 'REVIEW',
    label: 'Revisão',
    description: 'Mais rápido para conteúdos já conhecidos',
    rate: 2,
  },
];

const PREFERENCES_KEY = 'romalearn:narration:preferences';
const POSITION_PREFIX = 'romalearn:narration:position:';
const DEFAULT_PREFERENCES: NarrationPreferences = {
  rate: 1.75,
  voiceUri: null,
  autoAdvance: false,
};

const PRONUNCIATIONS: ReadonlyArray<readonly [RegExp, string]> = [
  [/\bAPIs?\b/gi, 'á pê i'],
  [/\bHTML\b/gi, 'agá tê eme éle'],
  [/\bCSS\b/gi, 'cê ésse ésse'],
  [/\bSQL\b/gi, 'ésse quê éle'],
  [/\bURL\b/gi, 'u erre éle'],
  [/\bUX\b/gi, 'u xis'],
  [/\bUI\b/gi, 'u i'],
  [/\bJSON\b/gi, 'djêison'],
  [/\bHTTP\b/gi, 'agá tê tê pê'],
  [/\bHTTPS\b/gi, 'agá tê tê pê ésse'],
  [/\bDOM\b/gi, 'dê ó eme'],
  [/\bJDK\b/gi, 'jota dê cá'],
  [/\bJVM\b/gi, 'jota vê eme'],
  [/\bIDE\b/gi, 'i dê é'],
  [/\bCSV\b/gi, 'cê ésse vê'],
  [/\bREADME\b/gi, 'ríd mi'],
  [/\bGit\b/gi, 'gít'],
  [/\bGitHub\b/gi, 'gít rãb'],
  [/\bJavaScript\b/gi, 'djáva script'],
  [/\bTypeScript\b/gi, 'táipe script'],
  [/\bPostgreSQL\b/gi, 'póstgres quê éle'],
];

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
  readonly profile = computed<NarrationProfile>(() => {
    const matched = NARRATION_PROFILES.find((profile) => profile.rate === this.rate());
    return matched?.id ?? 'CUSTOM';
  });
  readonly progressPercentage = computed(() => {
    const total = this.blocks().length;
    if (total === 0) return 0;
    return Math.round(((this.currentBlockIndex() + 1) / total) * 100);
  });

  private utterance: SpeechSynthesisUtterance | null = null;
  private nextBlockTimer: ReturnType<typeof setTimeout> | null = null;

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
    this.clearNextBlockTimer();
    globalThis.speechSynthesis.pause();
    this.status.set('paused');
    this.persistPosition();
  }

  stop(resetPosition = true): void {
    this.clearNextBlockTimer();
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

  setProfile(profile: Exclude<NarrationProfile, 'CUSTOM'>): void {
    const selected = NARRATION_PROFILES.find((item) => item.id === profile);
    if (selected) this.setRate(selected.rate);
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
    this.clearNextBlockTimer();
    if (this.supported()) globalThis.speechSynthesis.cancel();
    this.currentBlockIndex.set(index);
    this.persistPosition();
    if (wasActive) this.speakCurrentBlock();
  }

  private restartCurrentBlock(): void {
    if (!this.supported()) return;
    this.clearNextBlockTimer();
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
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.voice = this.selectedVoice();

    utterance.onend = () => {
      const nextIndex = this.currentBlockIndex() + 1;

      if (nextIndex < this.blocks().length) {
        this.currentBlockIndex.set(nextIndex);
        this.persistPosition();
        this.nextBlockTimer = setTimeout(() => this.speakCurrentBlock(), block.pauseAfterMs);
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
      .querySelectorAll('script, style, iframe, svg, noscript, [aria-hidden="true"]')
      .forEach((element) => element.remove());

    // Código em bloco continua visual: narrar símbolos linha a linha seria
    // incompreensível. A legenda anterior ao bloco informa o exemplo. Já
    // termos curtos em `code` fazem parte da frase e precisam ser preservados.
    parsed.querySelectorAll('code').forEach((element) => {
      if (element.closest('pre')) return;
      element.replaceWith(parsed.createTextNode(element.textContent ?? ''));
    });
    parsed.querySelectorAll('pre').forEach((element) => element.remove());
    this.replaceTablesWithNarration(parsed);

    const candidates = Array.from(
      parsed.body.querySelectorAll('h1, h2, h3, h4, p, li, blockquote, figcaption'),
    );

    const texts = candidates
      .map((element) => this.normalizeNarrationText(element.textContent ?? ''))
      .filter((text) => text.length >= 2)
      .flatMap((text) => this.splitNarrationText(text));

    const textsWithTitle = [this.normalizeNarrationText(title), ...texts];
    const blocks = textsWithTitle.filter((text, index) => text !== textsWithTitle[index - 1]);

    return blocks.map((text, index) => ({
      id: `narration-${index}`,
      text,
      pauseAfterMs: this.pauseFor(text, index === 0),
    }));
  }

  private replaceTablesWithNarration(parsed: Document): void {
    parsed.querySelectorAll('table').forEach((table) => {
      const rows = Array.from(table.querySelectorAll('tr'));
      if (rows.length === 0) {
        table.remove();
        return;
      }

      const wrapper = parsed.createElement('div');
      const caption = table.querySelector('caption')?.textContent?.trim();
      const headerCells = Array.from(rows[0].querySelectorAll('th'));
      const headers = headerCells.map((cell) => cell.textContent?.trim() ?? '');
      const introduction = parsed.createElement('p');
      introduction.textContent = caption ? `Tabela: ${caption}.` : 'Tabela de comparação.';
      wrapper.append(introduction);

      const dataRows = headers.length > 0 ? rows.slice(1) : rows;
      dataRows.forEach((row, rowIndex) => {
        const values = Array.from(row.querySelectorAll('th, td')).map(
          (cell) => cell.textContent?.trim() ?? '',
        );
        if (values.every((value) => !value)) return;

        const paragraph = parsed.createElement('p');
        const cells = values.map((value, cellIndex) => {
          const header = headers[cellIndex];
          return header ? `${header}: ${value}` : value;
        });
        paragraph.textContent = `Linha ${rowIndex + 1}. ${cells.join('. ')}.`;
        wrapper.append(paragraph);
      });

      table.replaceWith(wrapper);
    });
  }

  /** Mantém cada fala curta o bastante para pausar e retomar sem repetir um parágrafo inteiro. */
  private splitNarrationText(text: string, maxLength = 420): string[] {
    if (text.length <= maxLength) return [text];

    const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) ?? [text];
    const blocks: string[] = [];
    let current = '';

    for (const sentence of sentences.map((item) => item.trim()).filter(Boolean)) {
      if (sentence.length > maxLength) {
        if (current) blocks.push(current);
        current = '';
        blocks.push(...this.splitLongSentence(sentence, maxLength));
        continue;
      }

      const candidate = current ? `${current} ${sentence}` : sentence;
      if (candidate.length <= maxLength) {
        current = candidate;
      } else {
        blocks.push(current);
        current = sentence;
      }
    }

    if (current) blocks.push(current);
    return blocks;
  }

  private splitLongSentence(text: string, maxLength: number): string[] {
    const words = text.split(/\s+/);
    const parts: string[] = [];
    let current = '';

    for (const word of words) {
      const candidate = current ? `${current} ${word}` : word;
      if (candidate.length <= maxLength) {
        current = candidate;
      } else {
        if (current) parts.push(current);
        current = word;
      }
    }

    if (current) parts.push(current);
    return parts.map((part) => (/[.!?]$/.test(part) ? part : `${part}.`));
  }

  private normalizeNarrationText(text: string): string {
    let normalized = text.replace(/\s+/g, ' ').trim();

    for (const [pattern, spoken] of PRONUNCIATIONS) {
      normalized = normalized.replace(pattern, spoken);
    }

    normalized = normalized
      .replace(/\s*[:;]\s*/g, '. ')
      .replace(/\s*[•·]\s*/g, '. ')
      .replace(/([.!?])(?=[A-ZÁÀÂÃÉÊÍÓÔÕÚÇ])/g, '$1 ')
      .replace(/\.{2,}/g, '.')
      .replace(/\s+/g, ' ')
      .trim();

    return /[.!?]$/.test(normalized) ? normalized : `${normalized}.`;
  }

  private pauseFor(text: string, isTitle: boolean): number {
    if (isTitle) return 650;
    if (/atenção|importante|cuidado|lembre-se/i.test(text)) return 600;
    if (text.length < 60) return 400;
    return 260;
  }

  private loadVoices(): void {
    if (!this.supported()) return;

    const available = globalThis.speechSynthesis
      .getVoices()
      .filter((voice) => voice.lang.toLowerCase().startsWith('pt'))
      .sort(
        (a, b) => this.scoreVoice(b) - this.scoreVoice(a) || a.name.localeCompare(b.name, 'pt-BR'),
      );

    this.voices.set(available);

    if (this.voiceUri() && !available.some((voice) => voice.voiceURI === this.voiceUri())) {
      this.voiceUri.set(null);
      this.persistPreferences();
    }
  }

  private scoreVoice(voice: SpeechSynthesisVoice): number {
    const name = voice.name.toLowerCase();
    let score = 0;

    if (voice.lang.toLowerCase() === 'pt-br') score += 100;
    if (/natural|neural|premium|enhanced|melhorada/.test(name)) score += 50;
    if (/microsoft|google|siri|apple/.test(name)) score += 20;
    if (voice.localService) score += 10;
    if (/portugal|europeu/.test(name)) score -= 20;

    return score;
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
      this.rate.set(
        typeof saved.rate === 'number'
          ? Math.max(0.75, Math.min(2, saved.rate))
          : DEFAULT_PREFERENCES.rate,
      );
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

  private clearNextBlockTimer(): void {
    if (this.nextBlockTimer) clearTimeout(this.nextBlockTimer);
    this.nextBlockTimer = null;
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
