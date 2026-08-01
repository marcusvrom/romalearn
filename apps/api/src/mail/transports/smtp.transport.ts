import { Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { MailMessage, MailTransport } from '../mail.types';

export interface SmtpOptions {
  host: string;
  port: number;
  secure: boolean;
  user?: string;
  password?: string;
  fromName: string;
  fromAddress: string;
}

/** SMTP real. No ambiente local aponta para o Mailpit (localhost:1025). */
export class SmtpMailTransport implements MailTransport {
  readonly name = 'smtp';
  private readonly logger = new Logger('MailSmtp');
  private readonly transporter: nodemailer.Transporter;

  constructor(private readonly options: SmtpOptions) {
    this.transporter = nodemailer.createTransport({
      host: options.host,
      port: options.port,
      secure: options.secure,
      auth: options.user ? { user: options.user, pass: options.password } : undefined,
    });
  }

  async send(message: MailMessage): Promise<void> {
    await this.transporter.sendMail({
      from: { name: this.options.fromName, address: this.options.fromAddress },
      to: message.toName ? { name: message.toName, address: message.to } : message.to,
      subject: message.subject,
      html: message.html,
      text: message.text,
    });

    // Registra apenas destinatário e assunto — nunca o corpo com links/tokens.
    this.logger.log({ message: 'e-mail enviado', to: message.to, subject: message.subject });
  }
}
