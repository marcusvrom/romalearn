import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WEB_ROUTES } from '@romalearn/contracts';
import { AppConfig } from '../config/configuration';
import { MAIL_TRANSPORT, MailTransport } from './mail.types';
import { TemplateBrand, renderLayout } from './templates/layout';

function formatCurrency(cents: number, currency: string): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(cents / 100);
}

/**
 * E-mails transacionais em português.
 *
 * Falhas de envio nunca derrubam o fluxo do usuário: são registradas e
 * seguem adiante (uma matrícula não deve falhar porque o SMTP caiu).
 */
@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(
    @Inject(MAIL_TRANSPORT) private readonly transport: MailTransport,
    private readonly configService: ConfigService<AppConfig, true>,
  ) {}

  private get brand(): TemplateBrand {
    const platform = this.configService.get('platform', { infer: true });
    const app = this.configService.get('app', { infer: true });
    return {
      platformName: platform.name,
      supportEmail: platform.supportEmail,
      webUrl: app.webPublicUrl,
    };
  }

  private webUrl(path: string): string {
    return `${this.brand.webUrl.replace(/\/$/, '')}${path}`;
  }

  private async deliver(
    to: string,
    toName: string,
    subject: string,
    body: Parameters<typeof renderLayout>[1],
  ): Promise<void> {
    try {
      const { html, text } = renderLayout(this.brand, body);
      await this.transport.send({ to, toName, subject, html, text });
    } catch (error) {
      this.logger.error({
        message: 'falha ao enviar e-mail',
        subject,
        transport: this.transport.name,
        detail: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // ------------------------------------------------------------------
  // Conta
  // ------------------------------------------------------------------

  emailVerification(user: { name: string; email: string }, token: string) {
    const url = this.webUrl(`${WEB_ROUTES.verifyEmail}?token=${encodeURIComponent(token)}`);
    return this.deliver(user.email, user.name, 'Confirme seu e-mail', {
      title: 'Confirme seu e-mail',
      intro: `Olá, ${user.name}! Falta pouco para você começar a estudar.`,
      paragraphs: ['Clique no botão abaixo para confirmar que este e-mail é seu.'],
      action: { label: 'Confirmar meu e-mail', url },
      note: 'O link vale por 1 hora. Se você não criou esta conta, pode ignorar este e-mail.',
    });
  }

  passwordReset(user: { name: string; email: string }, token: string) {
    const url = this.webUrl(`${WEB_ROUTES.resetPassword}?token=${encodeURIComponent(token)}`);
    return this.deliver(user.email, user.name, 'Redefinição de senha', {
      title: 'Vamos criar uma nova senha',
      intro: `Olá, ${user.name}. Recebemos um pedido para redefinir a senha da sua conta.`,
      action: { label: 'Criar nova senha', url },
      note: 'O link vale por 1 hora. Se não foi você quem pediu, ignore este e-mail: sua senha continua a mesma.',
    });
  }

  // ------------------------------------------------------------------
  // Aprendizagem
  // ------------------------------------------------------------------

  freeEnrollment(user: { name: string; email: string }, courseTitle: string, courseSlug: string) {
    return this.deliver(user.email, user.name, `Matrícula confirmada: ${courseTitle}`, {
      title: 'Sua matrícula está confirmada',
      intro: `Olá, ${user.name}! Você já pode estudar o módulo ${courseTitle}.`,
      paragraphs: [
        'O acesso é imediato e você pode voltar quando quiser — seu progresso fica salvo.',
      ],
      action: { label: 'Começar agora', url: this.webUrl(WEB_ROUTES.player(courseSlug)) },
    });
  }

  courseWelcome(user: { name: string; email: string }, courseTitle: string, courseSlug: string) {
    return this.deliver(user.email, user.name, `Boas-vindas ao curso ${courseTitle}`, {
      title: `Boas-vindas ao ${courseTitle}`,
      intro: `Olá, ${user.name}! Seu acesso está liberado.`,
      paragraphs: [
        'Sugestão: estude um capítulo por vez e faça a atividade antes de avançar.',
        'Não precisa acertar de primeira. O objetivo é praticar com calma.',
      ],
      action: { label: 'Ir para o curso', url: this.webUrl(WEB_ROUTES.player(courseSlug)) },
    });
  }

  courseCompleted(user: { name: string; email: string }, courseTitle: string) {
    return this.deliver(user.email, user.name, `Parabéns! Você concluiu ${courseTitle}`, {
      title: 'Curso concluído',
      intro: `Parabéns, ${user.name}! Você concluiu o curso ${courseTitle}.`,
      paragraphs: ['Seu certificado está sendo preparado e aparecerá na sua área de aluno.'],
      action: { label: 'Ver meus cursos', url: this.webUrl(WEB_ROUTES.dashboard) },
    });
  }

  certificateAvailable(
    user: { name: string; email: string },
    subjectTitle: string,
    verificationCode: string,
  ) {
    return this.deliver(user.email, user.name, 'Seu certificado está disponível', {
      title: 'Certificado disponível',
      intro: `Olá, ${user.name}! O certificado de ${subjectTitle} já pode ser baixado.`,
      paragraphs: [
        `Código de validação: ${verificationCode}. Qualquer pessoa pode conferir a autenticidade na página pública de validação.`,
      ],
      action: { label: 'Baixar certificado', url: this.webUrl(WEB_ROUTES.certificates) },
    });
  }

  // ------------------------------------------------------------------
  // Comércio
  // ------------------------------------------------------------------

  paymentApproved(
    user: { name: string; email: string },
    data: { productName: string; totalCents: number; currency: string; reference: string },
  ) {
    return this.deliver(user.email, user.name, 'Pagamento aprovado', {
      title: 'Pagamento aprovado',
      intro: `Olá, ${user.name}! Recebemos a confirmação do seu pagamento e seu acesso já está liberado.`,
      paragraphs: [
        `Produto: ${data.productName}`,
        `Valor: ${formatCurrency(data.totalCents, data.currency)}`,
        `Pedido: ${data.reference}`,
      ],
      action: { label: 'Acessar meus cursos', url: this.webUrl(WEB_ROUTES.dashboard) },
    });
  }

  paymentFailed(
    user: { name: string; email: string },
    data: { productName: string; reference: string; reason: 'REJECTED' | 'EXPIRED' | 'CANCELLED' },
  ) {
    const explanation = {
      REJECTED: 'O pagamento não foi aprovado pela operadora.',
      EXPIRED: 'O prazo para pagamento terminou.',
      CANCELLED: 'O pedido foi cancelado.',
    }[data.reason];

    return this.deliver(user.email, user.name, 'Não conseguimos concluir seu pedido', {
      title: 'Pedido não concluído',
      intro: `Olá, ${user.name}. ${explanation}`,
      paragraphs: [
        `Produto: ${data.productName}`,
        `Pedido: ${data.reference}`,
        'Você pode tentar novamente quando quiser. Nenhum valor foi cobrado.',
      ],
      action: { label: 'Tentar novamente', url: this.webUrl(WEB_ROUTES.catalog) },
      note: 'Se precisar de ajuda, fale com o nosso suporte.',
    });
  }
}
