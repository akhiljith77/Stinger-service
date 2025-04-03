import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { Size } from '../entities/product.entity';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @Min(10, { message: 'price must not be less than 10' })
  @Type(() => Number)
  price: number;

  @IsNumber()
  @Min(1)
  stock: number;
  
  @IsArray()
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        return [];
      }
    }
    return value;
  })
  color: string[];

  @IsArray()
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        const parsedValues = JSON.parse(value);
        // Filter out invalid enum values
        return parsedValues.filter(size => Object.values(Size).includes(size));
      } catch (e) {
        return [];
      }
    }
    return value;
  })
  size: string[];

  @IsString()
  categoryId: string;

  @IsArray()
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (e) {
        return [];
      }
    }
    return value;
  })
  imageURLs?: string[];
}

export class FilterProductsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxPrice?: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  category?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number = 10;
}
