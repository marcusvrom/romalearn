import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { IS_PUBLIC_KEY, OPTIONAL_AUTH_KEY } from '../../common/decorators/public.decorator';
import { AuthenticatedUser, RequestWithUser } from '../../common/decorators/current-user.decorator';
import { DomainErrors } from '../../common/errors/domain-error';
import { requestContext } from '../../common/context/request-context';
import { ACCESS_TOKEN_COOKIE } from '../auth.constants';
import { AppConfig } from '../../config/configuration';

interface AccessTokenPayload {
  sub: string;
  email: string;
  roles: AuthenticatedUser['roles'];
}

/**
 * Guard global de autenticação.
 *
 * O token é lido preferencialmente do cookie `HttpOnly`; o header
 * `Authorization: Bearer` é aceito para clientes não-navegador e testes.
 */
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AppConfig, true>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const isOptional = this.reflector.getAllAndOverride<boolean>(OPTIONAL_AUTH_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const token = this.extractToken(request);

    if (!token) {
      if (isPublic || isOptional) return true;
      throw DomainErrors.sessionExpired();
    }

    try {
      const auth = this.configService.get('auth', { infer: true });
      const payload = await this.jwtService.verifyAsync<AccessTokenPayload>(token, {
        secret: auth.accessSecret,
      });

      request.user = { id: payload.sub, email: payload.email, roles: payload.roles ?? [] };

      const store = requestContext.getStore();
      if (store) store.userId = payload.sub;

      return true;
    } catch {
      // Token inválido em rota opcional apenas significa "visitante".
      if (isPublic || isOptional) return true;
      throw DomainErrors.sessionExpired();
    }
  }

  private extractToken(request: RequestWithUser): string | null {
    const cookies = (request as unknown as { cookies?: Record<string, string> }).cookies;
    const fromCookie = cookies?.[ACCESS_TOKEN_COOKIE];
    if (fromCookie) return fromCookie;

    const header = request.headers.authorization;
    if (header?.startsWith('Bearer ')) return header.slice('Bearer '.length).trim();

    return null;
  }
}
