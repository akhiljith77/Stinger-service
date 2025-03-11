import { IsNotEmpty, IsNumber, IsString, IsUUID, Min } from 'class-validator';

export class CreateCartDto {
  @IsNotEmpty()
  @IsUUID()
  product_id: string;

  @IsNotEmpty({ message: 'Please select a color' })
  @IsString()
  color: string;

  @IsNotEmpty({ message: 'Please select a size' })
  @IsString()
  size: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantity: number;
}
