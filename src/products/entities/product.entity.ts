import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('products')
export class Products {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column()
    name:string

    @Column()
    description:string

    @Column()
    price:number

    @Column()
    stock:number

    @Column('uuid')
    categoryId:string
}
