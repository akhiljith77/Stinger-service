import { IsEmail, IsNotEmpty, IsNumber, IsOptional, isString, IsString, MaxLength, MinLength } from "class-validator";
import { EphemeralKeyInfo } from "tls";

export class CreateUserDto {

    @IsString()
    name:string

    @IsEmail()
    @IsNotEmpty()
    email:string

    @IsString()
    @MinLength(8)
    password:string


}
export class LoginUserDto{

    @IsEmail()
    email:string

    @IsString()
    password:string
}
export class UpdateUserDto{

    
    @IsEmail()
    @IsOptional()
    email:string
     
    @IsString()
    @IsOptional()
    name:string

    @IsNumber()
    @IsOptional()
    number:number

    
}

