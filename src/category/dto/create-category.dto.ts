import { IsOptional, IsString } from 'class-validator';
import { CategoryType } from '../entities/category.entity';

export class CreateCategoryDto {
  @IsString()
  name: CategoryType;

  @IsOptional()
  @IsString()
  description: string;
}
