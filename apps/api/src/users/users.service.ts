import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserDto, UserRole, UserStatus } from '@romalearn/contracts';
import { Repository } from 'typeorm';
import { DomainErrors } from '../common/errors/domain-error';
import { PasswordService } from '../auth/password.service';
import { ChangePasswordDto, UpdateProfileDto } from '../auth/dto/auth.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    private readonly passwordService: PasswordService,
  ) {}

  findByEmail(email: string, withPassword = false): Promise<User | null> {
    return this.users.findOne({
      where: { email: email.trim().toLowerCase() },
      select: withPassword ? this.selectWithPassword() : undefined,
    });
  }

  async findByIdOrFail(id: string): Promise<User> {
    const user = await this.users.findOne({ where: { id } });
    if (!user) throw DomainErrors.notFound('Usuário não encontrado.');
    return user;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<User> {
    const user = await this.findByIdOrFail(userId);
    if (dto.name !== undefined) user.name = dto.name;
    if (dto.phone !== undefined) user.phone = dto.phone || null;
    return this.users.save(user);
  }

  /** Devolve o usuário atualizado; quem chama decide invalidar as sessões. */
  async changePassword(userId: string, dto: ChangePasswordDto): Promise<User> {
    const user = await this.users.findOne({
      where: { id: userId },
      select: this.selectWithPassword(),
    });
    if (!user) throw DomainErrors.notFound('Usuário não encontrado.');

    const matches = await this.passwordService.verify(user.passwordHash, dto.currentPassword);
    if (!matches) {
      throw DomainErrors.invalidCredentials();
    }

    user.passwordHash = await this.passwordService.hash(dto.newPassword);
    await this.users.save(user);
    return user;
  }

  /**
   * Anonimização prevista na LGPD: preserva os registros acadêmicos e
   * financeiros exigidos por lei, removendo os dados pessoais.
   */
  async anonymize(userId: string): Promise<User> {
    const user = await this.findByIdOrFail(userId);
    const marker = user.id.slice(0, 8);

    user.name = 'Usuário removido';
    user.email = `anonimizado+${marker}@invalido.local`;
    user.phone = null;
    user.status = UserStatus.ANONYMIZED;
    user.deletedAt = new Date();

    return this.users.save(user);
  }

  static toDto(user: User): UserDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      roles: user.roles ?? [UserRole.STUDENT],
      status: user.status,
      emailVerifiedAt: user.emailVerifiedAt?.toISOString() ?? null,
      termsAcceptedVersion: user.termsAcceptedVersion,
      termsAcceptedAt: user.termsAcceptedAt?.toISOString() ?? null,
      createdAt: user.createdAt.toISOString(),
    };
  }

  /** `passwordHash` tem `select: false`; precisa ser pedido explicitamente. */
  private selectWithPassword(): (keyof User)[] {
    return [
      'id',
      'name',
      'email',
      'passwordHash',
      'phone',
      'roles',
      'status',
      'emailVerifiedAt',
      'termsAcceptedVersion',
      'termsAcceptedAt',
      'createdAt',
      'updatedAt',
    ];
  }
}
