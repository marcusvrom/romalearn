import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditAction, UserRole, UserStatus } from '@romalearn/contracts';
import { Repository } from 'typeorm';
import { AppConfig } from '../config/configuration';
import { DomainErrors } from '../common/errors/domain-error';
import { MailService } from '../mail/mail.service';
import { AuditService } from '../platform/audit.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto } from './dto/auth.dto';
import { VerificationTokenType } from './entities/verification-token.entity';
import { PasswordService } from './password.service';
import { IssuedSession, TokenService } from './token.service';

export interface RequestMeta {
  userAgent?: string;
  ip?: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
    private readonly auditService: AuditService,
    private readonly configService: ConfigService<AppConfig, true>,
  ) {}

  async register(
    dto: RegisterDto,
    meta: RequestMeta,
  ): Promise<{ user: User; session: IssuedSession }> {
    if (!dto.acceptedTerms) {
      throw DomainErrors.forbidden(
        'É necessário aceitar os Termos de Uso e a Política de Privacidade.',
      );
    }

    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw DomainErrors.emailAlreadyRegistered();

    const legal = this.configService.get('legal', { infer: true });
    const now = new Date();

    const user = await this.users.save(
      this.users.create({
        name: dto.name,
        email: dto.email.trim().toLowerCase(),
        passwordHash: await this.passwordService.hash(dto.password),
        phone: dto.phone ?? null,
        roles: [UserRole.STUDENT],
        status: UserStatus.PENDING_VERIFICATION,
        termsAcceptedVersion: legal.termsVersion,
        termsAcceptedAt: now,
        privacyAcceptedVersion: legal.privacyVersion,
        privacyAcceptedAt: now,
      }),
    );

    const token = await this.tokenService.createVerificationToken(
      user,
      VerificationTokenType.EMAIL_VERIFICATION,
    );
    await this.mailService.emailVerification(user, token);

    await this.auditService.record({
      actorId: user.id,
      actorEmail: user.email,
      action: AuditAction.CREATE,
      entityType: 'User',
      entityId: user.id,
      summary: 'Conta criada pelo próprio usuário.',
      metadata: { termsVersion: legal.termsVersion, privacyVersion: legal.privacyVersion },
      ipAddress: meta.ip,
      userAgent: meta.userAgent,
    });

    // O aluno já entra logado: a confirmação de e-mail é exigida apenas
    // para liberar acesso a conteúdo, não para navegar.
    const session = await this.tokenService.issueSession(user, meta);
    return { user, session };
  }

  async login(dto: LoginDto, meta: RequestMeta): Promise<{ user: User; session: IssuedSession }> {
    const user = await this.usersService.findByEmail(dto.email, true);

    // Verifica a senha mesmo sem usuário para não vazar quais e-mails existem.
    const passwordMatches = user
      ? await this.passwordService.verify(user.passwordHash, dto.password)
      : await this.passwordService.verify(DUMMY_HASH, dto.password);

    if (!user || !passwordMatches) throw DomainErrors.invalidCredentials();
    if (user.status === UserStatus.SUSPENDED || user.status === UserStatus.ANONYMIZED) {
      throw DomainErrors.accountSuspended();
    }

    user.lastLoginAt = new Date();
    await this.users.update({ id: user.id }, { lastLoginAt: user.lastLoginAt });

    const session = await this.tokenService.issueSession(user, meta);
    return { user, session };
  }

  async refresh(refreshToken: string, meta: RequestMeta) {
    return this.tokenService.rotate(refreshToken, meta);
  }

  async logout(refreshToken?: string): Promise<void> {
    if (refreshToken) await this.tokenService.revokeByToken(refreshToken);
  }

  async verifyEmail(token: string): Promise<User> {
    const stored = await this.tokenService.consumeVerificationToken(
      token,
      VerificationTokenType.EMAIL_VERIFICATION,
    );

    const user = stored.user;
    if (!user.emailVerifiedAt) {
      user.emailVerifiedAt = new Date();
      if (user.status === UserStatus.PENDING_VERIFICATION) user.status = UserStatus.ACTIVE;
      await this.users.save(user);
    }

    return user;
  }

  /** Silencioso por design: não revela se o e-mail existe na base. */
  async resendVerification(email: string): Promise<void> {
    const user = await this.usersService.findByEmail(email);
    if (!user || user.emailVerifiedAt) return;

    const token = await this.tokenService.createVerificationToken(
      user,
      VerificationTokenType.EMAIL_VERIFICATION,
    );
    await this.mailService.emailVerification(user, token);
  }

  /** Também silencioso: a resposta é idêntica exista ou não a conta. */
  async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user || user.status === UserStatus.ANONYMIZED) {
      this.logger.log({ message: 'pedido de recuperação para e-mail sem conta ativa' });
      return;
    }

    const token = await this.tokenService.createVerificationToken(
      user,
      VerificationTokenType.PASSWORD_RESET,
    );
    await this.mailService.passwordReset(user, token);
  }

  async resetPassword(dto: ResetPasswordDto, meta: RequestMeta): Promise<User> {
    const stored = await this.tokenService.consumeVerificationToken(
      dto.token,
      VerificationTokenType.PASSWORD_RESET,
    );

    const user = stored.user;
    user.passwordHash = await this.passwordService.hash(dto.password);

    // Quem redefine a senha comprovou acesso ao e-mail: aproveita para confirmar.
    if (!user.emailVerifiedAt) {
      user.emailVerifiedAt = new Date();
      if (user.status === UserStatus.PENDING_VERIFICATION) user.status = UserStatus.ACTIVE;
    }
    await this.users.save(user);

    // Redefinir senha encerra todas as sessões abertas.
    await this.tokenService.revokeAllForUser(user.id, 'password_reset');

    await this.auditService.record({
      actorId: user.id,
      actorEmail: user.email,
      action: AuditAction.UPDATE,
      entityType: 'User',
      entityId: user.id,
      summary: 'Senha redefinida por link de recuperação.',
      ipAddress: meta.ip,
      userAgent: meta.userAgent,
    });

    return user;
  }
}

/**
 * Hash descartável usado quando o e-mail não existe, para que login com
 * e-mail inexistente custe o mesmo tempo de um login com senha errada.
 */
const DUMMY_HASH =
  '$argon2id$v=19$m=19456,t=2,p=1$c29tZS1yYW5kb20tc2FsdA$JmFYqPnZQKPBpF0MPCUHVGxCK1oKCEGJRXWEXbCCRRs';
