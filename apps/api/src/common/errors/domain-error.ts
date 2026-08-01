import { HttpStatus } from '@nestjs/common';

/**
 * Erro de regra de negócio com código estável e mensagem pronta para o aluno.
 * O front-end reage ao `code`; a `message` já está em português.
 */
export class DomainError extends Error {
  constructor(
    readonly code: string,
    message: string,
    readonly status: number = HttpStatus.BAD_REQUEST,
  ) {
    super(message);
    this.name = 'DomainError';
  }
}

export const DomainErrors = {
  emailAlreadyRegistered: () =>
    new DomainError(
      'EMAIL_ALREADY_REGISTERED',
      'Já existe uma conta com este e-mail. Tente entrar ou recuperar a senha.',
      HttpStatus.CONFLICT,
    ),
  invalidCredentials: () =>
    new DomainError('INVALID_CREDENTIALS', 'E-mail ou senha incorretos.', HttpStatus.UNAUTHORIZED),
  accountSuspended: () =>
    new DomainError(
      'ACCOUNT_SUSPENDED',
      'Esta conta está bloqueada. Fale com o suporte.',
      HttpStatus.FORBIDDEN,
    ),
  emailNotVerified: () =>
    new DomainError(
      'EMAIL_NOT_VERIFIED',
      'Confirme seu e-mail para continuar. Enviamos um link para a sua caixa de entrada.',
      HttpStatus.FORBIDDEN,
    ),
  invalidToken: () =>
    new DomainError(
      'INVALID_TOKEN',
      'Este link é inválido ou já expirou. Solicite um novo.',
      HttpStatus.BAD_REQUEST,
    ),
  sessionExpired: () =>
    new DomainError(
      'SESSION_EXPIRED',
      'Sua sessão expirou. Entre novamente.',
      HttpStatus.UNAUTHORIZED,
    ),
  forbidden: (message = 'Você não tem permissão para esta ação.') =>
    new DomainError('FORBIDDEN', message, HttpStatus.FORBIDDEN),
  notFound: (message = 'Não encontramos o que você procura.') =>
    new DomainError('NOT_FOUND', message, HttpStatus.NOT_FOUND),
  noAccessToCourse: () =>
    new DomainError(
      'NO_COURSE_ACCESS',
      'Você ainda não tem acesso a este curso.',
      HttpStatus.FORBIDDEN,
    ),
  lessonRequirementNotMet: (message: string) =>
    new DomainError('LESSON_REQUIREMENT_NOT_MET', message, HttpStatus.BAD_REQUEST),
  courseNotCompleted: () =>
    new DomainError(
      'COURSE_NOT_COMPLETED',
      'Conclua todos os requisitos do curso para emitir o certificado.',
      HttpStatus.BAD_REQUEST,
    ),
  offerUnavailable: () =>
    new DomainError(
      'OFFER_UNAVAILABLE',
      'Esta oferta não está disponível no momento.',
      HttpStatus.BAD_REQUEST,
    ),
  alreadyOwned: () =>
    new DomainError('ALREADY_OWNED', 'Você já tem acesso a este conteúdo.', HttpStatus.CONFLICT),
  attemptsExhausted: () =>
    new DomainError(
      'ATTEMPTS_EXHAUSTED',
      'Você já usou todas as tentativas deste questionário.',
      HttpStatus.BAD_REQUEST,
    ),
  invalidCoupon: (message = 'Cupom inválido ou expirado.') =>
    new DomainError('INVALID_COUPON', message, HttpStatus.BAD_REQUEST),
  invalidWebhookSignature: () =>
    new DomainError(
      'INVALID_WEBHOOK_SIGNATURE',
      'Assinatura do webhook inválida.',
      HttpStatus.UNAUTHORIZED,
    ),
  uploadRejected: (message: string) =>
    new DomainError('UPLOAD_REJECTED', message, HttpStatus.BAD_REQUEST),
  certificateRevoked: () =>
    new DomainError(
      'CERTIFICATE_REVOKED',
      'Este certificado foi revogado e não pode ser baixado.',
      HttpStatus.FORBIDDEN,
    ),
};
