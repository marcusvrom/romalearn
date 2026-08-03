import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderDto } from '@romalearn/contracts';
import { AlertComponent, LoadingStateComponent } from '@romalearn/ui';
import { forkJoin } from 'rxjs';
import { formatCurrency } from '../../../core/format';
import { SeoService } from '../../../core/seo.service';
import { AdminCourse, AdminEnrollment, AdminService } from '../admin.service';
import { MetricBarChartComponent, MetricBarChartItem } from '../components/metric-bar-chart.component';

interface CourseEnrollmentSummary { course:AdminCourse; total:number; active:number; completed:number; completionRate:number; }
interface ProductSalesSummary { productName:string; purchases:number; revenueCents:number; }

@Component({
  selector:'rl-admin-content-analytics-page',
  standalone:true,
  imports:[RouterLink,LoadingStateComponent,AlertComponent,MetricBarChartComponent],
  changeDetection:ChangeDetectionStrategy.OnPush,
  template:`
    <header class="page-head"><div><p class="eyebrow">Analytics</p><h1>Desempenho de cursos e conteúdos</h1><p>Compare matrículas, conclusão e compras reais. Visualizações entram quando os eventos forem persistidos no backend.</p></div><a class="rl-button rl-button--secondary" routerLink="/admin/cursos">Gerenciar cursos</a></header>
    @if (loading()) { <rl-loading label="Carregando indicadores…" /> }
    @if (!loading() && error(); as message) { <rl-alert tone="error" title="Não foi possível carregar">{{ message }}</rl-alert> }
    @if (!loading() && !error()) {
      <section class="summary"><article class="rl-card"><span>Cursos cadastrados</span><strong>{{ courses().length }}</strong></article><article class="rl-card"><span>Matrículas analisadas</span><strong>{{ enrollments().length }}</strong></article><article class="rl-card"><span>Pedidos analisados</span><strong>{{ orders().length }}</strong></article><article class="rl-card"><span>Publicados</span><strong>{{ publishedCount() }}</strong></article></section>

      <section class="charts">
        <article class="rl-card"><rl-metric-bar-chart title="Matrículas por curso" description="Comparação dos cursos com maior volume de alunos." [items]="enrollmentChart()" emptyMessage="O gráfico aparecerá após as primeiras matrículas." /></article>
        <article class="rl-card"><rl-metric-bar-chart title="Taxa de conclusão por curso" description="Percentual de matrículas concluídas em cada curso." [items]="completionChart()" emptyMessage="A conclusão aparecerá quando houver matrículas nos cursos." /></article>
        <article class="rl-card"><rl-metric-bar-chart title="Compras por produto" description="Pedidos aprovados agrupados pelo nome do produto." [items]="salesChart()" emptyMessage="O gráfico aparecerá após a primeira compra aprovada." /></article>
        <article class="rl-card"><rl-metric-bar-chart title="Receita por produto" description="Receita aprovada por produto nos pedidos carregados." [items]="revenueChart()" emptyMessage="A receita por produto aparecerá após as primeiras vendas." /></article>
      </section>

      <section class="rankings">
        <article class="rl-card ranking-card"><div class="section-head"><div><h2>Cursos com mais matrículas</h2><p>Ordenação baseada nos registros reais de matrícula.</p></div></div>@if (courseRankings().length===0){<p class="rl-muted">Nenhuma matrícula registrada.</p>}@else{<div class="ranking-list">@for(item of courseRankings();track item.course.id;let position=$index){<a [routerLink]="['/admin/cursos',item.course.id]"><span class="position">{{position+1}}</span><span class="name"><strong>{{item.course.title}}</strong><small>{{item.completed}} concluídas · {{item.active}} ativas</small></span><span class="value">{{item.total}}</span></a>}</div>}</article>
        <article class="rl-card ranking-card"><div class="section-head"><div><h2>Produtos mais comprados</h2><p>Somente pedidos aprovados carregados nesta visão.</p></div></div>@if(salesRankings().length===0){<p class="rl-muted">Nenhuma compra aprovada registrada.</p>}@else{<div class="ranking-list">@for(item of salesRankings();track item.productName;let position=$index){<div class="ranking-row"><span class="position">{{position+1}}</span><span class="name"><strong>{{item.productName}}</strong><small>{{formatCurrency(item.revenueCents)}} de receita</small></span><span class="value">{{item.purchases}}</span></div>}</div>}</article>
      </section>

      <section class="rl-card course-table-card"><div class="section-head"><div><h2>Conclusão por curso</h2><p>A taxa considera matrículas concluídas sobre o total de matrículas.</p></div></div><div class="rl-table-scroll"><table><thead><tr><th>Curso</th><th>Matrículas</th><th>Ativas</th><th>Concluídas</th><th>Taxa</th><th></th></tr></thead><tbody>@for(item of courseCompletion();track item.course.id){<tr><td><strong>{{item.course.title}}</strong><span>{{item.course.status}}</span></td><td>{{item.total}}</td><td>{{item.active}}</td><td>{{item.completed}}</td><td><span class="rate">{{item.completionRate}}%</span></td><td><a [routerLink]="['/admin/cursos',item.course.id]">Revisar →</a></td></tr>}</tbody></table></div></section>

      <section class="rl-card missing-data"><h2>Dados ainda não disponíveis</h2><div class="missing-grid"><article><span>👁️</span><strong>Mais e menos vistos</strong><p>Exige persistência server-side de visualização de curso, sessão e origem.</p></article><article><span>📉</span><strong>Abandono por aula</strong><p>Exige agregação de progresso e último ponto acessado por matrícula.</p></article><article><span>🔊</span><strong>Uso do modo áudio</strong><p>Os eventos já existem no frontend, mas precisam ser enviados e agregados pela API.</p></article><article><span>🎯</span><strong>Conversão por curso</strong><p>Depende de relacionar visualizações, checkout e pagamento aprovado.</p></article></div></section>
    }
  `,
  styles:[`
    .page-head{display:flex;flex-wrap:wrap;justify-content:space-between;gap:var(--rl-space-5);margin-bottom:var(--rl-space-7)}.eyebrow{margin:0 0 var(--rl-space-1);color:var(--rl-brand-link);font-weight:var(--rl-weight-semibold)}h1{margin:0;font-size:var(--rl-text-2xl)}.page-head p:last-child{max-width:76ch;color:var(--rl-text-muted)}
    .summary,.charts,.rankings{display:grid;gap:var(--rl-space-4);margin-bottom:var(--rl-space-5)}.summary article{display:grid;gap:var(--rl-space-2)}.summary span{color:var(--rl-text-subtle);font-size:var(--rl-text-sm)}.summary strong{font-size:var(--rl-text-2xl)}
    .section-head h2,.section-head p{margin:0}.section-head p{margin-top:var(--rl-space-1);color:var(--rl-text-muted)}.ranking-list{display:grid;gap:var(--rl-space-2);margin-top:var(--rl-space-4)}.ranking-list a,.ranking-row{display:grid;grid-template-columns:2rem minmax(0,1fr) auto;align-items:center;gap:var(--rl-space-3);padding:var(--rl-space-3);border:1px solid var(--rl-border);border-radius:var(--rl-radius-md);color:var(--rl-text);text-decoration:none}.position{display:grid;place-items:center;width:2rem;height:2rem;border-radius:50%;background:var(--rl-surface-muted);font-weight:var(--rl-weight-bold)}.name{display:grid;gap:.2rem}.name small{color:var(--rl-text-muted)}.value{font-size:var(--rl-text-lg);font-weight:var(--rl-weight-bold)}
    .course-table-card,.missing-data{margin-bottom:var(--rl-space-5)}table{width:100%;min-width:760px;margin-top:var(--rl-space-4);border-collapse:collapse}th,td{padding:var(--rl-space-3);border-bottom:1px solid var(--rl-border);text-align:left}th{color:var(--rl-text-subtle);font-size:var(--rl-text-xs);text-transform:uppercase;letter-spacing:.05em}td:first-child{display:grid;gap:.2rem}td:first-child span{color:var(--rl-text-muted);font-size:var(--rl-text-xs)}td a{color:var(--rl-brand-link);font-weight:var(--rl-weight-semibold);text-decoration:none}.rate{display:inline-block;min-width:3.5rem;padding:.2rem .5rem;border-radius:999px;background:var(--rl-surface-muted);text-align:center;font-weight:var(--rl-weight-semibold)}
    .missing-grid{display:grid;gap:var(--rl-space-3);margin-top:var(--rl-space-4)}.missing-grid article{display:grid;grid-template-columns:auto 1fr;gap:var(--rl-space-2) var(--rl-space-3);padding:var(--rl-space-4);border-radius:var(--rl-radius-md);background:var(--rl-surface-muted)}.missing-grid p{grid-column:2;margin:0;color:var(--rl-text-muted)}
    @media(min-width:720px){.summary{grid-template-columns:repeat(4,minmax(0,1fr))}.charts,.rankings,.missing-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
  `],
})
export class AdminContentAnalyticsPage implements OnInit {
  private readonly admin=inject(AdminService); private readonly seo=inject(SeoService);
  readonly loading=signal(true); readonly error=signal<string|null>(null); readonly courses=signal<AdminCourse[]>([]); readonly enrollments=signal<AdminEnrollment[]>([]); readonly orders=signal<OrderDto[]>([]); readonly formatCurrency=formatCurrency;

