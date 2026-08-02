import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PaginatedResult, UserDto } from '@romalearn/contracts';
import { AlertComponent, LoadingStateComponent } from '@romalearn/ui';
import { SeoService } from '../../../core/seo.service';
import { AdminService } from '../admin.service';

@Component({
  selector: 'rl-admin-support-center-page',
  standalone: true,
  imports: [RouterLink, LoadingStateComponent, AlertComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="page-head">
      <div>
        <p class="eyebrow">Relacionamento</p>
        <h1>Central de atendimento</h1>
        <p>Fundação para atendimento por chat com histórico completo do aluno, compras, cursos e acessos.</p>
      </div>
      <a class="rl-button rl-button--secondary" routerLink="/admin/usuarios">Consultar alunos</a>
    </header>

    <section class="layout">
      <aside class="rl-card inbox" aria-label="Filas de atendimento">
        <h2>Filas</h2>
        @for (queue of queues; track queue.label) {
          <button type="button" [class.active]="queue.key === selectedQueue()" (click)="selectedQueue.set(queue.key)">
            <span>{{ queue.icon }} {{ queue.label }}</span>
            <strong>{{ queue.count }}</strong>
          </button>
        }
      </aside>

      <section class="rl-card workspace">
        <div class="workspace__head">
          <div>
            <h2>Inbox unificada</h2>
            <p>Chat interno, e-mail, anexos, notas privadas, tags e SLA entrarão nesta área.</p>
          </div>
          <span class="status">Estrutura inicial</span>
        </div>

        <div class="empty-state">
          <span aria-hidden="true">💬</span>
          <h3>Nenhuma conversa carregada</h3>
          <p>O próximo passo é criar as entidades de conversa, mensagem, participante, atribuição e SLA.</p>
          <code>GET /admin/support/conversations?queue=open</code>
        </div>
      </section>

      <aside class="rl-card context" aria-label="Contexto do aluno">
        <h2>Contexto do aluno</h2>
        <p class="rl-muted">Ao selecionar uma conversa, esta coluna exibirá:</p>
        <ul>
          <li>perfil e dados de contato;</li>
          <li>compras, método e status;</li>
          <li>cursos, progresso e certificados;</li>
          <li>acessos manuais e reembolsos;</li>
          <li>histórico de atendimentos.</li>
        </ul>
      </aside>
    </section>

    <section class="rl-card recent-users">
      <h2>Alunos disponíveis para consulta</h2>
      @if (loading()) { <rl-loading label="Carregando alunos…" /> }
      @if (!loading() && error(); as message) { <rl-alert tone="error">{{ message }}</rl-alert> }
      @if (!loading() && !error() && users(); as result) {
        <div class="users">
          @for (user of result.items.slice(0, 6); track user.id) {
            <a routerLink="/admin/usuarios">
              <span><strong>{{ user.name }}</strong><small>{{ user.email }}</small></span>
              <span>Ver cadastro →</span>
            </a>
          }
        </div>
      }
    </section>
  `,
  styles: [`
    .page-head { display: flex; flex-wrap: wrap; justify-content: space-between; gap: var(--rl-space-5); margin-bottom: var(--rl-space-7); }
    .eyebrow { margin: 0 0 var(--rl-space-1); color: var(--rl-brand-link); font-weight: var(--rl-weight-semibold); }
    h1 { margin: 0; font-size: var(--rl-text-2xl); }
    .page-head p:last-child { max-width: 72ch; color: var(--rl-text-muted); }
    .layout { display: grid; gap: var(--rl-space-4); margin-bottom: var(--rl-space-5); }
    h2 { margin-top: 0; font-size: var(--rl-text-lg); }
    .inbox { display: grid; align-content: start; gap: var(--rl-space-2); }
    .inbox button { display: flex; justify-content: space-between; gap: var(--rl-space-3); min-height: 44px; padding: var(--rl-space-3); border: 0; border-radius: var(--rl-radius-md); background: transparent; color: var(--rl-text); font: inherit; text-align: left; cursor: pointer; }
    .inbox button:hover, .inbox button.active { background: var(--rl-surface-muted); }
    .workspace__head { display: flex; flex-wrap: wrap; justify-content: space-between; gap: var(--rl-space-3); }
    .workspace__head p { margin: 0; color: var(--rl-text-muted); }
    .status { align-self: flex-start; padding: .25rem .6rem; border-radius: 999px; background: var(--rl-brand-50); color: var(--rl-brand-on-surface); font-size: var(--rl-text-xs); font-weight: var(--rl-weight-semibold); }
    .empty-state { display: grid; justify-items: center; gap: var(--rl-space-2); margin-top: var(--rl-space-6); padding: var(--rl-space-8); border: 1px dashed var(--rl-border); border-radius: var(--rl-radius-md); text-align: center; }
    .empty-state span { font-size: 2rem; }
    .empty-state h3, .empty-state p { margin: 0; }
    .empty-state p { max-width: 58ch; color: var(--rl-text-muted); }
    .empty-state code { margin-top: var(--rl-space-2); padding: var(--rl-space-2); border-radius: var(--rl-radius-sm); background: var(--rl-neutral-900); color: white; max-width: 100%; overflow-x: auto; }
    .context ul { padding-left: 1.25rem; color: var(--rl-text-muted); }
    .users { display: grid; gap: var(--rl-space-2); }
    .users a { display: flex; align-items: center; justify-content: space-between; gap: var(--rl-space-4); padding: var(--rl-space-3); border: 1px solid var(--rl-border); border-radius: var(--rl-radius-md); color: var(--rl-text); text-decoration: none; }
    .users span:first-child { display: grid; gap: .2rem; }
    .users small { color: var(--rl-text-muted); }
    @media (min-width: 1020px) { .layout { grid-template-columns: 230px minmax(0, 1fr) 290px; align-items: stretch; } }
  `],
})
export class AdminSupportCenterPage implements OnInit {
  private readonly admin = inject(AdminService);
  private readonly seo = inject(SeoService);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly users = signal<PaginatedResult<UserDto> | null>(null);
  readonly selectedQueue = signal('open');
  readonly queues = [
    { key: 'open', label: 'Abertos', icon: '📥', count: 0 },
    { key: 'mine', label: 'Meus atendimentos', icon: '👤', count: 0 },
    { key: 'waiting', label: 'Aguardando aluno', icon: '⏳', count: 0 },
    { key: 'closed', label: 'Resolvidos', icon: '✅', count: 0 },
  ];

  ngOnInit(): void {
    this.seo.apply({ title: 'Central de atendimento', description: 'Atendimento e suporte aos alunos.', path: '/admin/atendimento', noIndex: true });
    this.admin.listUsers(undefined, 1).subscribe({
      next: (users) => { this.users.set(users); this.loading.set(false); },
      error: (err: { message: string }) => { this.error.set(err.message); this.loading.set(false); },
    });
  }
}
