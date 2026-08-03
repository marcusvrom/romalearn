import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  computed,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { SUPPORT_TOPICS, SupportQuickAnswer, SupportTopic } from './support-assistant.knowledge';

@Component({
  selector: 'rl-support-assistant',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button
      #launcher
      type="button"
      class="support-launcher"
      [attr.aria-expanded]="open()"
      aria-controls="support-assistant-panel"
      aria-label="Abrir ajuda e suporte"
      (click)="toggle()"
    >
      <span aria-hidden="true">💬</span>
      <span class="support-launcher__label">Ajuda</span>
    </button>

    @if (open()) {
      <section
        #panel
        id="support-assistant-panel"
        class="support-panel"
        role="dialog"
        aria-modal="false"
        aria-labelledby="support-assistant-title"
      >
        <header class="support-panel__header">
          <div>
            <p>Central de ajuda</p>
            <h2 id="support-assistant-title">Como podemos ajudar?</h2>
          </div>
          <button type="button" aria-label="Fechar ajuda" (click)="close()">×</button>
        </header>

        <div class="support-panel__body" aria-live="polite">
          @if (!selectedTopic() && !selectedAnswer()) {
            <p class="intro">
              Escolha um assunto. Primeiro tentamos resolver rapidamente; você ainda pode falar com
              o time quando necessário.
            </p>
            <div class="topic-list">
              @for (topic of filteredTopics(); track topic.id) {
                <button type="button" class="topic" (click)="chooseTopic(topic)">
                  <span class="topic__icon" aria-hidden="true">{{ topic.icon }}</span>
                  <span
                    ><strong>{{ topic.label }}</strong
                    ><small>{{ topic.description }}</small></span
                  >
                  <span aria-hidden="true">›</span>
                </button>
              }
            </div>
          }

          @if (selectedTopic(); as topic) {
            <button type="button" class="back" (click)="backToTopics()">← Todos os assuntos</button>
            <h3>{{ topic.icon }} {{ topic.label }}</h3>
            <div class="answer-list">
              @for (answer of topic.answers; track answer.id) {
                <button type="button" (click)="chooseAnswer(answer)">{{ answer.label }}</button>
              }
            </div>
          }

          @if (selectedAnswer(); as answer) {
            <button type="button" class="back" (click)="backToAnswers()">← Voltar</button>
            <article class="answer-card">
              <h3>{{ answer.label }}</h3>
              <p>{{ answer.answer }}</p>
              @if (answer.actionRoute && answer.actionLabel) {
                <a [routerLink]="answer.actionRoute" (click)="close()">{{ answer.actionLabel }}</a>
              }
            </article>

            <section class="resolution" aria-label="A resposta resolveu sua dúvida?">
              <p>Isso resolveu sua dúvida?</p>
              <div>
                <button type="button" (click)="markResolved()">Sim, resolveu</button>
                <button type="button" class="secondary" (click)="requestHuman(answer)">
                  Ainda preciso de ajuda
                </button>
              </div>
            </section>
          }

          @if (resolved()) {
            <article class="success" role="status">
              <strong>Que bom que conseguimos ajudar.</strong>
              <p>Sua resposta ajuda a melhorar a central e reduzir o tempo de espera.</p>
              <button type="button" (click)="restart()">Fazer outra pergunta</button>
            </article>
          }

          @if (humanRequest()) {
            <article class="human-request">
              <h3>Solicitar atendimento humano</h3>
              <p>
                Descreva o problema com detalhes. Evite informar senha, número completo do cartão ou
                outros dados sensíveis.
              </p>
              <label>
                Mensagem
                <textarea
                  rows="5"
                  maxlength="1500"
                  [value]="message()"
                  (input)="updateMessage($event)"
                  placeholder="Conte o que aconteceu, em qual curso e o que você já tentou."
                ></textarea>
              </label>
              <small>{{ message().length }}/1500</small>
              <div class="human-request__actions">
                <button
                  type="button"
                  [disabled]="message().trim().length < 20"
                  (click)="submitHumanRequest()"
                >
                  Enviar solicitação
                </button>
                <button type="button" class="secondary" (click)="cancelHumanRequest()">
                  Cancelar
                </button>
              </div>
            </article>
          }

          @if (submitted()) {
            <article class="success" role="status">
              <strong>Solicitação preparada.</strong>
              <p>
                Nesta primeira versão, o envio ao backoffice depende do endpoint de atendimento. A
                mensagem foi mantida nesta sessão para não ser perdida.
              </p>
              <button type="button" (click)="restart()">Voltar ao início</button>
            </article>
          }
        </div>
      </section>
    }
  `,
  styles: [
    `
      :host {
        position: fixed;
        right: 1rem;
        bottom: 1rem;
        z-index: 1000;
      }
      .support-launcher {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        min-height: 52px;
        padding: 0.75rem 1rem;
        border: 0;
        border-radius: 999px;
        background: var(--rl-brand-600);
        color: white;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.22);
        cursor: pointer;
        font: inherit;
        font-weight: var(--rl-weight-semibold);
      }
      .support-launcher:focus-visible,
      button:focus-visible,
      a:focus-visible,
      textarea:focus-visible {
        outline: 3px solid var(--rl-focus-ring);
        outline-offset: 3px;
      }
      .support-panel {
        position: absolute;
        right: 0;
        bottom: 4.25rem;
        width: min(390px, calc(100vw - 2rem));
        max-height: min(680px, calc(100vh - 7rem));
        overflow: auto;
        border: 1px solid var(--rl-border);
        border-radius: var(--rl-radius-xl);
        background: var(--rl-surface-raised);
        color: var(--rl-text);
        box-shadow: 0 18px 50px rgba(0, 0, 0, 0.28);
      }
      .support-panel__header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 1rem;
        padding: 1rem 1rem 0.85rem;
        border-bottom: 1px solid var(--rl-border);
        background: var(--rl-brand-700);
        color: white;
        border-radius: var(--rl-radius-xl) var(--rl-radius-xl) 0 0;
      }
      .support-panel__header p {
        margin: 0;
        opacity: 0.85;
        font-size: var(--rl-text-xs);
      }
      .support-panel__header h2 {
        margin: 0.2rem 0 0;
        font-size: var(--rl-text-lg);
      }
      .support-panel__header button {
        border: 0;
        background: transparent;
        color: white;
        font-size: 1.7rem;
        cursor: pointer;
      }
      .support-panel__body {
        padding: 1rem;
      }
      .intro {
        margin-top: 0;
        color: var(--rl-text-muted);
      }
      .topic-list,
      .answer-list {
        display: grid;
        gap: 0.65rem;
      }
      .topic,
      .answer-list button {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 0.75rem;
        text-align: left;
        padding: 0.8rem;
        border: 1px solid var(--rl-border);
        border-radius: var(--rl-radius-md);
        background: var(--rl-surface);
        color: var(--rl-text);
        cursor: pointer;
      }
      .topic span:nth-child(2) {
        display: grid;
        gap: 0.2rem;
        flex: 1;
      }
      .topic small {
        color: var(--rl-text-muted);
      }
      .topic__icon {
        font-size: 1.2rem;
      }
      .back {
        margin-bottom: 0.75rem;
        border: 0;
        background: transparent;
        color: var(--rl-brand-link);
        cursor: pointer;
        padding: 0;
      }
      h3 {
        margin: 0.2rem 0 0.85rem;
      }
      .answer-card {
        padding: 1rem;
        border-radius: var(--rl-radius-md);
        background: var(--rl-surface-muted);
      }
      .answer-card h3 {
        margin-top: 0;
      }
      .answer-card p {
        line-height: 1.6;
      }
      .answer-card a {
        display: inline-flex;
        margin-top: 0.5rem;
        color: var(--rl-brand-link);
        font-weight: var(--rl-weight-semibold);
      }
      .resolution {
        margin-top: 1rem;
        padding-top: 1rem;
        border-top: 1px solid var(--rl-border);
      }
      .resolution p {
        font-weight: var(--rl-weight-semibold);
      }
      .resolution div,
      .human-request__actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.6rem;
      }
      .resolution button,
      .human-request button,
      .success button {
        min-height: 42px;
        padding: 0.65rem 0.85rem;
        border: 0;
        border-radius: var(--rl-radius-md);
        background: var(--rl-brand-600);
        color: white;
        cursor: pointer;
      }
      button.secondary {
        border: 1px solid var(--rl-border);
        background: var(--rl-surface);
        color: var(--rl-text);
      }
      .success {
        padding: 1rem;
        border-radius: var(--rl-radius-md);
        background: var(--rl-success-50);
      }
      .success p {
        color: var(--rl-text-muted);
      }
      .human-request label {
        display: grid;
        gap: 0.4rem;
      }
      textarea {
        resize: vertical;
        width: 100%;
        box-sizing: border-box;
        border: 1px solid var(--rl-border);
        border-radius: var(--rl-radius-md);
        background: var(--rl-surface);
        color: var(--rl-text);
        padding: 0.75rem;
        font: inherit;
      }
      .human-request small {
        display: block;
        margin: 0.35rem 0 0.8rem;
        color: var(--rl-text-subtle);
        text-align: right;
      }
      button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      @media (max-width: 520px) {
        :host {
          right: 0.75rem;
          bottom: 0.75rem;
        }
        .support-launcher__label {
          display: none;
        }
        .support-launcher {
          width: 54px;
          justify-content: center;
          padding: 0;
        }
        .support-panel {
          position: fixed;
          inset: auto 0.5rem 0.5rem 0.5rem;
          width: auto;
          max-height: calc(100vh - 1rem);
        }
      }
      @media (prefers-reduced-motion: no-preference) {
        .support-panel {
          animation: appear 0.16s ease-out;
        }
        @keyframes appear {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
        }
      }
    `,
  ],
})
export class SupportAssistantComponent {
  @ViewChild('launcher') private launcher?: ElementRef<HTMLButtonElement>;
  @ViewChild('panel') private panel?: ElementRef<HTMLElement>;

  readonly open = signal(false);
  readonly selectedTopic = signal<SupportTopic | null>(null);
  readonly selectedAnswer = signal<SupportQuickAnswer | null>(null);
  readonly resolved = signal(false);
  readonly humanRequest = signal(false);
  readonly submitted = signal(false);
  readonly message = signal('');
  readonly filteredTopics = computed(() => SUPPORT_TOPICS);

  toggle(): void {
    if (this.open()) this.close();
    else this.openPanel();
  }

  openPanel(): void {
    this.open.set(true);
    queueMicrotask(() => this.panel?.nativeElement.focus());
  }

  close(): void {
    this.open.set(false);
    queueMicrotask(() => this.launcher?.nativeElement.focus());
  }

  chooseTopic(topic: SupportTopic): void {
    this.selectedTopic.set(topic);
  }

  chooseAnswer(answer: SupportQuickAnswer): void {
    this.selectedAnswer.set(answer);
    this.selectedTopic.set(null);
  }

  backToTopics(): void {
    this.selectedTopic.set(null);
  }

  backToAnswers(): void {
    const topic =
      SUPPORT_TOPICS.find((item) =>
        item.answers.some((answer) => answer.id === this.selectedAnswer()?.id),
      ) ?? null;
    this.selectedAnswer.set(null);
    this.selectedTopic.set(topic);
  }

  markResolved(): void {
    this.selectedAnswer.set(null);
    this.resolved.set(true);
  }

  requestHuman(answer: SupportQuickAnswer): void {
    this.selectedAnswer.set(answer);
    this.humanRequest.set(true);
    this.resolved.set(false);
  }

  cancelHumanRequest(): void {
    this.humanRequest.set(false);
  }

  updateMessage(event: Event): void {
    this.message.set((event.target as HTMLTextAreaElement).value);
  }

  submitHumanRequest(): void {
    if (this.message().trim().length < 20) return;
    this.humanRequest.set(false);
    this.submitted.set(true);
  }

  restart(): void {
    this.selectedTopic.set(null);
    this.selectedAnswer.set(null);
    this.resolved.set(false);
    this.humanRequest.set(false);
    this.submitted.set(false);
    this.message.set('');
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open()) this.close();
  }
}
