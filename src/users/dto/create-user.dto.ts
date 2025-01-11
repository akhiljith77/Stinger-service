import { IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";
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
