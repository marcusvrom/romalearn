import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@romalearn/contracts';

export const ROLES_KEY = 'romalearn:roles';

/** Exige que o usuário possua ao menos um dos papéis informados. */
export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);
