import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CourseDetailDto, ProductDto, WEB_ROUTES } from '@romalearn/contracts';
import { AlertComponent, LoadingStateComponent } from '@romalearn/ui';
import { AuthService } from '../../core/auth.service';
import { CatalogService } from '../../core/catalog.service';
import {
  LESSON_TYPE_ICON,
  LESSON_TYPE_LABEL,
  formatCurrency,
  formatMinutes,
} from '../../core/format';
import { LearningService } from '../../core/learning.service';
import { SeoService } from '../../core/seo.service';

/** Página comercial de um curso, com o conteúdo completo à vista. */
@Component({
  selector: 'rl-course-page',
  standalone: true,
  imports: [RouterLink, LoadingStateComponent, AlertComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './course.page.html',
  styleUrl: './course.page.scss',
})
export class CoursePage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly catalog = inject(CatalogService);
  private readonly learning = inject(LearningService);
  private readonly seo = inject(SeoService);
  readonly auth = inject(AuthService);

  readonly routes = WEB_ROUTES;
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly course = signal<CourseDetailDto | null>(null);
  readonly offer = signal<ProductDto['offers'][number] | null>(null);
  readonly enrolling = signal(false);
  readonly feedback = signal<string | null>(null);

  readonly typeLabel = LESSON_TYPE_LABEL;
  readonly typeIcon = LESSON_TYPE_ICON;
  readonly formatMinutes = formatMinutes;
  readonly formatCurrency = formatCurrency;

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug');
      if (slug) this.load(slug);
    });
  }

  private load(slug: string): void {
    this.loading.set(true);
    this.error.set(null);

    this.catalog.findCourse(slug).subscribe({
      next: (course) => {
        this.course.set(course);
        this.loading.set(false);
        this.applySeo(course);
        if (!course.isFree) this.loadOffer(course);
      },
      error: (err: { message: string }) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }

  /** Um curso pago é vendido pela oferta da trilha enquanto não houver preço avulso. */
  private loadOffer(course: CourseDetailDto): void {
    this.catalog.listProducts().subscribe({
      next: (products) => {
        const direct = products.find((product) => product.courseId === course.id);
        const program = products.find((product) => product.type === 'PROGRAM');
        const chosen = direct?.offers[0] ?? program?.offers[0] ?? null;
        this.offer.set(chosen);
      },
      error: () => this.offer.set(null),
    });
  }

  private applySeo(course: CourseDetailDto): void {
    this.seo.apply({
      title: course.title,
      description: course.shortDescription,
      path: WEB_ROUTES.course(course.slug),
      type: 'article',
      structuredData: {
        '@context': 'https://schema.org',
        '@type': 'Course',
        name: course.title,
        description: course.shortDescription,
        inLanguage: 'pt-BR',
        educationalLevel: course.level,
        timeRequired: `PT${course.workloadHours}H`,
        provider: {
          '@type': 'Organization',
          name: course.instructor?.name ?? 'RomaLearn',
        },
        hasCourseInstance: {
          '@type': 'CourseInstance',
          courseMode: 'online',
          courseWorkload: `PT${course.workloadHours}H`,
        },
        ...(course.isFree
          ? { offers: { '@type': 'Offer', price: '0', priceCurrency: 'BRL' } }
          : {}),
      },
    });
  }

  /** Matrícula gratuita: exige login, mas não passa por pagamento. */
  enrollFree(): void {
    const course = this.course();
    if (!course) return;

    if (!this.auth.isAuthenticated()) {
      void this.router.navigate([WEB_ROUTES.register], {
        queryParams: { redirecionar: WEB_ROUTES.course(course.slug) },
      });
      return;
    }

    this.enrolling.set(true);
    this.feedback.set(null);

    this.learning.enrollFree(course.slug).subscribe({
      next: () => {
        this.enrolling.set(false);
        void this.router.navigateByUrl(WEB_ROUTES.player(course.slug));
      },
      error: (err: { message: string }) => {
        this.enrolling.set(false);
        this.feedback.set(err.message);
      },
    });
  }

  goToCheckout(): void {
    const offer = this.offer();
    const course = this.course();
    if (!offer || !course) return;

    if (!this.auth.isAuthenticated()) {
      void this.router.navigate([WEB_ROUTES.login], {
        queryParams: { redirecionar: WEB_ROUTES.checkout(offer.id) },
      });
      return;
    }

    void this.router.navigateByUrl(WEB_ROUTES.checkout(offer.id));
  }

  totalLessons(course: CourseDetailDto): number {
    return course.sections.reduce((sum, section) => sum + section.lessons.length, 0);
  }
}
