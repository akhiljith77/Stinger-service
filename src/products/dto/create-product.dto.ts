import { IsNumber, IsString, Max, Min } from "class-validator"

export class CreateProductDto {

    @IsString()
    name: string

    @IsString()
    description: string

    @IsNumber()
    @Min(10)
    price: number

    @IsNumber()
    @Min(1)
    stock: number

    @IsString()
    categoryId: string
}
