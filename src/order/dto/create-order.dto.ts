import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { PaymentMethod } from '../entities/order.entity';

export class OrderItemDto {
  @IsNotEmpty()
  @IsUUID()
  productId: string;

  @IsNotEmpty()
  @IsNumber()
  quantity: number;

  @IsString()
  size?: string;

  @IsString()
  color?: string;

  @IsString()
  @IsEnum(PaymentMethod, {
    message:
      'Invalid payment method. Accepted values: CARD, UPI, CASHONDELIVERY',
  })
  paymentMethod: string;
}

export class CreateOrderDto {
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
