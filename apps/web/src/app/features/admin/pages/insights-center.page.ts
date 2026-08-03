import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AdminDashboardDto, OrderDto } from '@romalearn/contracts';
import { AlertComponent, LoadingStateComponent } from '@romalearn/ui';
import { forkJoin } from 'rxjs';
import { formatCurrency } from '../../../core/format';
import { SeoService } from '../../../core/seo.service';
import { AdminCourse, AdminEnrollment, AdminService } from '../admin.service';

type InsightSeverity = 'critical' | 'high' | 'medium' | 'opportunity';
type InsightDomain = 'Financeiro' | 'Conteúdo' | 'Conversão' | 'Suporte' | 'Operação';

interface BusinessInsight {
  id: string;
  domain: InsightDomain;
  severity: InsightSeverity;
  title: string;
  summary: string;
  evidence: string;
  action: string;
  route?: string;
}

@Component({
  selector: 'rl-admin-insights-center-page',
  standalone: true,
  imports: [RouterLink, LoadingStateComponent, AlertComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <div>
        <p class="eyebrow">Intelligence Center</p>
        <h1>Insights e oportunidades da plataforma</h1>
        <p>Recomendações explicáveis geradas a partir dos dados disponíveis, sem depender de IA paga nesta primeira etapa.</p>
      </div>
      <a class="rl-button rl-button--secondary" routerLink="/admin/analytics">Ver analytics</a>
    </header>

    @if (loading()) { <rl-loading label="Analisando indicadores…" /> }
    @if (!loading() && error(); as message) {
      <rl-alert tone="error" title="Não foi possível gerar os insights">{{ message }}</rl-alert>
    }

    @if (!loading() && !error()) {
      <section class="summary" aria-label="Resumo dos insights">
        <article class="rl-card"><span>Insights ativos</span><strong>{{ insights().length }}</strong></article>
        <article class="rl-card"><span>Alta prioridade</span><strong>{{ highPriorityCount() }}</strong></article>
        <article class="rl-card"><span>Oportunidades</span><strong>{{ opportunityCount() }}</strong></article>
        <article class="rl-card"><span>Dados analisados</span><strong>{{ analyzedRecords() }}</strong></article>
      </section>

      <section class="filters" aria-label="Filtros de insights">
        @for (domain of domains; track domain) {
          <button type="button" [class.active]="selectedDomain() === domain" (click)="selectedDomain.set(domain)">
            {{ domain }}
          </button>
        }
      </section>

      <section class="insights" aria-live="polite">
        @for (insight of filteredInsights(); track insight.id) {
          <article class="rl-card insight" [attr.data-severity]="insight.severity">
            <div class="insight__head">
              <div>
                <span class="domain">{{ insight.domain }}</span>
                <span class="severity">{{ severityLabel[insight.severity] }}</span>
              </div>
              @if (insight.route) {
                <a [routerLink]="insight.route">Investigar →</a>
              }
            </div>
            <h2>{{ insight.title }}</h2>
            <p>{{ insight.summary }}</p>
            <dl>
              <div><dt>Evidência</dt><dd>{{ insight.evidence }}</dd></div>
              <div><dt>Ação recomendada</dt><dd>{{ insight.action }}</dd></div>
            </dl>
          </article>
        } @empty {
          <article class="rl-card empty">
            <h2>Nenhum insight nesta categoria</h2>
            <p>Os dados atuais não ativaram nenhuma regra para o filtro selecionado.</p>
          </article>
        }
      </section>

      <section class="rl-card methodology">
        <h2>Como os insights são produzidos</h2>
        <p>As regras usam somente dados observáveis. Cada recomendação mostra a evidência que a originou e nunca executa uma ação sensível automaticamente.</p>
        <div class="methodology__grid">
          <article><strong>Agora</strong><span>Regras determinísticas, gratuitas e auditáveis.</span></article>
          <article><strong>Depois</strong><span>Comparação temporal, anomalias e metas configuráveis.</span></article>
          <article><strong>Opcional</strong><span>IA para resumir e explicar, sem substituir os cálculos.</span></article>
        </div>
      </section>
    }
  `,
  styles: [`
    .page-head { display: flex; flex-wrap: wrap; justify-content: space-between; gap: var(--rl-space-5); margin-bottom: var(--rl-space-7); }
    .eyebrow { margin: 0 0 var(--rl-space-1); color: var(--rl-brand-link); font-weight: var(--rl-weight-semibold); }
    h1 { margin: 0; font-size: var(--rl-text-2xl); }
    .page-head p:last-child { max-width: 76ch; color: var(--rl-text-muted); }
    .summary { display: grid; gap: var(--rl-space-4); margin-bottom: var(--rl-space-5); }
    .summary article { display: grid; gap: var(--rl-space-2); }
    .summary span { color: var(--rl-text-subtle); font-size: var(--rl-text-sm); }
    .summary strong { font-size: var(--rl-text-2xl); }
    .filters { display: flex; flex-wrap: wrap; gap: var(--rl-space-2); margin-bottom: var(--rl-space-5); }
    .filters button { min-height: 40px; padding: .55rem .85rem; border: 1px solid var(--rl-border); border-radius: 999px; background: var(--rl-surface-raised); color: var(--rl-text); cursor: pointer; }
    .filters button.active { border-color: var(--rl-brand-500); background: var(--rl-brand-50); color: var(--rl-brand-on-surface); font-weight: var(--rl-weight-semibold); }
    .insights { display: grid; gap: var(--rl-space-4); margin-bottom: var(--rl-space-5); }
    .insight { border-left-width: 4px; }
    .insight[data-severity='critical'] { border-left-color: var(--rl-danger-500); }
    .insight[data-severity='high'] { border-left-color: var(--rl-warning-500); }
    .insight[data-severity='medium'] { border-left-color: var(--rl-brand-500); }
    .insight[data-severity='opportunity'] { border-left-color: var(--rl-success-500); }
    .insight__head { display: flex; align-items: center; justify-content: space-between; gap: var(--rl-space-3); }
    .insight__head > div { display: flex; flex-wrap: wrap; gap: var(--rl-space-2); }
    .domain, .severity { padding: .2rem .55rem; border-radius: 999px; background: var(--rl-surface-muted); color: var(--rl-text-subtle); font-size: var(--rl-text-xs); }
    .insight__head a { color: var(--rl-brand-link); font-weight: var(--rl-weight-semibold); text-decoration: none; }
    .insight h2 { margin: var(--rl-space-4) 0 var(--rl-space-2); font-size: var(--rl-text-lg); }
    .insight p { color: var(--rl-text-muted); }
    dl { display: grid; gap: var(--rl-space-3); margin: var(--rl-space-4) 0 0; }
    dl div { padding: var(--rl-space-3); border-radius: var(--rl-radius-md); background: var(--rl-surface-muted); }
    dt { color: var(--rl-text-subtle); font-size: var(--rl-text-xs); text-transform: uppercase; letter-spacing: .05em; }
    dd { margin: .3rem 0 0; }
    .empty { text-align: center; }
    .methodology h2 { margin-top: 0; }
    .methodology > p { color: var(--rl-text-muted); }
    .methodology__grid { display: grid; gap: var(--rl-space-3); margin-top: var(--rl-space-4); }
    .methodology__grid article { display: grid; gap: .25rem; padding: var(--rl-space-4); border-radius: var(--rl-radius-md); background: var(--rl-surface-muted); }
    .methodology__grid span { color: var(--rl-text-muted); }
    @media (min-width: 720px) { .summary { grid-template-columns: repeat(4, minmax(0, 1fr)); } .insights { grid-template-columns: repeat(2, minmax(0, 1fr)); } .methodology__grid { grid-template-columns: repeat(3, minmax(0, 1fr)); } }
  `],
})
export class AdminInsightsCenterPage implements OnInit {
  private readonly admin = inject(AdminService);
  private readonly seo = inject(SeoService);

  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly dashboard = signal<AdminDashboardDto | null>(null);
  readonly courses = signal<AdminCourse[]>([]);
  readonly enrollments = signal<AdminEnrollment[]>([]);
  readonly orders = signal<OrderDto[]>([]);
  readonly selectedDomain = signal('Todos');

  readonly domains = ['Todos', 'Financeiro', 'Conteúdo', 'Conversão', 'Suporte', 'Operação'];
  readonly severityLabel: Record<InsightSeverity, string> = {
    critical: 'Crítico',
    high: 'Alta prioridade',
    medium: 'Atenção',
    opportunity: 'Oportunidade',
  };

  readonly insights = computed<BusinessInsight[]>(() => {
    const dashboard = this.dashboard();
    if (!dashboard) return [];

    const insights: BusinessInsight[] = [];
    const approvedOrders = this.orders().filter((order) => order.status === 'APPROVED');
    const pendingOrders = this.orders().filter((order) => order.status === 'PENDING' || order.status === 'PROCESSING');

    if (dashboard.webhooks.failed > 0) {
      insights.push({
        id: 'failed-webhooks', domain: 'Operação', severity: 'critical',
        title: 'Falhas de webhook podem bloquear acessos',
        summary: 'Existem eventos de pagamento que não foram processados corretamente.',
        evidence: `${dashboard.webhooks.failed} webhook(s) com falha no momento.`,
        action: 'Reprocessar os eventos e verificar se todos os alunos receberam o acesso comprado.',
        route: '/admin/pedidos',
      });
    }

    if (pendingOrders.length > approvedOrders.length && pendingOrders.length >= 3) {
      insights.push({
        id: 'pending-orders', domain: 'Financeiro', severity: 'high',
        title: 'Volume de pagamentos pendentes merece investigação',
        summary: 'A quantidade de pedidos pendentes está maior que a de pedidos aprovados carregados.',
        evidence: `${pendingOrders.length} pendentes contra ${approvedOrders.length} aprovados.`,
        action: 'Separar por método, verificar expiração do Pix e analisar recusas ou abandono no checkout.',
        route: '/admin/financeiro',
      });
    }

    const courseStats = this.courses().map((course) => {
      const enrollments = this.enrollments().filter((item) => item.course.id === course.id);
      const completed = enrollments.filter((item) => item.status === 'COMPLETED').length;
      return { course, total: enrollments.length, completed, rate: enrollments.length ? Math.round((completed / enrollments.length) * 100) : 0 };
    });

    for (const item of courseStats.filter((item) => item.total >= 5 && item.rate < 25).slice(0, 3)) {
      insights.push({
        id: `low-completion-${item.course.id}`, domain: 'Conteúdo', severity: 'high',
        title: `Baixa conclusão em ${item.course.title}`,
        summary: 'A taxa de conclusão está abaixo do esperado para um curso com matrículas relevantes.',
        evidence: `${item.completed} de ${item.total} matrículas concluídas (${item.rate}%).`,
        action: 'Revisar extensão das aulas, dificuldade das atividades, clareza da jornada e pontos de abandono.',
        route: `/admin/cursos/${item.course.id}`,
      });
    }

    const coursesWithoutEnrollments = courseStats.filter((item) => item.total === 0 && item.course.status === 'PUBLISHED');
    if (coursesWithoutEnrollments.length > 0) {
      insights.push({
        id: 'published-without-enrollments', domain: 'Conversão', severity: 'medium',
        title: 'Cursos publicados ainda não receberam matrículas',
        summary: 'Parte do catálogo publicado não possui adesão registrada.',
        evidence: `${coursesWithoutEnrollments.length} curso(s) publicado(s) sem matrícula.`,
        action: 'Revisar página comercial, destaque no catálogo, preço, amostra gratuita e posicionamento da oferta.',
        route: '/admin/analytics',
      });
    }

    const topProduct = approvedOrders.reduce<Map<string, { purchases: number; revenue: number }>>((map, order) => {
      const current = map.get(order.productName) ?? { purchases: 0, revenue: 0 };
      current.purchases += 1;
      current.revenue += order.totalCents;
      map.set(order.productName, current);
      return map;
    }, new Map());
    const bestSeller = [...topProduct.entries()].sort((a, b) => b[1].purchases - a[1].purchases)[0];
    if (bestSeller && bestSeller[1].purchases >= 3) {
      insights.push({
        id: 'best-seller', domain: 'Conversão', severity: 'opportunity',
        title: `${bestSeller[0]} demonstra maior tração comercial`,
        summary: 'Este produto lidera as compras aprovadas e pode orientar novas ofertas.',
        evidence: `${bestSeller[1].purchases} compras e ${formatCurrency(bestSeller[1].revenue)} de receita.`,
        action: 'Testar bundle, curso complementar, prova social verdadeira e campanhas semelhantes.',
        route: '/admin/produtos',
      });
    }

    if (dashboard.users.total > 0 && dashboard.enrollments.total === 0) {
      insights.push({
        id: 'users-without-enrollments', domain: 'Conversão', severity: 'high',
        title: 'Usuários cadastrados não estão iniciando cursos',
        summary: 'Há contas criadas, mas nenhuma matrícula consolidada.',
        evidence: `${dashboard.users.total} usuário(s) e nenhuma matrícula.`,
        action: 'Revisar onboarding, CTA do módulo gratuito e processo de matrícula.',
        route: '/admin/usuarios',
      });
    }

    insights.push({
      id: 'support-data-foundation', domain: 'Suporte', severity: 'opportunity',
      title: 'Estruturar categorias e CSAT permitirá insights de satisfação',
      summary: 'A central já possui a visualização, mas ainda precisa persistir conversas e avaliações.',
      evidence: 'Métricas de primeira resposta, resolução, reabertura e satisfação ainda não estão disponíveis.',
      action: 'Implementar entidades de suporte, pesquisa pós-atendimento e agregação por categoria.',
      route: '/admin/atendimento',
    });

    return insights;
  });

  readonly filteredInsights = computed(() => {
    const domain = this.selectedDomain();
    return domain === 'Todos' ? this.insights() : this.insights().filter((item) => item.domain === domain);
  });

  readonly highPriorityCount = computed(() => this.insights().filter((item) => item.severity === 'critical' || item.severity === 'high').length);
  readonly opportunityCount = computed(() => this.insights().filter((item) => item.severity === 'opportunity').length);
  readonly analyzedRecords = computed(() => this.courses().length + this.enrollments().length + this.orders().length);

  ngOnInit(): void {
    this.seo.apply({ title: 'Intelligence Center', description: 'Insights acionáveis da RomaLearn.', path: '/admin/insights', noIndex: true });
    forkJoin({
      dashboard: this.admin.dashboard(),
      courses: this.admin.listCourses(),
      enrollments: this.admin.listEnrollments(),
      orders: this.admin.listOrders(1),
    }).subscribe({
      next: ({ dashboard, courses, enrollments, orders }) => {
        this.dashboard.set(dashboard);
        this.courses.set(courses);
        this.enrollments.set(enrollments);
        this.orders.set(orders.items);
        this.loading.set(false);
      },
      error: (err: { message: string }) => {
        this.error.set(err.message);
        this.loading.set(false);
      },
    });
  }
}
