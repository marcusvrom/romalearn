import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

/** Normaliza e-mails para minúsculas antes da validação. */
const normalizeEmail = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim().toLowerCase() : value;

const trim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);

/**
 * Política de senha: mínimo de 10 caracteres com letra e número.
 * Simples de explicar para iniciantes e suficiente contra ataques triviais.
 */
export const PASSWORD_PATTERN = /^(?=.*[A-Za-zÀ-ÿ])(?=.*\d).{10,128}$/;
export const PASSWORD_MESSAGE =
  'A senha deve ter pelo menos 10 caracteres, incluindo letras e números.';

export class RegisterDto {
  @ApiProperty({ example: 'Maria Souza' })
  @Transform(trim)
  @IsString()
  @MinLength(2, { message: 'Informe seu nome completo.' })
  @MaxLength(160)
  name: string;

  @ApiProperty({ example: 'maria@exemplo.com' })
  @Transform(normalizeEmail)
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  @MaxLength(254)
  email: string;

  @ApiProperty({ example: 'minhasenha2026' })
  @IsString()
  @Matches(PASSWORD_PATTERN, { message: PASSWORD_MESSAGE })
  password: string;

  @ApiPropertyOptional({ example: '+55 11 90000-0000' })
  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(32)
  phone?: string;

  @ApiProperty({ description: 'Aceite dos Termos de Uso e da Política de Privacidade.' })
  @IsBoolean()
  acceptedTerms: boolean;
}

export class LoginDto {
  @ApiProperty({ example: 'maria@exemplo.com' })
  @Transform(normalizeEmail)
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Informe sua senha.' })
  password: string;
}

export class ForgotPasswordDto {
  @ApiProperty()
  @Transform(normalizeEmail)
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  email: string;
}

export class ResetPasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;

  @ApiProperty()
  @IsString()
  @Matches(PASSWORD_PATTERN, { message: PASSWORD_MESSAGE })
  password: string;
}

export class VerifyEmailDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class ResendVerificationDto {
  @ApiProperty()
  @Transform(normalizeEmail)
  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  email: string;
}

export class UpdateProfileDto {
  @ApiPropertyOptional()
  @IsOptional()
  @Transform(trim)
  @IsString()
  @MinLength(2)
  @MaxLength(160)
  name?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(trim)
  @IsString()
  @MaxLength(32)
  phone?: string;
}

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty()
  @IsString()
  @Matches(PASSWORD_PATTERN, { message: PASSWORD_MESSAGE })
  newPassword: string;
}
