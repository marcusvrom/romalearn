import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AlertComponent, LoadingStateComponent } from '@romalearn/ui';
import { SeoService } from '../../../core/seo.service';
import { AdminCourse, AdminService } from '../admin.service';

@Component({
  selector: 'rl-admin-content-analytics-page',
  standalone: true,
  imports: [RouterLink, LoadingStateComponent, AlertComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <div>
        <p class="eyebrow">Analytics</p>
        <h1>Desempenho de cursos e conteúdos</h1>
        <p>Base para identificar conteúdos mais vistos, mais comprados, com maior conclusão e maior abandono.</p>
      </div>
      <a class="rl-button rl-button--secondary" routerLink="/admin/cursos">Gerenciar cursos</a>
    </header>

    @if (loading()) { <rl-loading label="Carregando catálogo…" /> }
    @if (!loading() && error(); as message) {
      <rl-alert tone="error" title="Não foi possível carregar">{{ message }}</rl-alert>
    }
    @if (!loading() && !error()) {
      <section class="summary">
        <article class="rl-card"><span>Cursos cadastrados</span><strong>{{ courses().length }}</strong></article>
        <article class="rl-card"><span>Publicados</span><strong>{{ publishedCount() }}</strong></article>
        <article class="rl-card"><span>Em preparação</span><strong>{{ courses().length - publishedCount() }}</strong></article>
      </section>

      <section class="rl-card coverage">
        <div>
          <h2>Camada analítica planejada</h2>
          <p>As posições abaixo serão calculadas com eventos reais, sem inferir visualizações ou compras inexistentes.</p>
        </div>
        <div class="coverage__grid">
          @for (item of plannedMetrics; track item.title) {
            <article>
              <span aria-hidden="true">{{ item.icon }}</span>
              <strong>{{ item.title }}</strong>
              <p>{{ item.description }}</p>
            </article>
          }
        </div>
      </section>

      <section class="rl-card courses">
        <h2>Catálogo monitorado</h2>
        @if (courses().length === 0) {
          <p class="rl-muted">Nenhum curso cadastrado.</p>
        } @else {
          <div class="course-list">
            @for (course of courses(); track course.id) {
              <a [routerLink]="['/admin/cursos', course.id]">
                <span>
                  <strong>{{ course.title }}</strong>
                  <small>{{ course.status }}</small>
                </span>
                <span>Editar e revisar →</span>
              </a>
            }
          </div>
        }
      </section>

      <section class="rl-card endpoint">
        <h2>Contrato necessário para a próxima etapa</h2>
        <code>GET /admin/analytics/courses?period=30d</code>
        <p>O retorno deverá conter visualizações, compras, conversão, matrículas, conclusão, abandono, uso de áudio e receita por curso e aula.</p>
      </section>
    }
  `,
  styles: [`
    .page-head { display: flex; flex-wrap: wrap; justify-content: space-between; gap: var(--rl-space-5); margin-bottom: var(--rl-space-7); }
    .eyebrow { margin: 0 0 var(--rl-space-1); color: var(--rl-brand-link); font-weight: var(--rl-weight-semibold); }
    h1 { margin: 0; font-size: var(--rl-text-2xl); }
    .page-head p:last-child { max-width: 72ch; color: var(--rl-text-muted); }
    .summary { display: grid; gap: var(--rl-space-4); margin-bottom: var(--rl-space-5); }
    .summary article { display: grid; gap: var(--rl-space-2); }
    .summary span { color: var(--rl-text-subtle); font-size: var(--rl-text-sm); }
    .summary strong { font-size: var(--rl-text-2xl); }
    .coverage, .courses, .endpoint { margin-bottom: var(--rl-space-5); }
    h2 { margin-top: 0; font-size: var(--rl-text-lg); }
    .coverage__grid { display: grid; gap: var(--rl-space-3); margin-top: var(--rl-space-4); }
    .coverage__grid article { display: grid; grid-template-columns: auto 1fr; gap: var(--rl-space-2) var(--rl-space-3); padding: var(--rl-space-4); border-radius: var(--rl-radius-md); background: var(--rl-surface-muted); }
    .coverage__grid p { grid-column: 2; margin: 0; color: var(--rl-text-muted); }
    .course-list { display: grid; gap: var(--rl-space-2); }
    .course-list a { display: flex; align-items: center; justify-content: space-between; gap: var(--rl-space-4); padding: var(--rl-space-3); border: 1px solid var(--rl-border); border-radius: var(--rl-radius-md); color: var(--rl-text); text-decoration: none; }
    .course-list span:first-child { display: grid; gap: .2rem; }
    .course-list small { color: var(--rl-text-muted); }
    .endpoint code { display: block; margin: var(--rl-space-3) 0; padding: var(--rl-space-3); border-radius: var(--rl-radius-md); background: var(--rl-neutral-900); color: white; overflow-x: auto; }
    @media (min-width: 720px) { .summary { grid-template-columns: repeat(3, minmax(0, 1fr)); } .coverage__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
  `],
})
export class AdminContentAnalyticsPage implements OnInit {
  private readonly admin = inject(AdminService);
  private readonly seo = inject(SeoService);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly courses = signal<AdminCourse[]>([]);
  readonly plannedMetrics = [
    { icon: '👁️', title: 'Mais e menos vistos', description: 'Ranking por visualizações únicas e recorrentes.' },
    { icon: '🛒', title: 'Mais e menos comprados', description: 'Pedidos aprovados, receita e conversão por curso.' },
    { icon: '🏁', title: 'Conclusão e abandono', description: 'Progressão por módulo, aula e ponto de saída.' },
    { icon: '🔊', title: 'Uso do modo áudio', description: 'Aulas ouvidas, conclusão e velocidade preferida.' },
  ];

  ngOnInit(): void {
    this.seo.apply({ title: 'Analytics de conteúdo', description: 'Desempenho de cursos e aulas.', path: '/admin/analytics', noIndex: true });
    this.admin.listCourses().subscribe({
      next: (courses) => { this.courses.set(courses); this.loading.set(false); },
      error: (err: { message: string }) => { this.error.set(err.message); this.loading.set(false); },
    });
  }

  publishedCount(): number {
    return this.courses().filter((course) => course.status === 'PUBLISHED').length;
  }
}
