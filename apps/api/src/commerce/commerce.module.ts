import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppConfig } from '../config/configuration';
import { LearningModule } from '../learning/learning.module';
import { User } from '../users/entities/user.entity';
import { CheckoutService } from './checkout.service';
import { CommerceController } from './commerce.controller';
import { Coupon } from './entities/coupon.entity';
import { Offer } from './entities/offer.entity';
import { Order } from './entities/order.entity';
import { Payment } from './entities/payment.entity';
import { Product } from './entities/product.entity';
import { WebhookEvent } from './entities/webhook-event.entity';
import { FakePaymentGateway } from './gateways/fake.gateway';
import { MercadoPagoGateway } from './gateways/mercadopago.gateway';
import { PAYMENT_GATEWAY, PaymentGateway } from './gateways/payment-gateway.types';
import { PricingService } from './pricing.service';
import { WebhookService } from './webhook.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Offer, Coupon, Order, Payment, WebhookEvent, User]),
    LearningModule,
  ],
  controllers: [CommerceController],
  providers: [
    {
      provide: PAYMENT_GATEWAY,
      inject: [ConfigService],
      useFactory: (configService: ConfigService<AppConfig, true>): PaymentGateway => {
        const payment = configService.get('payment', { infer: true });

        if (payment.gateway === 'mercadopago') {
          return new MercadoPagoGateway({
            accessToken: payment.mercadopago.accessToken,
            webhookSecret: payment.mercadopago.webhookSecret,
          });
        }

        // Padrão de desenvolvimento: fluxo completo, sem cobrança real.
        return new FakePaymentGateway(payment.fakeWebhookSecret);
      },
    },
    PricingService,
    CheckoutService,
    WebhookService,
  ],
  exports: [CheckoutService, PricingService, WebhookService, PAYMENT_GATEWAY, TypeOrmModule],
})
export class CommerceModule {}
