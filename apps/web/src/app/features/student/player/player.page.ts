import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { ProgressStatus, WEB_ROUTES } from '@romalearn/contracts';
import { AlertComponent, LoadingStateComponent, ProgressBarComponent } from '@romalearn/ui';
import { LESSON_TYPE_ICON, LESSON_TYPE_LABEL } from '../../../core/format';
import { SeoService } from '../../../core/seo.service';
import { ThemeToggleComponent } from '../../../shared/theme-toggle.component';
import { PlayerStore } from './player.store';

/**
 * Casca do player: barra lateral com as partes e aulas + conteúdo.
 *
 * No celular a lateral vira um painel que abre e fecha; no desktop fica fixa.
 */
@Component({
  selector: 'rl-player-page',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    LoadingStateComponent,
    AlertComponent,
    ProgressBarComponent,
    ThemeToggleComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PlayerStore],
  templateUrl: './player.page.html',
  styleUrl: './player.page.scss',
})
export class PlayerPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly seo = inject(SeoService);
  readonly store = inject(PlayerStore);

  readonly routes = WEB_ROUTES;
  readonly typeIcon = LESSON_TYPE_ICON;
  readonly typeLabel = LESSON_TYPE_LABEL;
  readonly completed = ProgressStatus.COMPLETED;

  courseSlug = '';

  ngOnInit(): void {
    this.seo.apply({
      title: 'Curso',
      description: 'Player de aulas.',
      path: '/painel',
      noIndex: true,
    });

    this.route.paramMap.subscribe((params) => {
      const slug = params.get('courseSlug');
      if (!slug) return;

      this.courseSlug = slug;
      this.store.load(slug);
      this.redirectToResumeLesson(slug);
    });
  }

  /** Sem aula na URL, abre a sugerida pelo "Continuar estudando". */
  private redirectToResumeLesson(courseSlug: string): void {
    const hasLesson = this.route.snapshot.firstChild?.paramMap.get('lessonSlug');
    if (hasLesson) return;

    const subscription = this.store.player;
    const check = setInterval(() => {
      const player = subscription();
      if (!player) return;

      clearInterval(check);
      const slug = this.store.slugForLesson(player.resumeLessonId);
      if (slug) void this.router.navigateByUrl(WEB_ROUTES.playerLesson(courseSlug, slug));
    }, 60);

    // Segurança: nunca deixa o intervalo rodando indefinidamente.
    setTimeout(() => clearInterval(check), 10_000);
  }

  lessonLink(lessonSlug: string): string {
    return WEB_ROUTES.playerLesson(this.courseSlug, lessonSlug);
  }
}
