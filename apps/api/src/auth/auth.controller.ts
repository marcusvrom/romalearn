import { Body, Controller, Get, HttpCode, HttpStatus, Patch, Post, Req, Res } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Throttle } from '@nestjs/throttler';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthSessionDto, UserDto } from '@romalearn/contracts';
import { Request, Response } from 'express';
import { AppConfig, authThrottleOptions } from '../config/configuration';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { DomainErrors } from '../common/errors/domain-error';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { ACCESS_TOKEN_COOKIE, REFRESH_COOKIE_PATH, REFRESH_TOKEN_COOKIE } from './auth.constants';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResendVerificationDto,
  ResetPasswordDto,
  UpdateProfileDto,
  VerifyEmailDto,
} from './dto/auth.dto';
import { IssuedSession, TokenService } from './token.service';

/** Limite estrito nas rotas de credenciais, para conter força bruta. */
const AUTH_THROTTLE = authThrottleOptions();

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly configService: ConfigService<AppConfig, true>,
  ) {}

  @Public()
  @Throttle(AUTH_THROTTLE)
  @Post('register')
  @ApiOperation({ summary: 'Cria uma conta de aluno e inicia a sessão.' })
  async register(
    @Body() dto: RegisterDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthSessionDto> {
    const { user, session } = await this.authService.register(dto, this.meta(request));
    this.setSessionCookies(response, session);
    return this.sessionPayload(UsersService.toDto(user), session);
  }

  @Public()
  @Throttle(AUTH_THROTTLE)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Autentica e devolve cookies de sessão.' })
  async login(
    @Body() dto: LoginDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthSessionDto> {
    const { user, session } = await this.authService.login(dto, this.meta(request));
    this.setSessionCookies(response, session);
    return this.sessionPayload(UsersService.toDto(user), session);
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Rotaciona o refresh token e renova a sessão.' })
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Body() body: { refreshToken?: string },
  ): Promise<AuthSessionDto> {
    const token = this.readRefreshToken(request, body);
    if (!token) throw DomainErrors.sessionExpired();

    const { session, user } = await this.authService.refresh(token, this.meta(request));
    this.setSessionCookies(response, session);
    return this.sessionPayload(UsersService.toDto(user), session);
  }

  @Public()
  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Encerra a sessão e limpa os cookies.' })
  async logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
    @Body() body: { refreshToken?: string },
  ): Promise<void> {
    await this.authService.logout(this.readRefreshToken(request, body) ?? undefined);
    this.clearSessionCookies(response);
  }

  @Get('me')
  @ApiOperation({ summary: 'Dados da conta autenticada.' })
  async me(@CurrentUser('id') userId: string): Promise<UserDto> {
    const user = await this.usersService.findByIdOrFail(userId);
    return UsersService.toDto(user);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Atualiza nome e telefone do próprio perfil.' })
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() dto: UpdateProfileDto,
  ): Promise<UserDto> {
    const user = await this.usersService.updateProfile(userId, dto);
    return UsersService.toDto(user);
  }

  @Post('me/password')
  @Throttle(AUTH_THROTTLE)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Altera a senha e encerra as demais sessões.' })
  async changePassword(
    @CurrentUser('id') userId: string,
    @Body() dto: ChangePasswordDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    await this.usersService.changePassword(userId, dto);
    await this.tokenService.revokeAllForUser(userId, 'password_changed');
    this.clearSessionCookies(response);
  }

  @Public()
  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confirma o e-mail a partir do token recebido.' })
  async verifyEmail(@Body() dto: VerifyEmailDto): Promise<UserDto> {
    const user = await this.authService.verifyEmail(dto.token);
    return UsersService.toDto(user);
  }

  @Public()
  @Throttle(AUTH_THROTTLE)
  @Post('resend-verification')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Reenvia o e-mail de confirmação.' })
  async resendVerification(@Body() dto: ResendVerificationDto): Promise<{ message: string }> {
    await this.authService.resendVerification(dto.email);
    return { message: 'Se existir uma conta com este e-mail, enviaremos um novo link.' };
  }

  @Public()
  @Throttle(AUTH_THROTTLE)
  @Post('forgot-password')
  @HttpCode(HttpStatus.ACCEPTED)
  @ApiOperation({ summary: 'Envia o link de redefinição de senha.' })
  async forgotPassword(@Body() dto: ForgotPasswordDto): Promise<{ message: string }> {
    await this.authService.forgotPassword(dto);
    return {
      message: 'Se existir uma conta com este e-mail, você receberá as instruções em instantes.',
    };
  }

  @Public()
  @Throttle(AUTH_THROTTLE)
  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Redefine a senha com o token recebido por e-mail.' })
  async resetPassword(
    @Body() dto: ResetPasswordDto,
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ message: string }> {
    await this.authService.resetPassword(dto, this.meta(request));
    this.clearSessionCookies(response);
    return { message: 'Senha alterada com sucesso. Entre com a nova senha.' };
  }

  // ------------------------------------------------------------------
  // Cookies de sessão
  // ------------------------------------------------------------------

  private setSessionCookies(response: Response, session: IssuedSession): void {
    const auth = this.configService.get('auth', { infer: true });
    const base = {
      httpOnly: true,
      secure: auth.cookieSecure,
      sameSite: auth.cookieSameSite,
      domain: auth.cookieDomain,
    } as const;

    response.cookie(ACCESS_TOKEN_COOKIE, session.accessToken, {
      ...base,
      path: '/',
      maxAge: session.accessExpiresInSeconds * 1000,
    });

    // O refresh só trafega na rota de autenticação, reduzindo a exposição.
    response.cookie(REFRESH_TOKEN_COOKIE, session.refreshToken, {
      ...base,
      path: REFRESH_COOKIE_PATH,
      maxAge: session.refreshExpiresInSeconds * 1000,
    });
  }

  private clearSessionCookies(response: Response): void {
    const auth = this.configService.get('auth', { infer: true });
    const base = {
      httpOnly: true,
      secure: auth.cookieSecure,
      sameSite: auth.cookieSameSite,
      domain: auth.cookieDomain,
    } as const;

    response.clearCookie(ACCESS_TOKEN_COOKIE, { ...base, path: '/' });
    response.clearCookie(REFRESH_TOKEN_COOKIE, { ...base, path: REFRESH_COOKIE_PATH });
  }

  private readRefreshToken(request: Request, body?: { refreshToken?: string }): string | null {
    const cookies = (request as unknown as { cookies?: Record<string, string> }).cookies;
    return cookies?.[REFRESH_TOKEN_COOKIE] ?? body?.refreshToken ?? null;
  }

  /**
   * Fora de produção também devolvemos os tokens no corpo, o que permite
   * exercitar a API por ferramentas sem suporte a cookies.
   */
  private sessionPayload(user: UserDto, session: IssuedSession): AuthSessionDto {
    const isProduction = this.configService.get('isProduction', { infer: true });
    if (isProduction) return { user };

    return {
      user,
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
      expiresIn: session.accessExpiresInSeconds,
    };
  }

  private meta(request: Request) {
    return { userAgent: request.headers['user-agent'], ip: request.ip };
  }
}
