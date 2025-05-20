import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}
export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
export class UpdateUserDto {
  @IsEmail()
  @IsOptional()
  email: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsNumber()
  @IsOptional()
  number: number;
}
export class ForgetPassword {
  @IsEmail()
  email: string;
}
export class ResetPassword {
  @IsString()
  password: string;
}
