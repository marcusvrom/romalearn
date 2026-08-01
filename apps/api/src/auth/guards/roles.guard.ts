import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@romalearn/contracts';
import { RequestWithUser } from '../../common/decorators/current-user.decorator';
import { ROLES_KEY } from '../../common/decorators/roles.decorator';
import { DomainErrors } from '../../common/errors/domain-error';

/**
 * Autorização por papel, sempre no backend.
 *
 * `ADMIN` acumula implicitamente as permissões dos demais papéis
 * administrativos, evitando ter que listar todos em cada rota.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!required || required.length === 0) return true;

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const roles = request.user?.roles ?? [];

    if (roles.includes(UserRole.ADMIN)) return true;
    if (required.some((role) => roles.includes(role))) return true;

    throw DomainErrors.forbidden();
  }
}
