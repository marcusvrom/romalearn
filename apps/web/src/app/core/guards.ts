import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserRole, WEB_ROUTES } from '@romalearn/contracts';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

/**
 * Guards de navegação.
 *
 * Servem apenas para levar o usuário à tela certa: nenhum dado protegido
 * chega ao navegador sem a autorização do backend, mesmo que um guard seja
 * contornado.
 */

async function ensureSessionLoaded(auth: AuthService): Promise<void> {
  if (!auth.isLoaded()) {
    await firstValueFrom(auth.loadSession());
  }
}

export const authGuard: CanActivateFn = async (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  await ensureSessionLoaded(auth);
  if (auth.isAuthenticated()) return true;

  // Guarda o destino para voltar após o login.
  return router.createUrlTree([WEB_ROUTES.login], {
    queryParams: { redirecionar: state.url },
  });
};

export const staffGuard: CanActivateFn = async (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  await ensureSessionLoaded(auth);
  if (!auth.isAuthenticated()) {
    return router.createUrlTree([WEB_ROUTES.login], { queryParams: { redirecionar: state.url } });
  }

  const required = (route.data['roles'] as UserRole[] | undefined) ?? [];
  const roles = auth.user()?.roles ?? [];

  const allowed =
    roles.includes(UserRole.ADMIN) ||
    (required.length === 0 ? auth.isStaff() : required.some((role) => roles.includes(role)));

  return allowed ? true : router.createUrlTree([WEB_ROUTES.dashboard]);
};

/** Impede que quem já está logado veja telas de login/cadastro. */
export const guestGuard: CanActivateFn = async () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  await ensureSessionLoaded(auth);
  return auth.isAuthenticated() ? router.createUrlTree([WEB_ROUTES.dashboard]) : true;
};
