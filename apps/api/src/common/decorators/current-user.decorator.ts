import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserRole } from '@romalearn/contracts';
import { Request } from 'express';

/** Identidade resolvida a partir do access token. */
export interface AuthenticatedUser {
  id: string;
  email: string;
  roles: UserRole[];
}

export type RequestWithUser = Request & { user?: AuthenticatedUser };

export const CurrentUser = createParamDecorator(
  (data: keyof AuthenticatedUser | undefined, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    if (!user) return undefined;
    return data ? user[data] : user;
  },
);
