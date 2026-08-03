import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '@romalearn/contracts';
import { createHash, randomBytes, randomUUID } from 'node:crypto';
import { DataSource, LessThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AppConfig } from '../config/configuration';
import { DomainErrors } from '../common/errors/domain-error';
import { User } from '../users/entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { VerificationToken, VerificationTokenType } from './entities/verification-token.entity';

export interface IssuedSession {
  accessToken: string;
  refreshToken: string;
  accessExpiresInSeconds: number;
  refreshExpiresInSeconds: number;
}

/** SHA-256 hex — tokens só existem em claro no e-mail/cookie do usuário. */
function hashToken(token: string): string {
  return createHash('sha256').update(token).digest('hex');
}

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AppConfig, true>,
    private readonly dataSource: DataSource,
    @InjectRepository(RefreshToken)
    private readonly refreshTokens: Repository<RefreshToken>,
    @InjectRepository(VerificationToken)
    private readonly verificationTokens: Repository<VerificationToken>,
  ) {}

  private get auth() {
    return this.configService.get('auth', { infer: true });
  }

  /** Emite um par de tokens iniciando uma nova família de refresh. */
  async issueSession(
    user: User,
    context: { userAgent?: string; ip?: string },
  ): Promise<IssuedSession> {
    return this.issueForFamily(user, randomUUID(), context);
  }

  /**
   * Rotaciona o refresh token.
   *
   * Se o token apresentado já tiver sido usado (ou estiver revogado), toda a
   * família é invalidada: é o comportamento esperado diante de reuso indevido.
   */
  async rotate(
    refreshToken: string,
    context: { userAgent?: string; ip?: string },
  ): Promise<{ session: IssuedSession; user: User }> {
    const tokenHash = hashToken(refreshToken);
    const stored = await this.refreshTokens.findOne({
      where: { tokenHash },
      relations: { user: true },
    });

    if (!stored) throw DomainErrors.sessionExpired();

    if (stored.revokedAt || stored.expiresAt.getTime() <= Date.now()) {
      await this.revokeFamily(stored.familyId, 'reuse_detected');
      throw DomainErrors.sessionExpired();
    }

    stored.revokedAt = new Date();
    stored.revokedReason = 'rotated';
    await this.refreshTokens.save(stored);

    const session = await this.issueForFamily(stored.user, stored.familyId, context);
    return { session, user: stored.user };
  }

  async revokeByToken(refreshToken: string): Promise<void> {
    const tokenHash = hashToken(refreshToken);
    await this.refreshTokens.update(
      { tokenHash },
      { revokedAt: new Date(), revokedReason: 'logout' },
    );
  }

  async revokeFamily(familyId: string, reason: string): Promise<void> {
    // Query builder explícito: um `undefined` no critério seria descartado
    // pelo TypeORM e a condição "ainda não revogado" se perderia.
    await this.dataSource
      .createQueryBuilder()
      .update(RefreshToken)
      .set({ revokedAt: new Date(), revokedReason: reason })
      .where('"familyId" = :familyId AND "revokedAt" IS NULL', { familyId })
      .execute();
  }

  /** Invalida todas as sessões — usado ao trocar/redefinir a senha. */
  async revokeAllForUser(userId: string, reason: string): Promise<void> {
    await this.dataSource
      .createQueryBuilder()
      .update(RefreshToken)
      .set({ revokedAt: new Date(), revokedReason: reason })
      .where('"userId" = :userId AND "revokedAt" IS NULL', { userId })
      .execute();
  }

  // ------------------------------------------------------------------
  // Tokens de e-mail (confirmação de cadastro e redefinição de senha)
  // ------------------------------------------------------------------

  /** Devolve o token em claro (enviado por e-mail); só o hash é persistido. */
  async createVerificationToken(user: User, type: VerificationTokenType): Promise<string> {
    // Um token ativo por vez e por tipo: pedir um novo invalida o anterior.
    await this.dataSource
      .createQueryBuilder()
      .update(VerificationToken)
      .set({ usedAt: new Date() })
      .where('"userId" = :userId AND type = :type AND "usedAt" IS NULL', {
        userId: user.id,
        type,
      })
      .execute();

    const token = randomBytes(32).toString('base64url');
    const ttlMinutes = this.auth.emailTokenTtlMinutes;

    await this.verificationTokens.save(
      this.verificationTokens.create({
        userId: user.id,
        type,
        tokenHash: hashToken(token),
        expiresAt: new Date(Date.now() + ttlMinutes * 60_000),
      }),
    );

    return token;
  }

  async consumeVerificationToken(
    token: string,
    type: VerificationTokenType,
  ): Promise<VerificationToken> {
    const stored = await this.verificationTokens.findOne({
      where: { tokenHash: hashToken(token), type },
      relations: { user: true },
    });

    if (!stored || stored.usedAt || stored.expiresAt.getTime() <= Date.now()) {
      throw DomainErrors.invalidToken();
    }

    stored.usedAt = new Date();
    await this.verificationTokens.save(stored);
    return stored;
  }

  /** Remove tokens expirados; pode ser chamado por rotina de manutenção. */
  async purgeExpired(): Promise<void> {
    const now = new Date();
    await this.verificationTokens.delete({ expiresAt: LessThan(now) });
    await this.refreshTokens.delete({ expiresAt: LessThan(now) });
  }

  private async issueForFamily(
    user: User,
    familyId: string,
    context: { userAgent?: string; ip?: string },
  ): Promise<IssuedSession> {
    const { accessSecret, refreshSecret, accessTtlSeconds, refreshTtlSeconds } = this.auth;

    const accessToken = await this.jwtService.signAsync(
      { sub: user.id, email: user.email, roles: user.roles ?? [UserRole.STUDENT] },
      { secret: accessSecret, expiresIn: accessTtlSeconds },
    );

    // O refresh token é opaco (não carrega dados) e vive apenas no banco.
    const refreshToken = randomBytes(48).toString('base64url');
    await this.refreshTokens.save(
      this.refreshTokens.create({
        userId: user.id,
        tokenHash: hashToken(refreshToken),
        familyId,
        expiresAt: new Date(Date.now() + refreshTtlSeconds * 1000),
        userAgent: context.userAgent?.slice(0, 255) ?? null,
        ipAddress: context.ip?.slice(0, 64) ?? null,
      }),
    );

    void refreshSecret; // Reservado caso o refresh passe a ser um JWT assinado.

    return {
      accessToken,
      refreshToken,
      accessExpiresInSeconds: accessTtlSeconds,
      refreshExpiresInSeconds: refreshTtlSeconds,
    };
  }
}
