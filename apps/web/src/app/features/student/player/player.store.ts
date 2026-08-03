import { Injectable, computed, inject, signal } from '@angular/core';
import { CoursePlayerDto, LessonContentDto } from '@romalearn/contracts';
import { LearningService } from '../../../core/learning.service';

/**
 * Estado compartilhado entre a casca do player e a aula aberta.
 *
 * A barra lateral precisa reagir à conclusão de uma aula sem recarregar a
 * página inteira, então o estado vive aqui.
 */
@Injectable()
export class PlayerStore {
  private readonly learning = inject(LearningService);

  readonly player = signal<CoursePlayerDto | null>(null);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly sidebarOpen = signal(false);

  /** Lista achatada das aulas, na ordem do curso. */
  readonly orderedLessons = computed(() =>
    (this.player()?.sections ?? []).flatMap((section) => section.lessons),
  );

  load(courseSlug: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.learning.player(courseSlug).subscribe({
      next: (player) => {
        this.player.set(player);
        this.loading.set(false);
      },
      error: (err: { message: string }) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  /** Recarrega progresso e estrutura após concluir uma aula. */
  refresh(courseSlug: string): void {
    this.learning.player(courseSlug).subscribe({
      next: (player) => this.player.set(player),
      error: () => undefined,
    });
  }

  slugForLesson(lessonId: string | null): string | null {
    if (!lessonId) return null;
    return this.orderedLessons().find((lesson) => lesson.id === lessonId)?.slug ?? null;
  }

  /** Slug da aula anterior/seguinte, a partir do conteúdo carregado. */
  neighbourSlugs(lesson: LessonContentDto | null): {
    previous: string | null;
    next: string | null;
  } {
    if (!lesson) return { previous: null, next: null };

    return {
      previous: this.slugForLesson(lesson.previousLessonId),
      next: this.slugForLesson(lesson.nextLessonId),
    };
  }

  toggleSidebar(): void {
    this.sidebarOpen.update((open) => !open);
  }

  closeSidebar(): void {
    this.sidebarOpen.set(false);
  }
}