  readonly courseCompletion=computed<CourseEnrollmentSummary[]>(()=>{const enrollments=this.enrollments();return this.courses().map(course=>{const list=enrollments.filter(item=>item.course.id===course.id);const completed=list.filter(item=>item.status==='COMPLETED').length;const active=list.filter(item=>item.status==='ACTIVE').length;return{course,total:list.length,active,completed,completionRate:list.length===0?0:Math.round((completed/list.length)*100)}})});
  readonly courseRankings=computed(()=>[...this.courseCompletion()].sort((a,b)=>b.total-a.total).slice(0,5));
  readonly salesRankings=computed<ProductSalesSummary[]>(()=>{const map=new Map<string,ProductSalesSummary>();for(const order of this.orders().filter(item=>item.status==='APPROVED')){const current=map.get(order.productName)??{productName:order.productName,purchases:0,revenueCents:0};current.purchases+=1;current.revenueCents+=order.totalCents;map.set(order.productName,current)}return Array.from(map.values()).sort((a,b)=>b.purchases-a.purchases).slice(0,5)});
  readonly enrollmentChart=computed<MetricBarChartItem[]>(()=>this.courseRankings().map(item=>({label:item.course.title,value:item.total,formattedValue:String(item.total),detail:`${item.completed} concluídas`})));
  readonly completionChart=computed<MetricBarChartItem[]>(()=>this.courseCompletion().filter(item=>item.total>0).sort((a,b)=>b.completionRate-a.completionRate).slice(0,8).map(item=>({label:item.course.title,value:item.completionRate,formattedValue:`${item.completionRate}%`,detail:`${item.completed} de ${item.total}`})));
  readonly salesChart=computed<MetricBarChartItem[]>(()=>this.salesRankings().map(item=>({label:item.productName,value:item.purchases,formattedValue:String(item.purchases),detail:formatCurrency(item.revenueCents)})));
  readonly revenueChart=computed<MetricBarChartItem[]>(()=>this.salesRankings().filter(item=>item.revenueCents>0).sort((a,b)=>b.revenueCents-a.revenueCents).map(item=>({label:item.productName,value:item.revenueCents,formattedValue:formatCurrency(item.revenueCents),detail:`${item.purchases} compras`})));

  ngOnInit():void{this.seo.apply({title:'Analytics de conteúdo',description:'Desempenho de cursos e aulas.',path:'/admin/analytics',noIndex:true});forkJoin({courses:this.admin.listCourses(),enrollments:this.admin.listEnrollments(),orders:this.admin.listOrders(1)}).subscribe({next:({courses,enrollments,orders})=>{this.courses.set(courses);this.enrollments.set(enrollments);this.orders.set(orders.items);this.loading.set(false)},error:(err:{message:string})=>{this.error.set(err.message);this.loading.set(false)}})}
  publishedCount():number{return this.courses().filter(course=>course.status==='PUBLISHED').length}
}
