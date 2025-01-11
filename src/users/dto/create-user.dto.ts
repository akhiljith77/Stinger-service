import { IsEmail, IsNotEmpty, IsNumber, IsString, MaxLength, MinLength } from "class-validator";

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
