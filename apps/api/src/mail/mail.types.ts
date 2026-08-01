/** Contrato do provedor de e-mail. Trocar de provedor = trocar o adapter. */
export interface MailMessage {
  to: string;
  toName?: string;
  subject: string;
  html: string;
  text: string;
}

export interface MailTransport {
  readonly name: string;
  send(message: MailMessage): Promise<void>;
}

export const MAIL_TRANSPORT = Symbol('MAIL_TRANSPORT');
