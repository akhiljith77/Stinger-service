import { Category } from 'src/category/entities/category.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum Size {
  EXTRA_SMALL = 'XS',
  SMALL = 'S',
  MEDIUM = 'M',
  LARGE = 'L',
  EXTRA_LARGE = 'XL',
  DOUBLE_EXTRA_LARGE = '2XL',
  TRIPLE_EXTRA_LARGE = '3XL',

  UK6 = 'UK6',
  UK7 = 'UK7',
  UK8 = 'UK8',
  UK9 = 'UK9',
  UK10 = 'UK10',
  UK11 = 'UK11',
  UK12 = 'UK12',
}

@Entity('products')
export class Products {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column({ type: 'text', array: true, default: [], nullable: true })
  color: string[];

  @Column({
    type: 'enum',
    enum: Size,
    array: true,
    default: [],
    nullable: true,
  })
  size: Size[];

  @Column()
  stock: number;

  @ManyToOne(() => Category, (category) => category.products, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'categoryId' })
  category?: Category;

  @Column('uuid')
  categoryId: string;

  @Column({ type: 'text', array: true, default: [], nullable: true })
  imageURLs: string[];
}
