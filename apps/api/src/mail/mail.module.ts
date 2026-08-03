import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from '../config/configuration';
import { MailService } from './mail.service';
import { MAIL_TRANSPORT, MailTransport } from './mail.types';
import { ConsoleMailTransport } from './transports/console.transport';
import { SmtpMailTransport } from './transports/smtp.transport';

@Global()
@Module({
  providers: [
    {
      provide: MAIL_TRANSPORT,
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig, true>): MailTransport => {
        const mail = configService.get('mail', { infer: true });

        if (mail.driver === 'smtp') {
          return new SmtpMailTransport({
            host: mail.smtp.host,
            port: mail.smtp.port,
            secure: mail.smtp.secure,
            user: mail.smtp.user,
            password: mail.smtp.password,
            fromName: mail.fromName,
            fromAddress: mail.fromAddress,
          });
        }

        return new ConsoleMailTransport();
      },
    },
    MailService,
  ],
  exports: [MailService, MAIL_TRANSPORT],
})
export class MailModule {}
