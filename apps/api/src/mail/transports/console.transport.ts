import { Logger } from '@nestjs/common';
import { MailMessage, MailTransport } from '../mail.types';

/**
 * Transporte de desenvolvimento: nada é enviado de verdade.
 *
 * O log deixa isso explícito — nenhum e-mail sai da máquina com este driver.
 */
export class ConsoleMailTransport implements MailTransport {
  readonly name = 'console';
  private readonly logger = new Logger('MailConsole');

  /** Guarda as últimas mensagens para inspeção em testes. */
  readonly sent: MailMessage[] = [];

  async send(message: MailMessage): Promise<void> {
    this.sent.push(message);
    if (this.sent.length > 100) this.sent.shift();

    this.logger.log({
      message: 'E-MAIL NÃO ENVIADO (driver console) — conteúdo abaixo',
      to: message.to,
      subject: message.subject,
      text: message.text,
    });
  }
}
