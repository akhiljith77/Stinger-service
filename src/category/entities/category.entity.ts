import { Products } from 'src/products/entities/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum CategoryType {
  MEN = 'Men',
  WOMEN = 'Women',
  KIDS = 'Kids',
  SHOES = 'Shoes',
  ACCESSORIES = 'Accessories',
}

@Entity('category')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: CategoryType;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => Products, (product) => product.category)
  products: Products[];
  length: any;
}
