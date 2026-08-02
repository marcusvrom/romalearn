import { DOCUMENT, DecimalPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ActivityReviewStatus,
  ActivitySubmissionDto,
  LessonContentDto,
  LessonType,
  ProgressStatus,
  QuizAttemptResultDto,
  WEB_ROUTES,
} from '@romalearn/contracts';
import { AlertComponent, LoadingStateComponent } from '@romalearn/ui';
import { LESSON_TYPE_LABEL, formatMinutes } from '../../../core/format';
import { LearningService } from '../../../core/learning.service';
import { LessonAudioPlayerComponent } from './lesson-audio-player.component';
import { PlayerStore } from './player.store';

const HEARTBEAT_SECONDS = 30;

@Component({
  selector: 'rl-lesson-page',
  standalone: true,
  imports: [
    DecimalPipe,
    FormsModule,
    LoadingStateComponent,
    AlertComponent,
    LessonAudioPlayerComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './lesson.page.html',
  styleUrl: './lesson.page.scss',
})
export class LessonPage implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly learning = inject(LearningService);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly document = inject(DOCUMENT);
  readonly store = inject(PlayerStore);

  readonly routes = WEB_ROUTES;
  readonly lessonTypes = LessonType;
  readonly typeLabel = LESSON_TYPE_LABEL;
  readonly formatMinutes = formatMinutes;
  readonly completedStatus = ProgressStatus.COMPLETED;

  readonly loading = signal(true);
  readonly lesson = signal<LessonContentDto | null>(null);
  readonly safeContent = signal<SafeHtml | null>(null);
  readonly error = signal<string | null>(null);
  readonly feedback = signal<{ tone: 'error' | 'success'; message: string } | null>(null);
  readonly completing = signal(false);

  activityNotes = '';
  readonly submission = signal<ActivitySubmissionDto | null>(null);
  readonly submitting = signal(false);
  readonly arquivo = signal<File | null>(null);

  readonly answers = signal<Record<string, string[]>>({});
  readonly quizResult = signal<QuizAttemptResultDto | null>(null);
  readonly submittingQuiz = signal(false);

  courseSlug = '';
  private heartbeat: ReturnType<typeof setInterval> | null = null;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const lessonSlug = params.get('lessonSlug');
      this.courseSlug = this.route.parent?.snapshot.paramMap.get('courseSlug') ?? '';
      if (lessonSlug && this.courseSlug) this.load(this.courseSlug, lessonSlug);
    });
  }

  ngOnDestroy(): void {
    this.stopHeartbeat();
  }

  private load(courseSlug: string, lessonSlug: string): void {
    this.loading.set(true);
    this.error.set(null);
    this.feedback.set(null);
    this.quizResult.set(null);
    this.answers.set({});
    this.submission.set(null);
    this.activityNotes = '';
    this.arquivo.set(null);
    this.stopHeartbeat();

    this.learning.lesson(courseSlug, lessonSlug).subscribe({
      next: (lesson) => {
        this.lesson.set(lesson);
        this.submission.set(lesson.activitySubmission);
        this.activityNotes = lesson.activitySubmission?.notes ?? '';
        this.safeContent.set(
          lesson.contentHtml ? this.sanitizer.bypassSecurityTrustHtml(lesson.contentHtml) : null,
        );
        this.loading.set(false);
        this.startHeartbeat();
        this.scrollToTop();
      },
      error: (err: { message: string }) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  private startHeartbeat(): void {
    this.heartbeat = setInterval(() => {
      const lesson = this.lesson();
      if (!lesson || lesson.progress.status === ProgressStatus.COMPLETED) return;

      this.learning.saveProgress(lesson.id, { elapsedSeconds: HEARTBEAT_SECONDS }).subscribe({
        next: (progress) => this.lesson.set({ ...lesson, progress }),
        error: () => undefined,
      });
    }, HEARTBEAT_SECONDS * 1000);
  }

  private stopHeartbeat(): void {
    if (this.heartbeat) clearInterval(this.heartbeat);
    this.heartbeat = null;
  }

  onVideoProgress(event: Event): void {
    const video = event.target as HTMLVideoElement;
    const lesson = this.lesson();
    if (!lesson || !video.duration) return;

    const ratio = Math.min(video.currentTime / video.duration, 1);

    this.learning
      .saveProgress(lesson.id, {
        elapsedSeconds: 0,
        positionSeconds: Math.floor(video.currentTime),
        watchRatio: ratio,
      })
      .subscribe({
        next: (progress) => this.lesson.set({ ...lesson, progress }),
        error: () => undefined,
      });
  }

  complete(): void {
    const lesson = this.lesson();
    if (!lesson) return;

    this.completing.set(true);
    this.feedback.set(null);

    this.learning.completeLesson(lesson.id, true).subscribe({
      next: (result) => {
        this.completing.set(false);
        this.lesson.set({ ...lesson, progress: result.progress });
        this.store.refresh(this.courseSlug);

        this.feedback.set({
          tone: 'success',
          message:
            result.course.pendingRequirements.length === 0
              ? 'Aula concluída. Você cumpriu todos os requisitos do curso!'
              : 'Aula concluída. Bom trabalho!',
        });

        const next = this.store.slugForLesson(lesson.nextLessonId);
        if (next) {
          setTimeout(
            () => void this.router.navigateByUrl(WEB_ROUTES.playerLesson(this.courseSlug, next)),
            900,
          );
        }
      },
      error: (err: { message: string }) => {
        this.completing.set(false);
        this.feedback.set({ tone: 'error', message: err.message });
      },
    });
  }

  escolherArquivo(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.arquivo.set(input.files?.[0] ?? null);
  }

  wordCount(): number {
    return this.activityNotes.trim().split(/\s+/).filter(Boolean).length;
  }

  submitActivity(): void {
    const lesson = this.lesson();
    if (!lesson) return;

    const notes = this.activityNotes.trim();
    if (notes.length < 10) {
      this.feedback.set({
        tone: 'error',
        message: 'Escreva um relato com pelo menos 10 caracteres sobre o que você fez.',
      });
      return;
    }

    this.submitting.set(true);
    this.learning.submitActivity(lesson.id, notes, this.arquivo()).subscribe({
      next: (entrega) => {
        this.submitting.set(false);
        this.submission.set(entrega);
        this.arquivo.set(null);
        this.feedback.set({
          tone: entrega.status === ActivityReviewStatus.NEEDS_REVISION ? 'error' : 'success',
          message: entrega.statusMessage,
        });
        this.scrollToTop();
      },
      error: (err: { message: string }) => {
        this.submitting.set(false);
        this.feedback.set({ tone: 'error', message: err.message });
      },
    });
  }

  toggleOption(questionId: string, optionId: string, multiple: boolean): void {
    this.answers.update((current) => {
      const selected = current[questionId] ?? [];
      if (!multiple) return { ...current, [questionId]: [optionId] };

      return {
        ...current,
        [questionId]: selected.includes(optionId)
          ? selected.filter((id) => id !== optionId)
          : [...selected, optionId],
      };
    });
  }

  isSelected(questionId: string, optionId: string): boolean {
    return (this.answers()[questionId] ?? []).includes(optionId);
  }

  submitQuiz(): void {
    const lesson = this.lesson();
    const quiz = lesson?.quiz;
    if (!lesson || !quiz) return;

    const answers = quiz.questions.map((question) => ({
      questionId: question.id,
      selectedOptionIds: this.answers()[question.id] ?? [],
    }));

    if (answers.some((answer) => answer.selectedOptionIds.length === 0)) {
      this.feedback.set({ tone: 'error', message: 'Responda todas as questões antes de enviar.' });
      return;
    }

    this.submittingQuiz.set(true);
    this.feedback.set(null);

    this.learning.submitQuiz(quiz.id, answers).subscribe({
      next: (result) => {
        this.submittingQuiz.set(false);
        this.quizResult.set(result);
        this.store.refresh(this.courseSlug);

        if (result.passed) {
          this.learning.lesson(this.courseSlug, lesson.slug).subscribe({
            next: (refreshed) => this.lesson.set(refreshed),
            error: () => undefined,
          });
        }
      },
      error: (err: { message: string }) => {
        this.submittingQuiz.set(false);
        this.feedback.set({ tone: 'error', message: err.message });
      },
    });
  }

  retryQuiz(): void {
    this.quizResult.set(null);
    this.answers.set({});
  }

  feedbackFor(questionId: string) {
    return this.quizResult()?.questions.find((item) => item.questionId === questionId) ?? null;
  }

  navigate(direction: 'previous' | 'next'): void {
    const { previous, next } = this.store.neighbourSlugs(this.lesson());
    const slug = direction === 'previous' ? previous : next;
    if (slug) void this.router.navigateByUrl(WEB_ROUTES.playerLesson(this.courseSlug, slug));
  }

  hasNeighbour(direction: 'previous' | 'next'): boolean {
    const { previous, next } = this.store.neighbourSlugs(this.lesson());
    return direction === 'previous' ? previous !== null : next !== null;
  }

  private scrollToTop(): void {
    const view = this.document.defaultView;
    if (view) view.scrollTo({ top: 0, behavior: 'auto' });
  }
}
