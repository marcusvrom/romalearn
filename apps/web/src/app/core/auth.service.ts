import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { API_ROUTES, AuthSessionDto, UserDto, UserRole, WEB_ROUTES } from '@romalearn/contracts';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ApiService } from './api.service';

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  phone?: string;
  acceptedTerms: boolean;
}

/**
 * Estado da sessão no front-end.
 *
 * A sessão real vive em cookies HttpOnly — este serviço apenas guarda os
 * dados do usuário para a interface. Toda autorização é decidida pela API;
 * o que existe aqui serve para exibir a tela certa, nunca para liberar acesso.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  private readonly userSignal = signal<UserDto | null>(null);
  private readonly loadedSignal = signal(false);

  readonly user = this.userSignal.asReadonly();
  readonly isLoaded = this.loadedSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.userSignal() !== null);
  readonly isStaff = computed(() =>
    (this.userSignal()?.roles ?? []).some((role) => role !== UserRole.STUDENT),
  );
  readonly isAdmin = computed(() => (this.userSignal()?.roles ?? []).includes(UserRole.ADMIN));
  readonly needsEmailVerification = computed(() => {
    const user = this.userSignal();
    return user !== null && user.emailVerifiedAt === null;
  });

  /** Carrega a sessão atual. Falha silenciosa quando não há sessão. */
  loadSession(): Observable<UserDto | null> {
    return this.api.get<UserDto>(API_ROUTES.auth.me).pipe(
      tap((user) => {
        this.userSignal.set(user);
        this.loadedSignal.set(true);
      }),
      catchError(() => {
        this.userSignal.set(null);
        this.loadedSignal.set(true);
        return of(null);
      }),
    );
  }

  register(payload: RegisterPayload): Observable<UserDto> {
    return this.api
      .post<AuthSessionDto>(API_ROUTES.auth.register, payload)
      .pipe(map((session) => this.applySession(session)));
  }

  login(email: string, password: string): Observable<UserDto> {
    return this.api
      .post<AuthSessionDto>(API_ROUTES.auth.login, { email, password })
      .pipe(map((session) => this.applySession(session)));
  }

  logout(): void {
    this.api.post(API_ROUTES.auth.logout).subscribe({
      next: () => this.finishLogout(),
      // Mesmo com erro de rede, a sessão local é limpa.
      error: () => this.finishLogout(),
    });
  }

  forgotPassword(email: string): Observable<{ message: string }> {
    return this.api.post<{ message: string }>(API_ROUTES.auth.forgotPassword, { email });
  }

  resetPassword(token: string, password: string): Observable<{ message: string }> {
    return this.api.post<{ message: string }>(API_ROUTES.auth.resetPassword, { token, password });
  }

  verifyEmail(token: string): Observable<UserDto> {
    return this.api
      .post<UserDto>(API_ROUTES.auth.verifyEmail, { token })
      .pipe(tap((user) => this.userSignal.set(user)));
  }

  resendVerification(email: string): Observable<{ message: string }> {
    return this.api.post<{ message: string }>(API_ROUTES.auth.resendVerification, { email });
  }

  updateProfile(payload: { name?: string; phone?: string }): Observable<UserDto> {
    return this.api
      .patch<UserDto>(API_ROUTES.auth.me, payload)
      .pipe(tap((user) => this.userSignal.set(user)));
  }

  changePassword(currentPassword: string, newPassword: string): Observable<void> {
    return this.api
      .post<void>('/auth/me/password', { currentPassword, newPassword })
      .pipe(tap(() => this.finishLogout()));
  }

  private applySession(session: AuthSessionDto): UserDto {
    this.userSignal.set(session.user);
    this.loadedSignal.set(true);
    return session.user;
  }

  private finishLogout(): void {
    this.userSignal.set(null);
    void this.router.navigateByUrl(WEB_ROUTES.home);
  }
}
