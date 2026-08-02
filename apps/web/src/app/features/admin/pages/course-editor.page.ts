import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LessonType, PublicationStatus } from '@romalearn/contracts';
import { AlertComponent, LoadingStateComponent } from '@romalearn/ui';
import { LESSON_TYPE_LABEL } from '../../../core/format';
import { SeoService } from '../../../core/seo.service';
import { AdminCourse, AdminLesson, AdminSection, AdminService } from '../admin.service';

/**
 * Editor de curso: partes, aulas e ordenação.
 *
 * Permite montar um curso inteiro sem alterações no código.
 */
@Component({
  selector: 'rl-admin-course-editor-page',
  standalone: true,
  imports: [FormsModule, RouterLink, LoadingStateComponent, AlertComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './course-editor.page.html',
  styleUrl: './course-editor.page.scss',
})
export class AdminCourseEditorPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly admin = inject(AdminService);
  private readonly seo = inject(SeoService);

  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly course = signal<AdminCourse | null>(null);
  readonly sections = signal<AdminSection[]>([]);
  readonly lessons = signal<AdminLesson[]>([]);
  readonly feedback = signal<{ tone: 'success' | 'error'; message: string } | null>(null);

  readonly lessonTypes = Object.values(LessonType);
  readonly typeLabel = LESSON_TYPE_LABEL;
  readonly status = PublicationStatus;

  /** Aulas agrupadas por parte, na ordem de exibição. */
  readonly grouped = computed(() =>
    this.sections()
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((section) => ({
        section,
        lessons: this.lessons()
          .filter((lesson) => lesson.sectionId === section.id)
          .sort((a, b) => a.order - b.order),
      })),
  );

  courseForm = { title: '', shortDescription: '', fullDescription: '', workloadHours: 0 };
  newSection = { title: '', summary: '' };
  newLesson: Record<string, { title: string; type: LessonType; estimatedMinutes: number }> = {};

  private courseId = '';

  ngOnInit(): void {
    this.seo.apply({
      title: 'Editar curso',
      description: 'Edição de conteúdo do curso.',
      path: '/admin/cursos',
      noIndex: true,
    });

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.courseId = id;
        this.load();
      }
    });
  }

  private load(): void {
    this.loading.set(true);

    this.admin.findCourse(this.courseId).subscribe({
      next: (course) => {
        this.course.set(course);
        this.courseForm = {
          title: course.title,
          shortDescription: course.shortDescription,
          fullDescription: course.fullDescription,
          workloadHours: course.workloadHours,
        };
        this.loading.set(false);
      },
      error: (err: { message: string }) => {
        this.feedback.set({ tone: 'error', message: err.message });
        this.loading.set(false);
      },
    });

    this.admin.listSections(this.courseId).subscribe({
      next: (sections) => {
        this.sections.set(sections);
        for (const section of sections) {
          this.newLesson[section.id] ??= {
            title: '',
            type: LessonType.RICH_TEXT,
            estimatedMinutes: 15,
          };
        }
      },
      error: () => undefined,
    });

    this.admin.listLessons(this.courseId).subscribe({
      next: (lessons) => this.lessons.set(lessons),
      error: () => undefined,
    });
  }

  saveCourse(): void {
    this.saving.set(true);
    this.feedback.set(null);

    this.admin.updateCourse(this.courseId, { ...this.courseForm }).subscribe({
      next: (course) => {
        this.saving.set(false);
        this.course.set(course);
        this.feedback.set({ tone: 'success', message: 'Curso atualizado.' });
      },
      error: (err: { message: string }) => {
        this.saving.set(false);
        this.feedback.set({ tone: 'error', message: err.message });
      },
    });
  }

  addSection(): void {
    if (!this.newSection.title.trim()) return;

    this.admin.createSection({ courseId: this.courseId, ...this.newSection }).subscribe({
      next: () => {
        this.newSection = { title: '', summary: '' };
        this.feedback.set({ tone: 'success', message: 'Parte adicionada.' });
        this.load();
      },
      error: (err: { message: string }) =>
        this.feedback.set({ tone: 'error', message: err.message }),
    });
  }

  removeSection(section: AdminSection): void {
    this.admin.deleteSection(section.id).subscribe({
      next: () => {
        this.feedback.set({ tone: 'success', message: `Parte "${section.title}" removida.` });
        this.load();
      },
      error: (err: { message: string }) =>
        this.feedback.set({ tone: 'error', message: err.message }),
    });
  }

  addLesson(sectionId: string): void {
    const draft = this.newLesson[sectionId];
    if (!draft?.title.trim()) return;

    this.admin.createLesson({ sectionId, ...draft }).subscribe({
      next: () => {
        this.newLesson[sectionId] = {
          title: '',
          type: LessonType.RICH_TEXT,
          estimatedMinutes: 15,
        };
        this.feedback.set({ tone: 'success', message: 'Aula adicionada.' });
        this.load();
      },
      error: (err: { message: string }) =>
        this.feedback.set({ tone: 'error', message: err.message }),
    });
  }

  removeLesson(lesson: AdminLesson): void {
    this.admin.deleteLesson(lesson.id).subscribe({
      next: () => {
        this.feedback.set({ tone: 'success', message: `Aula "${lesson.title}" removida.` });
        this.load();
      },
      error: (err: { message: string }) =>
        this.feedback.set({ tone: 'error', message: err.message }),
    });
  }

  /** Move uma aula dentro da parte e persiste a nova ordem. */
  moveLesson(sectionId: string, index: number, direction: -1 | 1): void {
    const group = this.grouped().find((item) => item.section.id === sectionId);
    if (!group) return;

    const target = index + direction;
    if (target < 0 || target >= group.lessons.length) return;

    const reordered = [...group.lessons];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];

    const items = reordered.map((lesson, position) => ({ id: lesson.id, order: position }));

    this.admin.reorder('lessons', items).subscribe({
      next: () => this.load(),
      error: (err: { message: string }) =>
        this.feedback.set({ tone: 'error', message: err.message }),
    });
  }

  moveSection(index: number, direction: -1 | 1): void {
    const ordered = this.grouped().map((item) => item.section);
    const target = index + direction;
    if (target < 0 || target >= ordered.length) return;

    const reordered = [...ordered];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];

    const items = reordered.map((section, position) => ({ id: section.id, order: position }));

    this.admin.reorder('sections', items).subscribe({
      next: () => this.load(),
      error: (err: { message: string }) =>
        this.feedback.set({ tone: 'error', message: err.message }),
    });
  }

  publish(): void {
    this.admin.publishCourse(this.courseId).subscribe({
      next: (course) => {
        this.course.set(course);
        this.feedback.set({ tone: 'success', message: 'Curso publicado.' });
      },
      error: (err: { message: string }) =>
        this.feedback.set({ tone: 'error', message: err.message }),
    });
  }

  unpublish(): void {
    this.admin.unpublishCourse(this.courseId).subscribe({
      next: (course) => {
        this.course.set(course);
        this.feedback.set({ tone: 'success', message: 'Curso voltou a rascunho.' });
      },
      error: (err: { message: string }) =>
        this.feedback.set({ tone: 'error', message: err.message }),
    });
  }
}
