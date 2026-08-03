import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PaginatedResult, UserDto } from '@romalearn/contracts';
import { AlertComponent, LoadingStateComponent } from '@romalearn/ui';
import { SeoService } from '../../../core/seo.service';
import { AdminService } from '../admin.service';
import { MetricBarChartComponent, MetricBarChartItem } from '../components/metric-bar-chart.component';

@Component({
  selector:'rl-admin-support-center-page',
  standalone:true,
  imports:[RouterLink,LoadingStateComponent,AlertComponent,MetricBarChartComponent],
  changeDetection:ChangeDetectionStrategy.OnPush,
  template:`
    <header class="page-head"><div><p class="eyebrow">Relacionamento</p><h1>Central de atendimento</h1><p>Atendimento com contexto do aluno, métricas operacionais e satisfação do cliente.</p></div><a class="rl-button rl-button--secondary" routerLink="/admin/usuarios">Consultar alunos</a></header>

    <section class="support-metrics" aria-label="Indicadores de atendimento">
      @for(metric of plannedMetrics;track metric.label){<article class="rl-card metric"><span>{{metric.label}}</span><strong>—</strong><small>{{metric.description}}</small></article>}
    </section>

    <section class="support-charts">
      <article class="rl-card"><rl-metric-bar-chart title="Chamados por categoria" description="Pagamento, acesso, conteúdo, certificado e dúvidas gerais." [items]="categoryChart" emptyMessage="As categorias aparecerão após a persistência das conversas de suporte." /></article>
      <article class="rl-card"><rl-metric-bar-chart title="Satisfação do atendimento" description="Distribuição das avaliações de 1 a 5 estrelas." [items]="satisfactionChart" emptyMessage="O gráfico de CSAT aparecerá após as primeiras avaliações de atendimento." /></article>
    </section>

    <section class="layout">
      <aside class="rl-card inbox" aria-label="Filas de atendimento"><h2>Filas</h2>@for(queue of queues;track queue.label){<button type="button" [class.active]="queue.key===selectedQueue()" (click)="selectedQueue.set(queue.key)"><span>{{queue.icon}} {{queue.label}}</span><strong>{{queue.count}}</strong></button>}</aside>
      <section class="rl-card workspace"><div class="workspace__head"><div><h2>Inbox unificada</h2><p>Chat interno, e-mail, anexos, notas privadas, tags e SLA entrarão nesta área.</p></div><span class="status">Estrutura inicial</span></div><div class="empty-state"><span aria-hidden="true">💬</span><h3>Nenhuma conversa carregada</h3><p>O próximo passo é criar conversa, mensagem, participante, atribuição, categoria, SLA e avaliação.</p><code>GET /admin/support/conversations?queue=open</code></div></section>
      <aside class="rl-card context" aria-label="Contexto do aluno"><h2>Contexto do aluno</h2><p class="rl-muted">Ao selecionar uma conversa, esta coluna exibirá:</p><ul><li>perfil e dados de contato;</li><li>compras, método e status;</li><li>cursos, progresso e certificados;</li><li>acessos manuais e reembolsos;</li><li>histórico e satisfação anterior.</li></ul></aside>
    </section>

    <section class="rl-card data-contract"><h2>Dados necessários para suporte e satisfação</h2><div class="contract-grid"><article><strong>Operação</strong><code>GET /admin/support/metrics</code><p>Volume, backlog, primeira resposta, resolução, reabertura e SLA.</p></article><article><strong>Satisfação</strong><code>GET /admin/support/satisfaction</code><p>CSAT, distribuição de notas, comentários e taxa de resposta.</p></article><article><strong>Categorias</strong><code>GET /admin/support/categories</code><p>Quantidade, resolução e satisfação por motivo de contato.</p></article><article><strong>Tendência</strong><code>GET /admin/support/timeline?period=30d</code><p>Chamados recebidos e resolvidos por dia ou semana.</p></article></div></section>

    <section class="rl-card recent-users"><h2>Alunos disponíveis para consulta</h2>@if(loading()){<rl-loading label="Carregando alunos…"/>}@if(!loading()&&error();as message){<rl-alert tone="error">{{message}}</rl-alert>}@if(!loading()&&!error()&&users();as result){<div class="users">@for(user of result.items.slice(0,6);track user.id){<a routerLink="/admin/usuarios"><span><strong>{{user.name}}</strong><small>{{user.email}}</small></span><span>Ver cadastro →</span></a>}</div>}</section>
  `,
  styles:[`
    .page-head{display:flex;flex-wrap:wrap;justify-content:space-between;gap:var(--rl-space-5);margin-bottom:var(--rl-space-7)}.eyebrow{margin:0 0 var(--rl-space-1);color:var(--rl-brand-link);font-weight:var(--rl-weight-semibold)}h1{margin:0;font-size:var(--rl-text-2xl)}.page-head p:last-child{max-width:72ch;color:var(--rl-text-muted)}
    .support-metrics,.support-charts{display:grid;gap:var(--rl-space-4);margin-bottom:var(--rl-space-5)}.metric{display:grid;gap:var(--rl-space-2)}.metric span{color:var(--rl-text-subtle);font-size:var(--rl-text-sm)}.metric strong{font-size:var(--rl-text-2xl)}.metric small{color:var(--rl-text-muted)}
    .layout{display:grid;gap:var(--rl-space-4);margin-bottom:var(--rl-space-5)}h2{margin-top:0;font-size:var(--rl-text-lg)}.inbox{display:grid;align-content:start;gap:var(--rl-space-2)}.inbox button{display:flex;justify-content:space-between;gap:var(--rl-space-3);min-height:44px;padding:var(--rl-space-3);border:0;border-radius:var(--rl-radius-md);background:transparent;color:var(--rl-text);font:inherit;text-align:left;cursor:pointer}.inbox button:hover,.inbox button.active{background:var(--rl-surface-muted)}
    .workspace__head{display:flex;flex-wrap:wrap;justify-content:space-between;gap:var(--rl-space-3)}.workspace__head p{margin:0;color:var(--rl-text-muted)}.status{align-self:flex-start;padding:.25rem .6rem;border-radius:999px;background:var(--rl-brand-50);color:var(--rl-brand-on-surface);font-size:var(--rl-text-xs);font-weight:var(--rl-weight-semibold)}.empty-state{display:grid;justify-items:center;gap:var(--rl-space-2);margin-top:var(--rl-space-6);padding:var(--rl-space-8);border:1px dashed var(--rl-border);border-radius:var(--rl-radius-md);text-align:center}.empty-state span{font-size:2rem}.empty-state h3,.empty-state p{margin:0}.empty-state p{max-width:58ch;color:var(--rl-text-muted)}.empty-state code{margin-top:var(--rl-space-2);padding:var(--rl-space-2);border-radius:var(--rl-radius-sm);background:var(--rl-neutral-900);color:white;max-width:100%;overflow-x:auto}
    .context ul{padding-left:1.25rem;color:var(--rl-text-muted)}.data-contract,.recent-users{margin-bottom:var(--rl-space-5)}.contract-grid{display:grid;gap:var(--rl-space-3)}.contract-grid article{display:grid;gap:var(--rl-space-2);padding:var(--rl-space-4);border-radius:var(--rl-radius-md);background:var(--rl-surface-muted)}.contract-grid code{overflow-wrap:anywhere}.contract-grid p{margin:0;color:var(--rl-text-muted)}.users{display:grid;gap:var(--rl-space-2)}.users a{display:flex;align-items:center;justify-content:space-between;gap:var(--rl-space-4);padding:var(--rl-space-3);border:1px solid var(--rl-border);border-radius:var(--rl-radius-md);color:var(--rl-text);text-decoration:none}.users span:first-child{display:grid;gap:.2rem}.users small{color:var(--rl-text-muted)}
    @media(min-width:720px){.support-metrics{grid-template-columns:repeat(4,minmax(0,1fr))}.support-charts,.contract-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(min-width:1020px){.layout{grid-template-columns:230px minmax(0,1fr) 290px;align-items:stretch}}
  `],
})
export class AdminSupportCenterPage implements OnInit {
  private readonly admin=inject(AdminService); private readonly seo=inject(SeoService);
  readonly loading=signal(true); readonly error=signal<string|null>(null); readonly users=signal<PaginatedResult<UserDto>|null>(null); readonly selectedQueue=signal('open');
  readonly categoryChart:MetricBarChartItem[]=[]; readonly satisfactionChart:MetricBarChartItem[]=[];
  readonly plannedMetrics=[{label:'Chamados abertos',description:'backlog atual'},{label:'Primeira resposta',description:'tempo médio'},{label:'Resolução',description:'tempo médio'},{label:'CSAT',description:'satisfação média'}];
  readonly queues=[{key:'open',label:'Abertos',icon:'📥',count:0},{key:'mine',label:'Meus atendimentos',icon:'👤',count:0},{key:'waiting',label:'Aguardando aluno',icon:'⏳',count:0},{key:'closed',label:'Resolvidos',icon:'✅',count:0}];
  ngOnInit():void{this.seo.apply({title:'Central de atendimento',description:'Atendimento e suporte aos alunos.',path:'/admin/atendimento',noIndex:true});this.admin.listUsers(undefined,1).subscribe({next:users=>{this.users.set(users);this.loading.set(false)},error:(err:{message:string})=>{this.error.set(err.message);this.loading.set(false)}})}
}
