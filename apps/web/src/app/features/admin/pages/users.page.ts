import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EntitlementScope, UserDto, UserRole } from '@romalearn/contracts';
import { AlertComponent, LoadingStateComponent } from '@romalearn/ui';
import { formatDate } from '../../../core/format';
import { SeoService } from '../../../core/seo.service';
import { AdminCourse, AdminService } from '../admin.service';

const ROLE_LABEL: Record<string, string> = {
  STUDENT: 'Aluno',
  ADMIN: 'Administrador',
  CONTENT_MANAGER: 'Gestor de conteúdo',
  SUPPORT: 'Suporte',
};

@Component({
  selector: 'rl-admin-users-page',
  standalone: true,
  imports: [FormsModule, LoadingStateComponent, AlertComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Usuários e acessos</h1>

    @if (feedback(); as message) {
      <rl-alert [tone]="message.tone">{{ message.message }}</rl-alert>
    }

    <form class="search" (ngSubmit)="search()">
      <label class="rl-label" for="busca">Buscar por nome ou e-mail</label>
      <div class="search__row">
        <input id="busca" class="rl-input" [(ngModel)]="query" name="busca" />
        <button type="submit" class="rl-button rl-button--secondary">Buscar</button>
      </div>
    </form>

    @if (loading()) {
      <rl-loading label="Carregando usuários…" />
    } @else {
      <div class="rl-table-scroll">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Nome</th>
              <th scope="col">E-mail</th>
              <th scope="col">Papéis</th>
              <th scope="col">Cadastro</th>
              <th scope="col">Ações</th>
            </tr>
          </thead>
          <tbody>
            @for (user of users(); track user.id) {
              <tr>
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>
                  @for (role of user.roles; track role) {
                    <span class="rl-badge" [class.rl-badge--brand]="role !== 'STUDENT'">
                      {{ roleLabel[role] }}
                    </span>
                  }
                </td>
                <td>{{ formatDate(user.createdAt) }}</td>
                <td class="actions">
                  <button
                    type="button"
                    class="rl-button rl-button--secondary rl-button--small"
                    (click)="openGrant(user)"
                  >
                    Liberar acesso
                  </button>
                  <button
                    type="button"
                    class="rl-button rl-button--secondary rl-button--small"
                    (click)="toggleContentManager(user)"
                  >
                    {{ isContentManager(user) ? 'Remover gestor' : 'Tornar gestor' }}
                  </button>
                </td>
              </tr>
            } @empty {
              <tr>
                <td colspan="5" class="rl-muted">Nenhum usuário encontrado.</td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    }

    <!-- Liberação manual -->
    @if (grantTarget(); as target) {
      <section class="rl-card grant">
        <h2>Liberar acesso para {{ target.name }}</h2>
        <p class="rl-small rl-muted">
          Cria a mesma permissão de uma compra aprovada. A ação fica registrada na auditoria com o
          motivo informado.
        </p>

        <div class="rl-field">
          <label class="rl-label" for="curso">Curso</label>
          <select id="curso" class="rl-select" [(ngModel)]="grantCourseId" name="curso">
            <option value="">Selecione um curso</option>
            @for (course of courses(); track course.id) {
              <option [value]="course.id">{{ course.title }}</option>
            }
          </select>
        </div>

        <div class="rl-field">
          <label class="rl-label" for="motivo">Motivo</label>
          <input
            id="motivo"
            class="rl-input"
            [(ngModel)]="grantReason"
            name="motivo"
            placeholder="Ex.: cortesia acordada com o aluno"
          />
        </div>

        <div class="grant__actions">
          <button type="button" class="rl-button rl-button--primary" (click)="grant(target)">
            Liberar acesso
          </button>
          <button
            type="button"
            class="rl-button rl-button--secondary"
            (click)="grantTarget.set(null)"
          >
            Cancelar
          </button>
        </div>
      </section>
    }
  `,
  styles: [
    `
      h1 {
        font-size: var(--rl-text-2xl);
        margin-bottom: var(--rl-space-6);
      }

      .search {
        margin-bottom: var(--rl-space-6);
        max-width: 480px;
      }

      .search__row {
        display: flex;
        gap: var(--rl-space-2);
      }

      .search__row input {
        flex: 1;
      }

      .table {
        width: 100%;
        min-width: 780px;
        border-collapse: collapse;
        background: var(--rl-surface-raised);
        border-radius: var(--rl-radius-lg);
        overflow: hidden;
      }

      th,
      td {
        padding: var(--rl-space-4);
        text-align: left;
        border-bottom: 1px solid var(--rl-border);
        font-size: var(--rl-text-sm);
      }

      thead th {
        background: var(--rl-neutral-100);
        font-size: var(--rl-text-xs);
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: var(--rl-space-2);
      }

      .grant {
        margin-top: var(--rl-space-6);
        border-color: var(--rl-brand-300);
      }

      .grant h2 {
        font-size: var(--rl-text-lg);
        margin-bottom: var(--rl-space-2);
      }

      .grant__actions {
        display: flex;
        flex-wrap: wrap;
        gap: var(--rl-space-2);
      }
    `,
  ],
})
export class AdminUsersPage implements OnInit {
  private readonly admin = inject(AdminService);
  private readonly seo = inject(SeoService);

  readonly loading = signal(true);
  readonly users = signal<UserDto[]>([]);
  readonly courses = signal<AdminCourse[]>([]);
  readonly grantTarget = signal<UserDto | null>(null);
  readonly feedback = signal<{ tone: 'success' | 'error'; message: string } | null>(null);
  readonly roleLabel = ROLE_LABEL;
  readonly formatDate = formatDate;

  query = '';
  grantCourseId = '';
  grantReason = '';

  ngOnInit(): void {
    this.seo.apply({
      title: 'Usuários (admin)',
      description: 'Gestão de usuários, papéis e liberações de acesso.',
      path: '/admin/usuarios',
      noIndex: true,
    });

    this.load();
    this.admin.listCourses().subscribe({
      next: (courses) => this.courses.set(courses),
      error: () => undefined,
    });
  }

  private load(): void {
    this.loading.set(true);

    this.admin.listUsers(this.query || undefined).subscribe({
      next: (result) => {
        this.users.set(result.items);
        this.loading.set(false);
      },
      error: (err: { message: string }) => {
        this.feedback.set({ tone: 'error', message: err.message });
        this.loading.set(false);
      },
    });
  }

  search(): void {
    this.load();
  }

  isContentManager(user: UserDto): boolean {
    return user.roles.includes(UserRole.CONTENT_MANAGER);
  }

  toggleContentManager(user: UserDto): void {
    const roles = this.isContentManager(user)
      ? user.roles.filter((role) => role !== UserRole.CONTENT_MANAGER)
      : [...user.roles, UserRole.CONTENT_MANAGER];

    this.admin.updateUserRoles(user.id, roles).subscribe({
      next: () => {
        this.feedback.set({ tone: 'success', message: `Papéis de ${user.email} atualizados.` });
        this.load();
      },
      error: (err: { message: string }) =>
        this.feedback.set({ tone: 'error', message: err.message }),
    });
  }

  openGrant(user: UserDto): void {
    this.grantTarget.set(user);
    this.grantCourseId = '';
    this.grantReason = '';
  }

  grant(user: UserDto): void {
    if (!this.grantCourseId || !this.grantReason.trim()) {
      this.feedback.set({ tone: 'error', message: 'Escolha o curso e informe o motivo.' });
      return;
    }

    this.admin
      .grantAccess({
        userId: user.id,
        scope: EntitlementScope.COURSE,
        courseId: this.grantCourseId,
        reason: this.grantReason.trim(),
      })
      .subscribe({
        next: () => {
          this.grantTarget.set(null);
          this.feedback.set({
            tone: 'success',
            message: `Acesso liberado para ${user.email}.`,
          });
        },
        error: (err: { message: string }) =>
          this.feedback.set({ tone: 'error', message: err.message }),
      });
  }
}
