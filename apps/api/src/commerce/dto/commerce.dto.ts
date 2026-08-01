import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentMethod } from '@romalearn/contracts';
import { Transform } from 'class-transformer';
import { IsEnum, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CheckoutDto {
  @ApiProperty({ description: 'Oferta escolhida. O preço vem sempre do backend.' })
  @IsUUID()
  offerId: string;

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.PIX })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiPropertyOptional({ example: 'BEMVINDO10' })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
  @IsString()
  @MaxLength(40)
  couponCode?: string;
}

export class ValidateCouponDto {
  @ApiProperty()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim().toUpperCase() : value))
  @IsString()
  @MaxLength(40)
  code: string;

  @ApiProperty()
  @IsUUID()
  offerId: string;
}
