import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CheckoutResultDto, OrderDto, ProductDto, PublicationStatus } from '@romalearn/contracts';
import { Request } from 'express';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { EnrollmentService } from '../learning/enrollment.service';
import { CheckoutService } from './checkout.service';
import { CheckoutDto, ValidateCouponDto } from './dto/commerce.dto';
import { Product } from './entities/product.entity';
import { PricingService } from './pricing.service';
import { WebhookService } from './webhook.service';

@ApiTags('Comércio')
@Controller('commerce')
export class CommerceController {
  constructor(
    private readonly checkoutService: CheckoutService,
    private readonly pricingService: PricingService,
    private readonly enrollmentService: EnrollmentService,
    private readonly webhookService: WebhookService,
    @InjectRepository(Product) private readonly products: Repository<Product>,
  ) {}

  @Public()
  @Get('products')
  @ApiOperation({ summary: 'Produtos publicados com suas ofertas ativas.' })
  async listProducts(): Promise<ProductDto[]> {
    const products = await this.products.find({
      where: { status: PublicationStatus.PUBLISHED },
      relations: { offers: true },
    });

    return products.map((product) => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      description: product.description,
      type: product.type,
      status: product.status,
      courseId: product.courseId,
      programId: product.programId,
      offers: (product.offers ?? [])
        .filter((offer) => offer.isAvailable())
        .map((offer) => ({
          id: offer.id,
          productId: offer.productId,
          name: offer.name,
          kind: offer.kind,
          status: offer.status,
          environment: offer.environment,
          priceCents: offer.priceCents,
          currency: offer.currency,
          compareAtPriceCents: offer.compareAtPriceCents,
          installmentsAllowed: offer.installmentsAllowed,
          accessDurationDays: offer.accessDurationDays,
          availableFrom: offer.availableFrom?.toISOString() ?? null,
          availableUntil: offer.availableUntil?.toISOString() ?? null,
        })),
    }));
  }

  @Post('enroll-free')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Matrícula gratuita: cria a permissão sem pagamento.' })
  async enrollFree(
    @CurrentUser('id') userId: string,
    @Body() body: { courseSlug: string },
  ): Promise<{ enrollmentId: string; courseSlug: string }> {
    const enrollment = await this.enrollmentService.enrollFree(userId, body.courseSlug);
    return { enrollmentId: enrollment.id, courseSlug: body.courseSlug };
  }

  @Post('checkout')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Cria o pedido e inicia o pagamento da oferta.' })
  checkout(
    @CurrentUser('id') userId: string,
    @Body() dto: CheckoutDto,
  ): Promise<CheckoutResultDto> {
    return this.checkoutService.checkout(userId, dto);
  }

  @Post('coupons/validate')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Confere um cupom e devolve o valor com desconto.' })
  async validateCoupon(@Body() dto: ValidateCouponDto) {
    const offer = await this.pricingService.findOfferOrFail(dto.offerId);
    const price = await this.pricingService.priceFor(offer, dto.code);

    return {
      valid: true,
      code: dto.code,
      subtotalCents: price.subtotalCents,
      discountCents: price.discountCents,
      totalCents: price.totalCents,
      currency: price.currency,
    };
  }

  @Get('orders')
  @ApiOperation({ summary: 'Histórico de compras do aluno.' })
  listOrders(@CurrentUser('id') userId: string): Promise<OrderDto[]> {
    return this.checkoutService.listOrders(userId);
  }

  /**
   * Webhook do provedor de pagamento.
   *
   * Público por natureza (quem chama é o provedor), mas a autenticidade é
   * garantida pela assinatura verificada dentro do serviço.
   */
  @Public()
  @Post('webhooks/:gateway')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Recebe notificações do provedor de pagamento.' })
  webhook(@Param('gateway') gateway: string, @Req() request: Request) {
    return this.webhookService.handle(gateway, {
      headers: request.headers as Record<string, string | string[] | undefined>,
      rawBody:
        (request as Request & { rawBody?: Buffer }).rawBody?.toString('utf8') ??
        JSON.stringify(request.body ?? {}),
      body: (request.body ?? {}) as Record<string, unknown>,
      query: request.query as Record<string, unknown>,
    });
  }
}
